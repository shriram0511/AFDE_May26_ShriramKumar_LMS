from fastapi import FastAPI, Depends, Query
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List
import models, schemas, crud
from database import engine, get_db
from routers import books, borrowers, transactions

models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="Library Management System")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(books.router)
app.include_router(borrowers.router)
app.include_router(transactions.router)


@app.get("/search", response_model=List[schemas.Book])
def search_books(q: str = Query(..., description="Search query"), db: Session = Depends(get_db)):
    return crud.search_books(db, q)


@app.get("/")
def root():
    return {"message": "Library Management System API"}
