const db = require("../config/db");

// Add a new transaction
const addTransaction = (req, res) => {
  const { type, category, amount, date, description } = req.body;
  const userId = req.user.id; // Get the user ID from the authenticated user

  const query = `INSERT INTO transactions (type, category, amount, date, description, userId)
                 VALUES (?, ?, ?, ?, ?, ?)`;
  const params = [type, category, amount, date, description, userId];

  db.run(query, params, function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).json({ id: this.lastID });
  });
};

// Get all transactions
const getTransactions = (req, res) => {
  const userId = req.user.id; // Get the user ID from the authenticated user
  const query = `SELECT * FROM transactions WHERE userId = ?`;

  db.all(query, [userId], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(200).json(rows);
  });
};

// Get a single transaction by ID
const getTransactionById = (req, res) => {
  const id = req.params.id;
  const userId = req.user.id; // Get the user ID from the authenticated user
  const query = `SELECT * FROM transactions WHERE id = ? AND userId = ?`;

  db.get(query, [id, userId], (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!row) return res.status(404).json({ message: "Transaction not found" });
    res.status(200).json(row);
  });
};

// Update a transaction by ID
const updateTransaction = (req, res) => {
  const id = req.params.id;
  const { type, category, amount, date, description } = req.body;
  const userId = req.user.id; // Get the user ID from the authenticated user

  const query = `UPDATE transactions SET type = ?, category = ?, amount = ?, date = ?, description = ?
                 WHERE id = ? AND userId = ?`;
  const params = [type, category, amount, date, description, id, userId];

  db.run(query, params, function (err) {
    if (err) return res.status(500).json({ error: err.message });
    if (this.changes === 0)
      return res.status(404).json({ message: "Transaction not found" });
    res.status(200).json({ message: "Transaction updated successfully" });
  });
};

// Delete a transaction by ID
const deleteTransaction = (req, res) => {
  const id = req.params.id;
  const userId = req.user.id; // Get the user ID from the authenticated user
  const query = `DELETE FROM transactions WHERE id = ? AND userId = ?`;

  db.run(query, [id, userId], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    if (this.changes === 0)
      return res.status(404).json({ message: "Transaction not found" });
    res.status(200).json({ message: "Transaction deleted successfully" });
  });
};

// Get summary of income, expense, and balance
const getSummary = (req, res) => {
  const userId = req.user.id; // Get the user ID from the authenticated user
  const query = `SELECT
                   SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END) AS totalIncome,
                   SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END) AS totalExpense,
                   SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END) - SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END) AS balance
                 FROM transactions WHERE userId = ?`;

  db.get(query, [userId], (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(200).json(row);
  });
};

module.exports = {
  addTransaction,
  getTransactions,
  getTransactionById,
  updateTransaction,
  deleteTransaction,
  getSummary,
};
