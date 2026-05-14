from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
import crud, schemas
from database import get_db

router = APIRouter(tags=["transactions"])


@router.post("/borrow", response_model=schemas.Transaction)
def borrow_book(request: schemas.BorrowRequest, db: Session = Depends(get_db)):
    transaction = crud.borrow_book(db, request.book_id, request.borrower_id)
    if not transaction:
        raise HTTPException(status_code=400, detail="Book not available or not found")
    return transaction


@router.post("/return", response_model=schemas.Transaction)
def return_book(request: schemas.ReturnRequest, db: Session = Depends(get_db)):
    transaction = crud.return_book(db, request.transaction_id)
    if not transaction:
        raise HTTPException(status_code=400, detail="Transaction not found or book already returned")
    return transaction


@router.get("/transactions", response_model=List[schemas.Transaction])
def get_transactions(db: Session = Depends(get_db)):
    return crud.get_transactions(db)
