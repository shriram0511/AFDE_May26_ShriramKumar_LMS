from fastapi import APIRouter, Depends, UploadFile, File, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func
from database import get_db
import models
from etl.pipeline import run_pipeline

router = APIRouter(prefix="/analytics", tags=["analytics"])


@router.post("/upload-and-run")
async def upload_and_run_etl(
    books_file: UploadFile = File(...),
    borrowers_file: UploadFile = File(...),
    transactions_file: UploadFile = File(...),
    db: Session = Depends(get_db),
):
    for f in [books_file, borrowers_file, transactions_file]:
        if not f.filename.endswith(".csv"):
            raise HTTPException(status_code=400, detail=f"{f.filename} is not a CSV file.")

    books_csv        = (await books_file.read()).decode("utf-8")
    borrowers_csv    = (await borrowers_file.read()).decode("utf-8")
    transactions_csv = (await transactions_file.read()).decode("utf-8")

    count = run_pipeline(books_csv, borrowers_csv, transactions_csv, db)
    return {"message": f"ETL completed. {count} records loaded.", "count": count}


@router.get("/most-borrowed")
def most_borrowed(db: Session = Depends(get_db)):
    results = db.query(
        models.AnalyticsTransaction.book_title,
        models.AnalyticsTransaction.category,
        func.count(models.AnalyticsTransaction.id).label("borrow_count")
    ).group_by(models.AnalyticsTransaction.book_title) \
     .order_by(func.count(models.AnalyticsTransaction.id).desc()) \
     .limit(10).all()
    return [{"book_title": r.book_title, "category": r.category, "borrow_count": r.borrow_count} for r in results]


@router.get("/category-trends")
def category_trends(db: Session = Depends(get_db)):
    results = db.query(
        models.AnalyticsTransaction.category,
        func.count(models.AnalyticsTransaction.id).label("borrow_count")
    ).group_by(models.AnalyticsTransaction.category) \
     .order_by(func.count(models.AnalyticsTransaction.id).desc()).all()
    return [{"category": r.category, "borrow_count": r.borrow_count} for r in results]


@router.get("/monthly-trends")
def monthly_trends(db: Session = Depends(get_db)):
    results = db.query(
        models.AnalyticsTransaction.month_year,
        func.count(models.AnalyticsTransaction.id).label("borrow_count")
    ).group_by(models.AnalyticsTransaction.month_year) \
     .order_by(models.AnalyticsTransaction.month_year).all()
    return [{"month_year": r.month_year, "borrow_count": r.borrow_count} for r in results]


@router.get("/overdue")
def overdue_transactions(db: Session = Depends(get_db)):
    results = db.query(models.AnalyticsTransaction).filter(
        models.AnalyticsTransaction.is_overdue == True
    ).all()
    return [{
        "transaction_id": r.transaction_id,
        "book_title":     r.book_title,
        "borrower_name":  r.borrower_name,
        "borrow_date":    r.borrow_date,
    } for r in results]
