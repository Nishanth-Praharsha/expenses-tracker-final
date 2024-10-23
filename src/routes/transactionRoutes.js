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

const validateTransaction = require("../middleware/validateTransaction");
const authenticateToken = require("../middleware/authenticate"); // Import authenticate middleware

// Define transaction routes (without the '/transactions' part)
router.post("/", authenticateToken, validateTransaction, addTransaction);
router.get("/", authenticateToken, getTransactions);
router.get("/:id", authenticateToken, getTransactionById);
router.put("/:id", authenticateToken, validateTransaction, updateTransaction);
router.delete("/:id", authenticateToken, deleteTransaction);
router.get("/summary", authenticateToken, getSummary);

module.exports = router;
