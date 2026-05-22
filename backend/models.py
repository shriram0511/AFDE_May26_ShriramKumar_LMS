from sqlalchemy import Column, Integer, String, DateTime, Boolean
from sqlalchemy.sql import func
from database import Base


class Book(Base):
    __tablename__ = "books"

    book_id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    author = Column(String, nullable=False)
    category = Column(String)
    isbn = Column(String, unique=True)
    availability_status = Column(String, default="available")


class Borrower(Base):
    __tablename__ = "borrowers"

    borrower_id = Column(Integer, primary_key=True, index=True)
    borrower_name = Column(String, nullable=False)
    email = Column(String, unique=True)
    phone = Column(String)


class Transaction(Base):
    __tablename__ = "transactions"

    transaction_id = Column(Integer, primary_key=True, index=True)
    book_id = Column(Integer, nullable=False)
    borrower_id = Column(Integer, nullable=False)
    book_title = Column(String, nullable=False)
    borrower_name = Column(String, nullable=False)
    borrow_date = Column(DateTime, default=func.now())
    return_date = Column(DateTime, nullable=True)


class AnalyticsTransaction(Base):
    __tablename__ = "analytics_transactions"

    id = Column(Integer, primary_key=True, index=True)
    transaction_id = Column(Integer)
    book_id = Column(Integer)
    borrower_id = Column(Integer)
    book_title = Column(String, default="Unknown")
    borrower_name = Column(String, default="Unknown")
    category = Column(String, default="Unknown")
    borrow_date = Column(DateTime)
    return_date = Column(DateTime, nullable=True)
    is_overdue = Column(Boolean, default=False)
    days_borrowed = Column(Integer, nullable=True)
    month_year = Column(String)
