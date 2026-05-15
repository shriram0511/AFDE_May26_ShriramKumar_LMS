# API Documentation - Library Management System

Base URL: `http://localhost:8000`

Interactive Docs: `http://localhost:8000/docs`

---

## Books API

### GET /books/
Retrieve all books.

**Response:**
```json
[
  {
    "book_id": 1,
    "title": "Clean Code",
    "author": "Robert Martin",
    "category": "Programming",
    "isbn": "9780132350884",
    "availability_status": "available"
  }
]
```

---

### GET /books/{id}
Retrieve a book by ID.

**Response:**
```json
{
  "book_id": 1,
  "title": "Clean Code",
  "author": "Robert Martin",
  "category": "Programming",
  "isbn": "9780132350884",
  "availability_status": "available"
}
```

---

### POST /books/
Add a new book.

**Request Body:**
```json
{
  "title": "Clean Code",
  "author": "Robert Martin",
  "category": "Programming",
  "isbn": "9780132350884"
}
```

**Response:** `201 Created` — returns created book object.

---

### PUT /books/{id}
Update an existing book.

**Request Body:**
```json
{
  "title": "Clean Code",
  "author": "Robert Martin",
  "category": "Programming",
  "isbn": "9780132350884",
  "availability_status": "available"
}
```

**Response:** Returns updated book object.

---

### DELETE /books/{id}
Delete a book by ID. Also auto-closes any active transactions for that book.

**Response:**
```json
{
  "message": "Book deleted successfully"
}
```

---

## Borrowers API

### GET /borrowers/
Retrieve all borrowers.

**Response:**
```json
[
  {
    "borrower_id": 1,
    "borrower_name": "Rahul Sharma",
    "email": "rahul@gmail.com",
    "phone": "9876543210"
  }
]
```

---

### POST /borrowers/
Add a new borrower.

**Request Body:**
```json
{
  "borrower_name": "Rahul Sharma",
  "email": "rahul@gmail.com",
  "phone": "9876543210"
}
```

**Response:** Returns created borrower object.

---

### PUT /borrowers/{id}
Update borrower details.

**Request Body:**
```json
{
  "borrower_name": "Rahul Sharma",
  "email": "rahul@gmail.com",
  "phone": "9876543210"
}
```

**Response:** Returns updated borrower object.

---

### DELETE /borrowers/{id}
Delete a borrower by ID.

**Response:**
```json
{
  "message": "Borrower deleted successfully"
}
```

---

## Transaction APIs

### POST /borrow
Borrow an available book.

**Request Body:**
```json
{
  "book_id": 1,
  "borrower_id": 1
}
```

**Response:**
```json
{
  "transaction_id": 1,
  "book_id": 1,
  "borrower_id": 1,
  "book_title": "Clean Code",
  "borrower_name": "Rahul Sharma",
  "borrow_date": "2026-05-15T10:00:00",
  "return_date": null
}
```

---

### POST /return
Return a borrowed book.

**Request Body:**
```json
{
  "transaction_id": 1
}
```

**Response:**
```json
{
  "transaction_id": 1,
  "book_id": 1,
  "borrower_id": 1,
  "book_title": "Clean Code",
  "borrower_name": "Rahul Sharma",
  "borrow_date": "2026-05-15T10:00:00",
  "return_date": "2026-05-15T14:00:00"
}
```

---

### GET /transactions
Retrieve all transactions.

**Response:**
```json
[
  {
    "transaction_id": 1,
    "book_id": 1,
    "borrower_id": 1,
    "book_title": "Clean Code",
    "borrower_name": "Rahul Sharma",
    "borrow_date": "2026-05-15T10:00:00",
    "return_date": "2026-05-15T14:00:00"
  }
]
```

---

## Search API

### GET /search?q={query}
Search books by title, author, or category (case-insensitive).

**Example:** `GET /search?q=programming`

**Response:**
```json
[
  {
    "book_id": 1,
    "title": "Clean Code",
    "author": "Robert Martin",
    "category": "Programming",
    "isbn": "9780132350884",
    "availability_status": "available"
  }
]
```

---

## Error Responses

| Status Code | Meaning |
|-------------|---------|
| 400 | Bad request (e.g. ISBN already exists, book not available) |
| 404 | Resource not found |
| 422 | Validation error (missing required fields) |
