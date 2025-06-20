# 📚 Library API (Express + Mongoose + TypeScript)

A RESTful API for managing a library system — built with **Express.js**, **Mongoose**, and **TypeScript**.

This API allows you to:
- 📘 Create, read, filter, and sort books
- 📥 Borrow books with inventory control
- 📊 View borrowed books summary with aggregation

---

## 🚀 Project Setup

### ✅ Requirements
- Node.js
- MongoDB Atlas or Local MongoDB
- npm / yarn

---

### 📦 Installation

```bash
# Clone the repo
git clone https://github.com/muhamash/library-api.git
cd library-api

# Install dependencies
npm install

# Environment setup
cp .env
# Then update Mongo URI inside .env

# Run in dev mode with ts-node-dev
npm run dev
