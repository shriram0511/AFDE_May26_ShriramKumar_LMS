import sys, os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
import models


def load(db, transformed: dict) -> int:
    book_map     = transformed["books"]
    borrower_map = transformed["borrowers"]
    analytics    = transformed["analytics"]

    # Books that are currently borrowed (no return date)
    borrowed_book_ids = {r["book_id"] for r in analytics if r["return_date"] is None}

    # ── Load books (skip existing) ───────────────────────────────
    existing_book_ids = {b.book_id for b in db.query(models.Book.book_id).all()}
    for book in book_map.values():
        if book["book_id"] in existing_book_ids:
            continue
        status = "borrowed" if book["book_id"] in borrowed_book_ids else "available"
        db.add(models.Book(
            book_id             = book["book_id"],
            title               = book["title"],
            author              = book["author"],
            category            = book["category"],
            isbn                = book["isbn"] or None,
            availability_status = status,
        ))
    db.commit()

    # ── Load borrowers (skip existing) ──────────────────────────
    existing_borrower_ids = {b.borrower_id for b in db.query(models.Borrower.borrower_id).all()}
    for borrower in borrower_map.values():
        if borrower["borrower_id"] in existing_borrower_ids:
            continue
        db.add(models.Borrower(
            borrower_id   = borrower["borrower_id"],
            borrower_name = borrower["name"],
            email         = borrower["email"] or None,
            phone         = borrower["phone"] or None,
        ))
    db.commit()

    # ── Load transactions (skip existing) ────────────────────────
    existing_tx_ids = {t.transaction_id for t in db.query(models.Transaction.transaction_id).all()}
    for rec in analytics:
        if rec["transaction_id"] in existing_tx_ids:
            continue
        db.add(models.Transaction(
            transaction_id = rec["transaction_id"],
            book_id        = rec["book_id"],
            borrower_id    = rec["borrower_id"],
            book_title     = rec["book_title"],
            borrower_name  = rec["borrower_name"],
            borrow_date    = rec["borrow_date"],
            return_date    = rec["return_date"],
        ))
    db.commit()

    # ── Load analytics (clear + reload) ──────────────────────────
    db.query(models.AnalyticsTransaction).delete()
    db.commit()
    for r in analytics:
        db.add(models.AnalyticsTransaction(**r))
    db.commit()

    return len(analytics)
