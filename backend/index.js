require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const { errorHandler } = require("./middleware/error");
const morgan = require("morgan");
const path = require("path");
const fs = require("fs");

// Create express app
const app = express();

// Setup logging
const logDirectory = path.join(__dirname, "logs");
// Ensure log directory exists
if (!fs.existsSync(logDirectory)) {
  fs.mkdirSync(logDirectory);
}

// Create a write stream for logging
const accessLogStream = fs.createWriteStream(
  path.join(logDirectory, "access.log"),
  { flags: "a" }
);

// Setup middleware
app.use(cors({ origin: "*" }));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Setup logging middleware
app.use(morgan("dev")); // Log to console
app.use(morgan("combined", { stream: accessLogStream })); // Log to file

// Connect to MongoDB with default DB name if not provided
let mongoUri = process.env.MONGODB_URI;
if (mongoUri && (mongoUri.endsWith("/") || mongoUri.endsWith(":27017"))) {
  mongoUri = mongoUri.replace(/\/?$/, "/wakemeup");
}

mongoose
  .connect(mongoUri)
  .then(() => console.log("MongoDB connected to", mongoUri))
  .catch((err) => console.error("MongoDB connection error:", err));

// Set up Mongoose debugging in development
if (process.env.NODE_ENV !== "production") {
  mongoose.set("debug", true);
}

// Base route
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "WakeMeUp API is running",
    version: "1.0.0",
    docs: "/api-docs",
  });
});

// API routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/users", require("./routes/users"));
app.use("/api/trips", require("./routes/trips"));
app.use("/api/expenses", require("./routes/expenses"));
app.use("/api/weather", require("./routes/weather"));
app.use("/api/routes", require("./routes/routes"));

// Catch 404 and forward to error handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: `API endpoint not found: ${req.method} ${req.url}`,
  });
});

// Error handling middleware
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () =>
  console.log(`Server running on port ${PORT}`)
);

// Handle unhandled promise rejections
process.on("unhandledRejection", (err) => {
  console.error("UNHANDLED REJECTION:", err);
  // Close server & exit process
  server.close(() => process.exit(1));
});
