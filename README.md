# Library Management System

A centralized web-based Library Management System to manage books, borrowers, and transactions efficiently.

## Project Overview

Libraries in schools and organizations often manage books and borrower records manually. This system digitizes and streamlines library operations through a centralized web application built with React, FastAPI, and SQLite.

## Features Implemented

- Add, edit, delete, and view books
- Add, edit, delete, and view borrowers
- Borrow and return books with transaction tracking
- Live search across title, author, and category
- Dashboard with real-time stats (total books, available, borrowed, transactions)
- Duplicate ISBN detection with error messages
- Auto-close active transactions when a book is deleted

## Technology Stack

| Layer | Technology |
|-------|------------|
| Frontend | React 18, React Router v6, Axios |
| Backend | FastAPI, SQLAlchemy |
| Database | SQLite |
| API Testing | Postman / Swagger UI |

## Project Structure

```
AFDE_May26_ShriramKumar_LMS/
├── backend/
│   ├── main.py
│   ├── database.py
│   ├── models.py
│   ├── schemas.py
│   ├── crud.py
│   ├── routers/
│   │   ├── books.py
│   │   ├── borrowers.py
│   │   └── transactions.py
│   └── requirements.txt
├── frontend/
│   ├── public/index.html
│   └── src/
│       ├── components/Navbar.js
│       ├── pages/
│       │   ├── Dashboard.js
│       │   ├── Books.js
│       │   ├── Borrowers.js
│       │   ├── BorrowReturn.js
│       │   └── Search.js
│       ├── services/
│       │   ├── api.js
│       │   ├── bookService.js
│       │   ├── borrowerService.js
│       │   └── transactionService.js
│       ├── App.js
│       ├── App.css
│       └── index.js
├── database/
│   └── schema.sql
├── docs/
│   └── api_documentation.md
├── screenshots/
├── requirements.txt
├── README.md
└── .gitignore
```

## Setup Instructions

### Backend Setup

```bash
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload
```

API runs at: `http://localhost:8000`  
Swagger Docs: `http://localhost:8000/docs`

### Frontend Setup

```bash
cd frontend
npm install
npm start
```

App runs at: `http://localhost:3000`

### Database Setup

Database is automatically created as `library_management_system.db` inside the `backend/` folder when the backend starts for the first time.

Schema reference: [`database/schema.sql`](database/schema.sql)

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /books/ | Get all books |
| GET | /books/{id} | Get book by ID |
| POST | /books/ | Add new book |
| PUT | /books/{id} | Update book |
| DELETE | /books/{id} | Delete book |
| GET | /borrowers/ | Get all borrowers |
| POST | /borrowers/ | Add borrower |
| PUT | /borrowers/{id} | Update borrower |
| DELETE | /borrowers/{id} | Delete borrower |
| POST | /borrow | Borrow a book |
| POST | /return | Return a book |
| GET | /transactions | Get all transactions |
| GET | /search?q= | Search books |

Full API documentation with request/response examples: [`docs/api_documentation.md`](docs/api_documentation.md)

## Screenshots

Screenshots are available in the [`screenshots/`](screenshots/) folder.

## Database Schema

| Table | Columns |
|-------|---------|
| books | book_id, title, author, category, isbn, availability_status |
| borrowers | borrower_id, borrower_name, email, phone |
| transactions | transaction_id, book_id, borrower_id, borrow_date, return_date |
