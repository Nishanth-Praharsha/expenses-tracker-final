Expense Tracker API

Overview

The Expense Tracker API allows users to manage their personal financial records, including tracking transactions and user authentication. This API provides endpoints for user registration, login, and managing financial transactions.

Base URL

http://localhost:3000/api

Endpoints

User Registration

- POST /auth/register

  Request Body:
  {
  "username": "your_username",
  "password": "your_password"
  }

  Response:

  - 201 Created
    {
    "userId": 1
    }

  - 400 Bad Request (if username or password is missing)
    {
    "message": "Username and password are required"
    }

  - 400 Bad Request (if there is a database error)
    {
    "error": "Error message"
    }

User Login

- POST /auth/login

  Request Body:
  {
  "username": "your_username",
  "password": "your_password"
  }

  Response:

  - 200 OK
    {
    "token": "your_jwt_token"
    }

  - 401 Unauthorized (if username or password is invalid)
    {
    "message": "Invalid username or password"
    }

Transaction Management

- POST /transactions: Adds a new transaction (income or expense).

  Headers:

  - Authorization: Bearer your_jwt_token

  Request Body:
  {
  "type": "expense",
  "category": "Food",
  "amount": 50.0,
  "date": "2024-10-23",
  "description": "Dinner at restaurant"
  }

  Response:

  - 201 Created
    {
    "id": 1
    }

  - 401 Unauthorized (if token is missing or invalid)
    {
    "message": "No token provided"
    }

  - 400 Bad Request (if data is invalid)
    {
    "error": "Error message"
    }

- GET /transactions: Retrieves all transactions.

  Headers:

  - Authorization: Bearer your_jwt_token

  Response:

  - 200 OK
    [
    {
    "id": 1,
    "type": "expense",
    "category": "Food",
    "amount": 50.0,
    "date": "2024-10-23",
    "description": "Dinner at restaurant"
    },
    ...
    ]

  - 401 Unauthorized (if token is missing or invalid)
    {
    "message": "No token provided"
    }

- GET /transactions/:id: Retrieves a transaction by ID.

  Headers:

  - Authorization: Bearer your_jwt_token

  Response:

  - 200 OK
    {
    "id": 1,
    "type": "expense",
    "category": "Food",
    "amount": 50.0,
    "date": "2024-10-23",
    "description": "Dinner at restaurant"
    }

  - 401 Unauthorized (if token is missing or invalid)
    {
    "message": "No token provided"
    }

  - 404 Not Found (if transaction ID does not exist)
    {
    "message": "Transaction not found"
    }

- PUT /transactions/:id: Updates a transaction by ID.

  Headers:

  - Authorization: Bearer your_jwt_token

  Request Body:
  {
  "type": "expense",
  "category": "Groceries",
  "amount": 75.0,
  "date": "2024-10-24",
  "description": "Weekly grocery shopping"
  }

  Response:

  - 200 OK
    {
    "message": "Transaction updated successfully"
    }

  - 401 Unauthorized (if token is missing or invalid)
    {
    "message": "No token provided"
    }

  - 404 Not Found (if transaction ID does not exist)
    {
    "message": "Transaction not found"
    }

- DELETE /transactions/:id: Deletes a transaction by ID.

  Headers:

  - Authorization: Bearer your_jwt_token

  Response:

  - 204 No Content (if successfully deleted)

  - 401 Unauthorized (if token is missing or invalid)
    {
    "message": "No token provided"
    }

  - 404 Not Found (if transaction ID does not exist)
    {
    "message": "Transaction not found"
    }

- GET /summary: Retrieves a summary of transactions, such as total income, total expenses, and balance. Optionally, this can be filtered by date range or category.

  Headers:

  - Authorization: Bearer your_jwt_token

  Response:

  - 200 OK
    {
    "totalIncome": 1000,
    "totalExpenses": 500,
    "balance": 500
    }

  - 401 Unauthorized (if token is missing or invalid)
    {
    "message": "No token provided"
    }

Environment Variables

Make sure to define the following environment variables in your .env file:

DATABASE_PATH=path/to/your/database.db
JWT_SECRET=your_jwt_secret_here

Getting Started

1. Clone the repository.
2. Navigate to the project directory.
3. Install the dependencies:
   npm install
4. Create the database file as specified in your .env.
5. Start the server:
   npm start
6. Use Postman or any other API client to test the endpoints.

License

This project is licensed under the MIT License - see the LICENSE file for details.
