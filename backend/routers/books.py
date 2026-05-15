from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
from typing import List
import crud, schemas
from database import get_db

router = APIRouter(prefix="/books", tags=["books"])


@router.get("/", response_model=List[schemas.Book])
def get_books(db: Session = Depends(get_db)):
    return crud.get_books(db)


@router.get("/{book_id}", response_model=schemas.Book)
def get_book(book_id: int, db: Session = Depends(get_db)):
    book = crud.get_book(db, book_id)
    if not book:
        raise HTTPException(status_code=404, detail="Book not found")
    return book


@router.post("/", response_model=schemas.Book)
def create_book(book: schemas.BookCreate, db: Session = Depends(get_db)):
    try:
        return crud.create_book(db, book)
    except IntegrityError:
        db.rollback()
        raise HTTPException(status_code=400, detail="ISBN already exists")


@router.put("/{book_id}", response_model=schemas.Book)
def update_book(book_id: int, book: schemas.BookUpdate, db: Session = Depends(get_db)):
    try:
        updated = crud.update_book(db, book_id, book)
        if not updated:
            raise HTTPException(status_code=404, detail="Book not found")
        return updated
    except IntegrityError:
        db.rollback()
        raise HTTPException(status_code=400, detail="ISBN already exists")


@router.delete("/{book_id}")
def delete_book(book_id: int, db: Session = Depends(get_db)):
    result = crud.delete_book(db, book_id)
    if result is None:
        raise HTTPException(status_code=404, detail="Book not found")
    if result == "active":
        raise HTTPException(status_code=400, detail="Book is currently borrowed by a user. Please return it before deleting.")
    return {"message": "Book deleted successfully"}
