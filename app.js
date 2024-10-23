const express = require("express");
const cors = require("cors");
require("dotenv").config();
const bodyParser = require("body-parser");
const transactionRoutes = require("./src/routes/transactionRoutes");
const authRoutes = require("./src/routes/authRoutes");
const errorHandler = require("./src/middleware/errorHandler");
const logger = require("./src/utils/logger");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(logger);

// Log the JWT secret for debugging (ensure this is removed in production)
console.log("JWT_SECRET:", process.env.JWT_SECRET);

// Ensure your routes are correctly prefixed
app.use("/api/auth", authRoutes); // Adjusted route prefix for auth
app.use("/api/transactions", transactionRoutes); // Adjusted route prefix for transactions

// Error handler middleware
app.use(errorHandler);

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
