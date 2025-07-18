const mongoose = require('mongoose');

const ExpenseSchema = new mongoose.Schema({
  tripId: { type: mongoose.Schema.Types.ObjectId, ref: 'Trip' },
  title: String,
  amount: Number,
  currency: String,
  category: String,
  photoUrl: String,
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Expense', ExpenseSchema); 