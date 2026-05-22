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
- ETL pipeline with 3-CSV dataset upload (books, borrowers, transactions)
- Analytics dashboard — most borrowed books, category trends, monthly trends, overdue transactions
- Role-based UI (Admin: full access, User: borrow/return and search only)

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
│   │   ├── transactions.py
│   │   └── analytics.py
│   ├── etl/
│   │   ├── generate_raw_datasets.py
│   │   ├── extract.py
│   │   ├── transform.py
│   │   ├── load.py
│   │   └── pipeline.py
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
│       │   ├── Analytics.js
│       │   └── Search.js
│       ├── services/
│       │   ├── api.js
│       │   ├── bookService.js
│       │   ├── borrowerService.js
│       │   ├── transactionService.js
│       │   └── analyticsService.js
│       ├── App.js
│       ├── App.css
│       └── index.js
├── datasets/
│   ├── books.csv
│   ├── borrowers.csv
│   └── transactions.csv
├── database/
│   └── schema.sql
├── docs/
│   └── api_documentation.md
├── screenshots/
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
| POST | /analytics/upload-and-run | Upload 3 CSVs and run ETL pipeline |
| GET | /analytics/most-borrowed | Top 10 most borrowed books |
| GET | /analytics/category-trends | Borrowing by category |
| GET | /analytics/monthly-trends | Borrowing by month |
| GET | /analytics/overdue | Overdue transactions |

Full API documentation with request/response examples: [`docs/api_documentation.md`](docs/api_documentation.md)

## Screenshots

Screenshots are available in the [`screenshots/`](screenshots/) folder.

## Database Schema

| Table | Columns |
|-------|---------|
| books | book_id, title, author, category, isbn, availability_status |
| borrowers | borrower_id, borrower_name, email, phone |
| transactions | transaction_id, book_id, borrower_id, book_title, borrower_name, borrow_date, return_date |
| analytics_transactions | id, transaction_id, book_id, borrower_id, book_title, borrower_name, category, borrow_date, return_date, is_overdue, days_borrowed, month_year |

## ETL Pipeline

Generate raw datasets with intentional dirty data, then upload via the Analytics page to run the ETL pipeline.

```bash
# From backend/ folder
python -m etl.generate_raw_datasets
```

This creates 3 CSV files in `datasets/`:
- `books.csv` — 20 books with dirty data (mixed case, whitespace, missing fields, duplicates)
- `borrowers.csv` — 30 borrowers with dirty data
- `transactions.csv` — 160 transactions with dirty data (invalid refs, bad dates, duplicates)

**Upload via UI:** Go to Analytics page → upload all 3 CSVs → click Upload & Run ETL.

The pipeline cleans the data (Extract → Transform → Load) and populates:
- `books`, `borrowers`, `transactions` tables (skips existing records)
- `analytics_transactions` table (cleared and reloaded each run)
