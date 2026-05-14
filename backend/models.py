from sqlalchemy import Column, Integer, String, DateTime
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
    borrow_date = Column(DateTime, default=func.now())
    return_date = Column(DateTime, nullable=True)
