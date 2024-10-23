const express = require("express");
const router = express.Router();
const {
  addTransaction,
  getTransactions,
  getTransactionById,
  updateTransaction,
  deleteTransaction,
  getSummary,
} = require("../controllers/transactionsController");

// Move console logs after the destructuring assignment
console.log("Loading transaction routes...");
console.log({
  addTransaction,
  getTransactions,
  getTransactionById,
  updateTransaction,
  deleteTransaction,
  getSummary,
});

const validateTransaction = require("../middleware/validateTransaction");
const authenticateToken = require("../middleware/authenticate"); // Import authenticate middleware

// Define transaction routes
router.post(
  "/transactions",
  authenticateToken,
  validateTransaction,
  addTransaction
);
router.get("/transactions", authenticateToken, getTransactions);
router.get("/transactions/:id", authenticateToken, getTransactionById);
router.put(
  "/transactions/:id",
  authenticateToken,
  validateTransaction,
  updateTransaction
);
router.delete("/transactions/:id", authenticateToken, deleteTransaction);
router.get("/summary", authenticateToken, getSummary);

module.exports = router;
