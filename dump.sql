PRAGMA foreign_keys=OFF;
BEGIN TRANSACTION;
CREATE TABLE transactions (
              id INTEGER PRIMARY KEY AUTOINCREMENT,
              type TEXT NOT NULL,
              category TEXT NOT NULL,
              amount REAL NOT NULL,
              date TEXT NOT NULL,
              description TEXT
            );
COMMIT;
