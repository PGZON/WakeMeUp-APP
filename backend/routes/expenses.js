const express = require("express");
const Expense = require("../models/Expense");
const Trip = require("../models/Trip");
const { protect } = require("../middleware/auth");
const router = express.Router();

// @desc    Create a new expense for a trip
// @route   POST /api/expenses
// @access  Private
router.post("/", protect, async (req, res, next) => {
  try {
    const { tripId } = req.body;

    // Verify trip exists and belongs to user
    const trip = await Trip.findOne({ _id: tripId, userId: req.user._id });
    if (!trip) {
      return res
        .status(404)
        .json({ success: false, error: "Trip not found or unauthorized" });
    }

    const expense = new Expense(req.body);
    await expense.save();

    // Add expense reference to trip
    trip.expenses.push(expense._id);
    await trip.save();

    res.status(201).json({
      success: true,
      message: "Expense created",
      expenseId: expense._id,
      expense,
    });
  } catch (err) {
    next(err);
  }
});

// @desc    Get all expenses for a trip
// @route   GET /api/expenses?tripId=...
// @access  Private
router.get("/", protect, async (req, res, next) => {
  try {
    const { tripId, category, sortBy, startDate, endDate } = req.query;

    if (!tripId) {
      return res
        .status(400)
        .json({ success: false, error: "Trip ID is required" });
    }

    // Verify trip belongs to user
    const trip = await Trip.findOne({ _id: tripId, userId: req.user._id });
    if (!trip) {
      return res
        .status(404)
        .json({ success: false, error: "Trip not found or unauthorized" });
    }

    // Build query
    const query = { tripId };

    // Filter by category if provided
    if (category) {
      query.category = category;
    }

    // Filter by date range if provided
    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) {
        query.createdAt.$gte = new Date(startDate);
      }
      if (endDate) {
        query.createdAt.$lte = new Date(endDate);
      }
    }

    // Build sort options
    let sort = {};
    if (sortBy === "newest") {
      sort = { createdAt: -1 };
    } else if (sortBy === "oldest") {
      sort = { createdAt: 1 };
    } else if (sortBy === "amount_high") {
      sort = { amount: -1 };
    } else if (sortBy === "amount_low") {
      sort = { amount: 1 };
    } else {
      // Default sort
      sort = { createdAt: -1 };
    }

    const expenses = await Expense.find(query).sort(sort);

    // Calculate total amount
    const total = expenses.reduce((sum, expense) => sum + expense.amount, 0);

    // Group expenses by category
    const byCategory = {};
    expenses.forEach((expense) => {
      const category = expense.category || "Uncategorized";
      if (!byCategory[category]) {
        byCategory[category] = { count: 0, total: 0 };
      }
      byCategory[category].count++;
      byCategory[category].total += expense.amount;
    });

    res.json({
      success: true,
      count: expenses.length,
      total,
      byCategory,
      expenses,
    });
  } catch (err) {
    next(err);
  }
});

// @desc    Get a single expense by ID
// @route   GET /api/expenses/:id
// @access  Private
router.get("/:id", protect, async (req, res, next) => {
  try {
    const expense = await Expense.findById(req.params.id);

    if (!expense) {
      return res
        .status(404)
        .json({ success: false, error: "Expense not found" });
    }

    // Verify expense belongs to user's trip
    const trip = await Trip.findOne({
      _id: expense.tripId,
      userId: req.user._id,
    });

    if (!trip) {
      return res
        .status(403)
        .json({
          success: false,
          error: "Not authorized to access this expense",
        });
    }

    res.json({
      success: true,
      expense,
    });
  } catch (err) {
    next(err);
  }
});

// @desc    Update an expense
// @route   PUT /api/expenses/:id
// @access  Private
router.put("/:id", protect, async (req, res, next) => {
  try {
    const expense = await Expense.findById(req.params.id);

    if (!expense) {
      return res
        .status(404)
        .json({ success: false, error: "Expense not found" });
    }

    // Verify expense belongs to user's trip
    const trip = await Trip.findOne({
      _id: expense.tripId,
      userId: req.user._id,
    });

    if (!trip) {
      return res
        .status(403)
        .json({
          success: false,
          error: "Not authorized to update this expense",
        });
    }

    // Cannot change tripId
    delete req.body.tripId;

    const updatedExpense = await Expense.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.json({
      success: true,
      message: "Expense updated",
      expense: updatedExpense,
    });
  } catch (err) {
    next(err);
  }
});

// @desc    Delete an expense
// @route   DELETE /api/expenses/:id
// @access  Private
router.delete("/:id", protect, async (req, res, next) => {
  try {
    const expense = await Expense.findById(req.params.id);

    if (!expense) {
      return res
        .status(404)
        .json({ success: false, error: "Expense not found" });
    }

    // Verify expense belongs to user's trip
    const trip = await Trip.findOne({
      _id: expense.tripId,
      userId: req.user._id,
    });

    if (!trip) {
      return res
        .status(403)
        .json({
          success: false,
          error: "Not authorized to delete this expense",
        });
    }

    // Remove expense reference from trip
    trip.expenses = trip.expenses.filter(
      (expId) => expId.toString() !== req.params.id
    );
    await trip.save();

    // Delete expense
    await expense.remove();

    res.json({
      success: true,
      message: "Expense deleted",
    });
  } catch (err) {
    next(err);
  }
});

// @desc    Get expense statistics
// @route   GET /api/expenses/stats/:tripId
// @access  Private
router.get("/stats/:tripId", protect, async (req, res, next) => {
  try {
    // Verify trip belongs to user
    const trip = await Trip.findOne({
      _id: req.params.tripId,
      userId: req.user._id,
    });

    if (!trip) {
      return res
        .status(404)
        .json({ success: false, error: "Trip not found or unauthorized" });
    }

    // Get all expenses for the trip
    const expenses = await Expense.find({ tripId: req.params.tripId });

    // Calculate statistics
    const stats = {
      totalCount: expenses.length,
      totalAmount: 0,
      averageAmount: 0,
      byCategory: {},
      byDay: {},
    };

    if (expenses.length > 0) {
      // Calculate total and average
      stats.totalAmount = expenses.reduce(
        (sum, expense) => sum + expense.amount,
        0
      );
      stats.averageAmount = stats.totalAmount / expenses.length;

      // Group by category
      expenses.forEach((expense) => {
        const category = expense.category || "Uncategorized";
        if (!stats.byCategory[category]) {
          stats.byCategory[category] = { count: 0, total: 0 };
        }
        stats.byCategory[category].count++;
        stats.byCategory[category].total += expense.amount;
      });

      // Group by day
      expenses.forEach((expense) => {
        const day = expense.createdAt.toISOString().split("T")[0];
        if (!stats.byDay[day]) {
          stats.byDay[day] = { count: 0, total: 0 };
        }
        stats.byDay[day].count++;
        stats.byDay[day].total += expense.amount;
      });
    }

    res.json({
      success: true,
      tripId: req.params.tripId,
      stats,
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
