const sqlite3 = require("sqlite3").verbose();
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
    db.run(
      `CREATE TABLE IF NOT EXISTS transactions (
              id INTEGER PRIMARY KEY AUTOINCREMENT,
              type TEXT NOT NULL,
              category TEXT NOT NULL,
              amount REAL NOT NULL,
              date TEXT NOT NULL,
              description TEXT
            )`,
      (err) => {
        if (err) {
          console.error("Error creating transactions table: " + err.message);
        }
      }
    );

    // Create the users table if it doesn't exist
    db.run(
      `CREATE TABLE IF NOT EXISTS users (
              id INTEGER PRIMARY KEY AUTOINCREMENT,
              username TEXT UNIQUE NOT NULL,
              password TEXT NOT NULL
            )`,
      (err) => {
        if (err) {
          console.error("Error creating users table: " + err.message);
        }
      }
    );
  }
});

module.exports = db;
