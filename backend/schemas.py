from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class BookCreate(BaseModel):
    title: str
    author: str
    category: str
    isbn: str
    availability_status: str = "available"


class BookUpdate(BaseModel):
    title: str
    author: str
    category: str
    isbn: str
    availability_status: str = "available"


class Book(BookCreate):
    book_id: int

    class Config:
        from_attributes = True


class BorrowerCreate(BaseModel):
    borrower_name: str
    email: Optional[str] = None
    phone: Optional[str] = None


class BorrowerUpdate(BorrowerCreate):
    pass


class Borrower(BorrowerCreate):
    borrower_id: int

    class Config:
        from_attributes = True


class BorrowRequest(BaseModel):
    book_id: int
    borrower_id: int


class ReturnRequest(BaseModel):
    transaction_id: int


class Transaction(BaseModel):
    transaction_id: int
    book_id: int
    borrower_id: int
    book_title: str
    borrower_name: str
    borrow_date: datetime
    return_date: Optional[datetime] = None

    class Config:
        from_attributes = True
