const fs = require("fs");
const path = require("path");

// Define the directory structure
const structure = {
  src: {
    config: {
      "db.js": `const sqlite3 = require("sqlite3").verbose();
const path = require("path");
require("dotenv").config();

// Get the database path from environment variable
const dbPath = path.resolve(__dirname, "../../", process.env.DATABASE_PATH);

// Initialize the SQLite database
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error("Error opening database: " + err.message);
  } else {
    console.log("Connected to the SQLite database.");
    // Create the transactions table if it doesn't exist
    db.run(\`CREATE TABLE IF NOT EXISTS transactions (
              id INTEGER PRIMARY KEY AUTOINCREMENT,
              type TEXT NOT NULL,
              category TEXT NOT NULL,
              amount REAL NOT NULL,
              date TEXT NOT NULL,
              description TEXT
            )\`, (err) => {
      if (err) {
        console.error("Error creating table: " + err.message);
      }
    });
  }
});

module.exports = db;`,
    },
    controllers: {
      "transactionsController.js": `const db = require("../config/db");

// Add a new transaction
const addTransaction = (req, res) => {
  const { type, category, amount, date, description } = req.body;

  const query = \`INSERT INTO transactions (type, category, amount, date, description)
                 VALUES (?, ?, ?, ?, ?)\`;
  const params = [type, category, amount, date, description];

  db.run(query, params, function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).json({ id: this.lastID });
  });
};

// Get all transactions
const getTransactions = (req, res) => {
  const query = \`SELECT * FROM transactions\`;

  db.all(query, [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(200).json(rows);
  });
};

// Get a single transaction by ID
const getTransactionById = (req, res) => {
  const id = req.params.id;
  const query = \`SELECT * FROM transactions WHERE id = ?\`;

  db.get(query, [id], (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!row) return res.status(404).json({ message: "Transaction not found" });
    res.status(200).json(row);
  });
};

// Update a transaction by ID
const updateTransaction = (req, res) => {
  const id = req.params.id;
  const { type, category, amount, date, description } = req.body;

  const query = \`UPDATE transactions SET type = ?, category = ?, amount = ?, date = ?, description = ?
                 WHERE id = ?\`;
  const params = [type, category, amount, date, description, id];

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
  const query = \`DELETE FROM transactions WHERE id = ?\`;

  db.run(query, [id], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    if (this.changes === 0)
      return res.status(404).json({ message: "Transaction not found" });
    res.status(200).json({ message: "Transaction deleted successfully" });
  });
};

// Get summary of income, expense, and balance
const getSummary = (req, res) => {
  const query = \`SELECT
                   SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END) AS totalIncome,
                   SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END) AS totalExpense,
                   SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END) - SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END) AS balance
                 FROM transactions\`;

  db.get(query, [], (err, row) => {
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
};`,
    },
    middleware: {
      "errorHandler.js": `const errorHandler = (err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Internal Server Error" });
};

module.exports = errorHandler;`,
      "validateTransaction.js": `const Joi = require("joi");

// Define the transaction schema
const transactionSchema = Joi.object({
  type: Joi.string().valid("income", "expense").required(),
  category: Joi.string().required(),
  amount: Joi.number().greater(0).required(),
  date: Joi.date().iso().required(),
  description: Joi.string().optional(),
});

// Middleware for validating transaction input
const validateTransaction = (req, res, next) => {
  const { error } = transactionSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  next();
};

module.exports = validateTransaction;`,
    },
    routes: {
      "transactionRoutes.js": `const express = require("express");
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

// Define transaction routes
router.post("/transactions", validateTransaction, addTransaction);
router.get("/transactions", getTransactions);
router.get("/transactions/:id", getTransactionById);
router.put("/transactions/:id", validateTransaction, updateTransaction);
router.delete("/transactions/:id", deleteTransaction);
router.get("/summary", getSummary);

module.exports = router;`,
    },
  },
  "app.js": `const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const transactionRoutes = require("./src/routes/transactionRoutes");
const errorHandler = require("./src/middleware/errorHandler");
const logger = require("./src/utils/logger");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(logger); // Logging middleware
app.use("/api", transactionRoutes);
app.use(errorHandler); // Error handling middleware

app.listen(PORT, () => {
  console.log(\`Server is running on port \${PORT}\`);
});`,
  ".env": `DATABASE_PATH=./db/expense-tracker.db
PORT=3000`,
  "package.json": `{
  "name": "expense-tracker",
  "version": "1.0.0",
  "main": "app.js",
  "scripts": {
    "start": "node app.js"
  },
  "dependencies": {
    "express": "^4.17.1",
    "cors": "^2.8.5",
    "body-parser": "^1.19.0",
    "sqlite3": "^5.0.2",
    "joi": "^17.6.0",
    "dotenv": "^10.0.0"
  }
}`,
};

// Function to create the directory structure
const createStructure = (basePath, structure) => {
  for (const key in structure) {
    const currentPath = path.join(basePath, key);

    if (typeof structure[key] === "object") {
      // Create directory
      fs.mkdirSync(currentPath, { recursive: true });
      createStructure(currentPath, structure[key]); // Recursive call
    } else {
      // Create file
      fs.writeFileSync(currentPath, structure[key], { encoding: "utf8" });
    }
  }
};

// Start creating the structure
const basePath = path.resolve(__dirname);
createStructure(basePath, structure);
console.log("Project structure created successfully!");
