# 📚 Library API (Express + Mongoose + TypeScript)

A RESTful API for managing a library system — built with **Express.js**, **Mongoose**, and **TypeScript**.

This API allows you to:
- 📘 Create, read, filter, and sort books
- 📥 Borrow books with inventory control
- 📊 View borrowed books summary with aggregation

---

## 🚀 Project Setup

### ✅ Requirements
- Node.js ≥ 18
- MongoDB Atlas or Local MongoDB
- npm / yarn

---

### 📦 Installation

```bash
# Clone the repo
git clone https://github.com/your-username/library-api.git
cd library-api

# Install dependencies
npm install

# Environment setup
cp .env.example .env
# Then update Mongo URI inside .env
```

### ⚙️ .env Example

```
PORT=3000
MONGO_URI=mongodb://localhost:27017/library-db
```

---

### 🔧 Run the Project

```bash
# Run in dev mode with ts-node-dev
npm run dev
```

---

## 📚 API Endpoints

---

### 1. ✅ Create a Book

**POST** `/api/books`

#### Request Body

```json
{
  "title": "The Theory of Everything",
  "author": "Stephen Hawking",
  "genre": "SCIENCE",
  "isbn": "9780553380163",
  "description": "An overview of cosmology and black holes.",
  "copies": 5,
  "available": true
}
```

#### Response (201)

```json
{
  "success": true,
  "message": "Book created successfully",
  "data": { ...book }
}
```

---

### 2. 📖 Get All Books (Supports filter, sort, limit)

**GET** `/api/books?filter=FANTASY&sortBy=createdAt&sort=desc&limit=5`

#### Query Params

| Param     | Type   | Description                      |
|-----------|--------|----------------------------------|
| `filter`  | string | Genre filter                     |
| `sortBy`  | string | Field to sort by (default: createdAt) |
| `sort`    | string | `asc` or `desc` (default: asc)   |
| `limit`   | number | Number of results (default: 10)  |

#### Response (200)

```json
{
  "success": true,
  "message": "Books retrieved successfully",
  "data": [ ...books ]
}
```

---

### 3. 📥 Borrow a Book

**POST** `/api/borrow`

#### Request Body

```json
{
  "book": "64ab3f9e2a4b5c6d7e8f9012",
  "quantity": 2,
  "dueDate": "2025-07-18T00:00:00.000Z"
}
```

#### Business Logic

- Checks if enough copies are available
- Deducts borrowed copies
- If remaining copies = 0 → sets `available: false`
- Creates a borrow record

#### Response (200)

```json
{
  "success": true,
  "message": "Book borrowed successfully",
  "data": {
    "_id": "64bc4a0f9e1c2d3f4b5a6789",
    "book": "64ab3f9e2a4b5c6d7e8f9012",
    "quantity": 2,
    "dueDate": "2025-07-18T00:00:00.000Z",
    "createdAt": "2025-06-18T07:12:15.123Z",
    "updatedAt": "2025-06-18T07:12:15.123Z"
  }
}
```

---

### 4. 📊 Borrowed Books Summary (Aggregation)

**GET** `/api/borrow`

#### Response (200)

```json
{
  "success": true,
  "message": "Borrowed books summary retrieved successfully",
  "data": [
    {
      "book": {
        "title": "The Theory of Everything",
        "isbn": "9780553380163"
      },
      "totalQuantity": 5
    },
    {
      "book": {
        "title": "1984",
        "isbn": "9780451524935"
      },
      "totalQuantity": 3
    }
  ]
}
```

---

## ✅ Schema Validation

- Validated using **Zod**
- Errors return standardized messages
- Example:

```json
{
  "message": "Internal Server Error",
  "success": false,
  "error": {
    "issues": [
      {
        "code": "custom",
        "message": "Due date must be in the future",
        "path": ["dueDate"]
      }
    ],
    "name": "ZodError"
  }
}
```

---

## 🔧 Tech Stack

- 🧠 **Node.js**, **Express.js**
- 🛢 **MongoDB**, **Mongoose**
- 🧾 **Zod** for schema validation
- 🔧 **TypeScript**
-  Mongoose query middleware for filtering/sorting
-  

---
