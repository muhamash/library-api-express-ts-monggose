# 📚 Library Management API (Express + Mongoose + TypeScript)

A robust RESTful API for managing a library system, built with **Express.js**, **Mongoose**, and **TypeScript**.

---

## 🚀 Overview

This API provides endpoints to manage books and their borrowing transactions with features like:

- Full CRUD operations on **Books**  
- Borrowing books with inventory checks and business logic enforcement  
- Aggregated summaries of borrowed books  
- Schema validation and error handling with **Zod**  
- Use of Mongoose middleware (pre/post hooks) and static methods  
- Support for filtering, sorting, and pagination  

---

## 🧩 Features

- **Book Management:** Create, Read (single & list), Update, and Delete books with strict validation  
- **Borrowing System:** Borrow books with checks on availability, automatic stock updates  
- **Aggregation:** Get summaries of borrowed books using MongoDB aggregation pipeline  
- **Data Integrity:** Cascading deletes — deleting a book also deletes its borrow records  
- **Validation:** Request bodies validated with Zod schemas providing clear error messages  
- **Error Handling:** Standardized JSON error responses for client and server errors  

---

## 📋 Tech Stack

| Technology       | Purpose                             |
|------------------|-----------------------------------|
| Node.js          | Runtime environment                |
| Express.js       | Web framework                     |
| TypeScript       | Static typing and tooling          |
| MongoDB          | NoSQL document database           |
| Mongoose         | ODM for MongoDB                   |
| Zod              | Schema validation and parsing     |

---

## ⚙️ Project Setup

### Requirements

- Node.js ≥ 18  
- MongoDB (Atlas or local instance)  
- npm or yarn  

---

### Installation

```bash
# Clone repository
git clone https://github.com/muhamash/library-api-express-ts-monggose.git
cd library-api-express-ts-monggose-main

# Install dependencies
npm install

# Copy example environment variables
cp .env

# Edit .env to set your MongoDB connection string and port
```

### .env File

```ini
PORT=3000
MONGO_URI=mongodb://localhost:27017/library-db
```

### Running the Server

```bash
# Start development server with live reload
npm run dev

# Or build and start production server
npm run build
npm start
```

---

## 📚 API Endpoints & Usage

### 1. Create a Book

**URL:** `POST /api/books`

**Purpose:** Add a new book to the library collection

**Request Body:**

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

**Response (201):**

```json
{
  "success": true,
  "message": "Book created successfully",
  "data": {
    "_id": "64f123abc4567890def12345",
    "title": "The Theory of Everything",
    "author": "Stephen Hawking",
    "genre": "SCIENCE",
    "isbn": "9780553380163",
    "description": "An overview of cosmology and black holes.",
    "copies": 5,
    "available": true,
    "createdAt": "2024-11-19T10:23:45.123Z",
    "updatedAt": "2024-11-19T10:23:45.123Z"
  }
}
```

---

### 2. Get All Books

**URL:** `GET /api/books`

**Query Parameters:**

- `filter` (optional): Filter by book genre (e.g., SCIENCE, FANTASY)
- `sortBy` (optional): Field to sort by, default `createdAt`
- `sort` (optional): `asc` or `desc`, default `asc`
- `limit` (optional): Number of books to return, default `10`

**Example:** `/api/books?filter=FANTASY&sortBy=createdAt&sort=desc&limit=5`

**Response (200):**

```json
{
  "success": true,
  "message": "Books retrieved successfully",
  "data": [ /* array of book objects */ ]
}
```

---

### 3. Get Book by ID

**URL:** `GET /api/books/:bookId`

**Response (200):**

```json
{
  "success": true,
  "message": "Book retrieved successfully",
  "data": { /* single book object */ }
}
```

**Error 404:** If book not found, returns

```json
{
  "success": false,
  "message": "Book not found",
  "data": null
}
```

---

### 4. Update Book

**URL:** `PUT /api/books/:bookId`

**Request Body:** Any subset of book fields (title, author, genre, isbn, description, copies, available)

**Example:**

```json
{
  "copies": 50
}
```

**Response (200):**

```json
{
  "success": true,
  "message": "Book updated successfully",
  "data": { /* updated book object */ }
}
```

**Validation:** At least one field must be present. Invalid inputs return a 400 with validation errors.

---

### 5. Delete Book

**URL:** `DELETE /api/books/:bookId`

**Response (200):**

```json
{
  "success": true,
  "message": "Book deleted successfully",
  "data": null
}
```

**Note:** Deleting a book also deletes all borrow records referencing that book (handled by Mongoose post middleware).

---

### 6. Borrow a Book

**URL:** `POST /api/borrow`

**Request Body:**

```json
{
  "book": "64ab3f9e2a4b5c6d7e8f9012",
  "quantity": 2,
  "dueDate": "2025-07-18T00:00:00.000Z"
}
```

**Business Logic:**

- Checks if requested quantity is available
- Deducts the quantity from the book's copies
- Sets available to false if copies reach zero
- Saves the borrow record

**Response (200):**

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

**Errors:**

- 400 if quantity requested is more than available copies
- 404 if book not found

---

### 7. Borrowed Books Summary

**URL:** `GET /api/borrow`

**Purpose:** Returns summary of borrowed books, including total borrowed quantity per book

**Response (200):**

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

## ⚠️ Error Handling & Validation

- All input data validated via Zod schemas
- Invalid inputs result in 400 Bad Request with detailed messages

**Generic error format:**

```json
{
  "message": "Validation failed",
  "success": false,
  "error": {
    "name": "ValidationError",
    "errors": {
      "copies": {
        "message": "Copies must be a positive number",
        "name": "ValidatorError",
        "properties": {
          "message": "Copies must be a positive number",
          "type": "min",
          "min": 0
        },
        "kind": "min",
        "path": "copies",
        "value": -5
      }
    }
  }
}
```

- 404 responses for not found resources are standardized
- 500 responses include error message for internal server errors

---

## 🛠 Architecture & Code Highlights

- **Mongoose Models:** Book and Borrow schemas with validation and references
- **Interfaces and Types** Interfaces and types for Book and Borrow Schema
- **Static Methods:** e.g., adjusting book copies after borrowing
- **Middleware:**
  - `pre` middleware to normalize queries ( genre uppercase)
  - `post` middleware to cascade delete borrow records when a book is deleted
- **Aggregation Pipeline:** For summary endpoint to group and sum borrowed books
- **Controllers:** Separate controllers handle business logic and data validation
- **Validation:** Using Zod schemas for request validation, with reusable and extendable schemas

---

## 📁 Project Structure

```
src/
├── controllers/
│   ├── book.controller.ts
│   ├── borrow.controller.ts
├── models/
│   ├── book.model.ts
│   ├── borrow.model.ts
├── routes/
│   ├── book.routes.ts
│   ├── borrow.routes.ts
├── schemas/
│   ├── book.schema.ts
│   ├── borrow.schema.ts
├── utils/
│   └── helper.ts
├── app.ts
└── server.ts
```