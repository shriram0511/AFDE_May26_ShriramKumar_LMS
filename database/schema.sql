-- Library Management System - Database Schema
-- Database: SQLite

CREATE TABLE IF NOT EXISTS books (
    book_id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    author TEXT NOT NULL,
    category TEXT NOT NULL,
    isbn TEXT NOT NULL UNIQUE,
    availability_status TEXT NOT NULL DEFAULT 'available'
);

CREATE TABLE IF NOT EXISTS borrowers (
    borrower_id INTEGER PRIMARY KEY AUTOINCREMENT,
    borrower_name TEXT NOT NULL,
    email TEXT UNIQUE,
    phone TEXT
);

CREATE TABLE IF NOT EXISTS transactions (
    transaction_id INTEGER PRIMARY KEY AUTOINCREMENT,
    book_id INTEGER NOT NULL,
    borrower_id INTEGER NOT NULL,
    borrow_date DATETIME NOT NULL,
    return_date DATETIME,
    FOREIGN KEY (book_id) REFERENCES books(book_id),
    FOREIGN KEY (borrower_id) REFERENCES borrowers(borrower_id)
);
