import sys, os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from database import SessionLocal
from etl.extract import extract_books, extract_borrowers, extract_transactions, extract_db
from etl.transform import transform
from etl.load import load


def run_pipeline(books_csv: str, borrowers_csv: str, transactions_csv: str, db=None):
    close_db = False
    if db is None:
        db = SessionLocal()
        close_db = True
    try:
        books_rows = extract_books(books_csv)
        borr_rows  = extract_borrowers(borrowers_csv)
        tx_rows    = extract_transactions(transactions_csv)
        db_rows    = extract_db(db)
        transformed = transform(books_rows, borr_rows, tx_rows, db_rows)
        count       = load(db, transformed)
        return count
    finally:
        if close_db:
            db.close()
