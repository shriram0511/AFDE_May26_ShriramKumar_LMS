from sqlalchemy.orm import Session
from sqlalchemy import or_
from datetime import datetime
import models, schemas


def get_books(db: Session):
    return db.query(models.Book).all()


def get_book(db: Session, book_id: int):
    return db.query(models.Book).filter(models.Book.book_id == book_id).first()


def create_book(db: Session, book: schemas.BookCreate):
    db_book = models.Book(**book.dict())
    db.add(db_book)
    db.commit()
    db.refresh(db_book)
    return db_book


def update_book(db: Session, book_id: int, book: schemas.BookUpdate):
    db_book = get_book(db, book_id)
    if not db_book:
        return None
    for key, value in book.dict().items():
        setattr(db_book, key, value)
    db.commit()
    db.refresh(db_book)
    return db_book


def delete_book(db: Session, book_id: int):
    db_book = get_book(db, book_id)
    if not db_book:
        return None
    active = db.query(models.Transaction).filter(
        models.Transaction.book_id == book_id,
        models.Transaction.return_date == None
    ).first()
    if active:
        return "active"
    db.delete(db_book)
    db.commit()
    return db_book


def search_books(db: Session, query: str):
    return db.query(models.Book).filter(
        or_(
            models.Book.title.ilike(f"%{query}%"),
            models.Book.author.ilike(f"%{query}%"),
            models.Book.category.ilike(f"%{query}%"),
        )
    ).all()


def get_borrowers(db: Session):
    return db.query(models.Borrower).all()


def get_borrower(db: Session, borrower_id: int):
    return db.query(models.Borrower).filter(models.Borrower.borrower_id == borrower_id).first()


def create_borrower(db: Session, borrower: schemas.BorrowerCreate):
    db_borrower = models.Borrower(**borrower.dict())
    db.add(db_borrower)
    db.commit()
    db.refresh(db_borrower)
    return db_borrower


def update_borrower(db: Session, borrower_id: int, borrower: schemas.BorrowerUpdate):
    db_borrower = get_borrower(db, borrower_id)
    if not db_borrower:
        return None
    for key, value in borrower.dict().items():
        setattr(db_borrower, key, value)
    db.commit()
    db.refresh(db_borrower)
    return db_borrower


def delete_borrower(db: Session, borrower_id: int):
    db_borrower = get_borrower(db, borrower_id)
    if not db_borrower:
        return None
    active = db.query(models.Transaction).filter(
        models.Transaction.borrower_id == borrower_id,
        models.Transaction.return_date == None
    ).first()
    if active:
        return "active"
    db.delete(db_borrower)
    db.commit()
    return db_borrower


def borrow_book(db: Session, book_id: int, borrower_id: int):
    book = get_book(db, book_id)
    borrower = get_borrower(db, borrower_id)
    if not book or book.availability_status != "available":
        return None
    transaction = models.Transaction(
        book_id=book_id,
        borrower_id=borrower_id,
        book_title=book.title,
        borrower_name=borrower.borrower_name,
        borrow_date=datetime.now()
    )
    db.add(transaction)
    book.availability_status = "borrowed"
    db.commit()
    db.refresh(transaction)
    return transaction


def return_book(db: Session, transaction_id: int):
    transaction = db.query(models.Transaction).filter(
        models.Transaction.transaction_id == transaction_id
    ).first()
    if not transaction or transaction.return_date is not None:
        return None
    transaction.return_date = datetime.now()
    book = get_book(db, transaction.book_id)
    if book:
        book.availability_status = "available"
    db.commit()
    db.refresh(transaction)
    return transaction


def get_transactions(db: Session):
    return db.query(models.Transaction).all()
