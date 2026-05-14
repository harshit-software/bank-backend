# 🏦 Ledger-Based Banking Backend (MERN)

A scalable banking backend system built using **Node.js, Express, MongoDB, and JWT authentication**.

This project focuses on:

- immutable ledger architecture
- atomic transactions
- idempotent transaction handling
- secure authentication
- transaction consistency

Designed to simulate core backend concepts used in modern fintech systems.

---

# 🚀 Live API

Base URL:  
https://bank-backend-h1g7.onrender.com

> Note: API may take a few seconds to respond initially due to Render free-tier cold starts.

---

# ✨ Features

## 🔐 Authentication

- User Registration & Login
- JWT-based Authentication
- Cookie-based Authentication
- Protected Routes
- Secure Logout System
- Token Blacklisting

---

## 💳 Banking System

- Create Bank Account
- Retrieve Account Balance
- One Account Per User
- Ledger-based balance computation

---

## 💸 Transaction System

- Transfer Funds Between Accounts
- MongoDB Atomic Transactions
- Transaction Status Tracking
- Duplicate Transaction Prevention
- Idempotency Key Validation

---

## 📜 Ledger System

- Immutable Ledger Entries
- Credit/Debit Tracking
- Tamper-resistant Records
- Ledger-based Balance Calculation

---

## 🔒 Security

- Password hashing using bcrypt
- JWT Authentication Middleware
- Blacklisted Logout Tokens
- Protected APIs

---

# 🛠️ Tech Stack

| Technology    | Purpose          |
| ------------- | ---------------- |
| Node.js       | Backend Runtime  |
| Express.js    | API Framework    |
| MongoDB       | Database         |
| Mongoose      | ODM              |
| JWT           | Authentication   |
| bcryptjs      | Password Hashing |
| cookie-parser | Cookie Handling  |
| Nodemailer    | Email Service    |

---

# 📂 Project Structure

```bash
bank-backend/
│
├── src/
│   ├── config/          # Database configuration
│   ├── controllers/     # Business logic
│   ├── middlewares/     # Auth & transaction middleware
│   ├── models/          # Database schemas
│   ├── routes/          # API routes
│   ├── services/        # External services
│   └── app.js
│
├── .env
├── package.json
├── server.js
└── README.md
```

---

# ⚙️ Setup Instructions

## 1️⃣ Clone Repository

```bash
git clone https://github.com/harshit-software/bank-backend.git
cd bank-backend
```

---

## 2️⃣ Install Dependencies

```bash
npm install
```

---

## 3️⃣ Create `.env` File

```env
PORT=5000

MONGO_URI=your_mongodb_connection

JWT_SECRET=your_jwt_secret

BASE_URL=http://localhost:5000

EMAIL_USER=your_email

CLIENT_ID=your_google_client_id
CLIENT_SECRET=your_google_client_secret
REFRESH_TOKEN=your_google_refresh_token
```

---

## 4️⃣ Run Server

```bash
npm run dev
```

---

# 📌 API Endpoints

## 🔐 Auth Routes

- POST `/api/auth/register`
- POST `/api/auth/login`
- POST `/api/auth/logout`

---

## 🏦 Account Routes

- POST `/api/account`
- GET `/api/account`

---

## 💸 Transaction Routes

- POST `/api/transaction`
- POST `/api/transaction/initiate-funds`

---

# 🔒 Authentication

Protected routes require JWT authentication using cookies.

---

# 🧠 Core Backend Concepts Implemented

## ✅ Immutable Ledger Architecture

Balances are calculated from ledger entries instead of directly mutating balances.

Benefits:

- consistency
- auditability
- transaction integrity

---

## ✅ MongoDB Transactions

MongoDB sessions are used for atomic transaction processing to prevent inconsistent database states.

---

## ✅ Idempotent Transactions

Duplicate transaction requests are prevented using unique idempotency keys.

---

# ⚠️ Current Limitations

- No Redis caching
- No rate limiting
- No refresh token system
- No pagination
- No monitoring/logging system
- Email service depends directly on Gmail

---

# 🚀 Future Improvements

- Redis-based caching
- Refresh token authentication
- Queue-based email processing
- Pagination & filtering
- Centralized error handling
- Zod/Joi validation
- Winston logging
- Docker support
- Unit & integration testing
- CI/CD pipeline

---

# 🧠 What This Project Demonstrates

- REST API architecture
- Secure authentication system
- Transaction consistency handling
- Immutable ledger design
- MongoDB transaction sessions
- Fintech backend concepts
- Backend scalability fundamentals

---

# 👨‍💻 Author

**Harshit Agrawal**

- Backend Developer (Node.js | MongoDB)
- Email: harshit.agr.1511@gmail.com
- GitHub: https://github.com/harshit-software
- LinkedIn: https://linkedin.com/in/harshit-software

---

# ⭐ Support

If you found this project useful, give it a ⭐ on GitHub.
