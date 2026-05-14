# Library Management System

Full-stack web application — React frontend, FastAPI backend, SQLite database.

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
└── frontend/
    ├── public/index.html
    ├── src/
    │   ├── components/Navbar.js
    │   ├── pages/
    │   │   ├── Dashboard.js
    │   │   ├── Books.js
    │   │   ├── Borrowers.js
    │   │   ├── BorrowReturn.js
    │   │   └── Search.js
    │   ├── App.js
    │   ├── App.css
    │   ├── index.js
    │   └── api.js
    └── package.json
```

## Setup & Run

### Backend

```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload
```

API runs at: http://localhost:8000  
Swagger docs: http://localhost:8000/docs

### Frontend

```bash
cd frontend
npm install
npm start
```

App runs at: http://localhost:3000

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /books/ | Get all books |
| GET | /books/{id} | Get book by ID |
| POST | /books/ | Add book |
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

## Tech Stack

- **Frontend**: React 18, React Router v6, Axios
- **Backend**: FastAPI, SQLAlchemy
- **Database**: SQLite
