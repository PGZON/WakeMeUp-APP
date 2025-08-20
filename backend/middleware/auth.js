const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Protect routes - require authentication
exports.protect = async (req, res, next) => {
  let token;

  // Check if token exists in authorization header
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  // Check if no token
  if (!token) {
    return res
      .status(401)
      .json({ success: false, error: "Not authorized to access this route" });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach user to request object
    req.user = await User.findById(decoded.id);

    if (!req.user) {
      return res
        .status(401)
        .json({ success: false, error: "User no longer exists" });
    }

    next();
  } catch (error) {
    return res
      .status(401)
      .json({ success: false, error: "Not authorized to access this route" });
  }
};

// Generate JWT token
exports.generateToken = (user) => {
  return jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: "30d", // Token expires in 30 days
  });
};
