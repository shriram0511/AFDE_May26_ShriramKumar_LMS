import csv
import io
import sys, os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
import models

def extract_books(csv_content: str):
    return list(csv.DictReader(io.StringIO(csv_content)))

def extract_borrowers(csv_content: str):
    return list(csv.DictReader(io.StringIO(csv_content)))

def extract_transactions(csv_content: str):
    return list(csv.DictReader(io.StringIO(csv_content)))

def extract_db(db):
    transactions = db.query(models.Transaction).all()
    books = db.query(models.Book).all()
    book_map = {b.book_id: b for b in books}
    rows = []
    for tx in transactions:
        book = book_map.get(tx.book_id)
        rows.append({
            "transaction_id": str(tx.transaction_id),
            "book_id":        str(tx.book_id or 0),
            "borrower_id":    str(tx.borrower_id or 0),
            "book_title":     tx.book_title or "Unknown",
            "borrower_name":  tx.borrower_name or "Unknown",
            "category":       (book.category if book and book.category else "Unknown"),
            "borrow_date":    tx.borrow_date.strftime("%Y-%m-%d %H:%M:%S") if tx.borrow_date else "",
            "return_date":    tx.return_date.strftime("%Y-%m-%d %H:%M:%S") if tx.return_date else "",
        })
    return rows
