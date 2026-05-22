from datetime import datetime


def _parse_dt(s):
    s = (s or "").strip()
    if not s:
        return None
    try:
        return datetime.strptime(s, "%Y-%m-%d %H:%M:%S")
    except ValueError:
        return None


def transform(books_rows, borrowers_rows, transaction_rows, db_rows):
    # ── Clean books ──────────────────────────────────────────────
    book_map = {}
    for row in books_rows:
        bid = str(row.get("book_id", "")).strip()
        try:
            bid = int(bid)
        except (ValueError, TypeError):
            continue
        if bid in book_map:
            continue  # deduplicate
        book_map[bid] = {
            "title":    (row.get("title", "") or "Unknown").strip() or "Unknown",
            "author":   (row.get("author", "") or "Unknown").strip() or "Unknown",
            "category": (row.get("category", "") or "Unknown").strip().title() or "Unknown",
        }

    # ── Clean borrowers ──────────────────────────────────────────
    borrower_map = {}
    for row in borrowers_rows:
        bid = str(row.get("borrower_id", "")).strip()
        try:
            bid = int(bid)
        except (ValueError, TypeError):
            continue
        if bid in borrower_map:
            continue  # deduplicate
        name = (row.get("name", "") or "").strip()
        if not name:
            continue  # skip rows with no name
        borrower_map[bid] = {"name": name}

    records = []
    seen_ids = set()

    # ── Process CSV transactions ─────────────────────────────────
    for row in transaction_rows:
        tx_id_str = str(row.get("transaction_id", "")).strip()
        try:
            tx_id = int(tx_id_str)
        except (ValueError, TypeError):
            continue
        if tx_id in seen_ids:
            continue  # deduplicate

        book_id_str     = str(row.get("book_id", "")).strip()
        borrower_id_str = str(row.get("borrower_id", "")).strip()
        try:
            book_id     = int(book_id_str)
            borrower_id = int(borrower_id_str)
        except (ValueError, TypeError):
            continue  # missing / non-numeric foreign key

        book     = book_map.get(book_id)
        borrower = borrower_map.get(borrower_id)
        if not book or not borrower:
            continue  # invalid foreign key reference

        borrow_date = _parse_dt(row.get("borrow_date"))
        if not borrow_date:
            continue

        return_date = _parse_dt(row.get("return_date"))
        if return_date and return_date < borrow_date:
            return_date = None  # bad data: return before borrow

        seen_ids.add(tx_id)
        is_overdue   = (return_date is None) and ((datetime.now() - borrow_date).days > 30)
        days_borrowed = (return_date - borrow_date).days if return_date else None

        records.append({
            "transaction_id": tx_id,
            "book_id":        book_id,
            "borrower_id":    borrower_id,
            "book_title":     book["title"],
            "borrower_name":  borrower["name"],
            "category":       book["category"],
            "borrow_date":    borrow_date,
            "return_date":    return_date,
            "is_overdue":     is_overdue,
            "days_borrowed":  days_borrowed,
            "month_year":     borrow_date.strftime("%Y-%m"),
        })

    # ── Process live DB transactions (already clean) ─────────────
    for row in db_rows:
        borrow_date = _parse_dt(row.get("borrow_date")) or datetime.now()
        return_date = _parse_dt(row.get("return_date"))

        book_id = int(row.get("book_id") or 0)
        book    = book_map.get(book_id)
        category = book["category"] if book else (row.get("category") or "Unknown")

        is_overdue    = (return_date is None) and ((datetime.now() - borrow_date).days > 30)
        days_borrowed = (return_date - borrow_date).days if return_date else None

        records.append({
            "transaction_id": int(row["transaction_id"]),
            "book_id":        book_id,
            "borrower_id":    int(row.get("borrower_id") or 0),
            "book_title":     row.get("book_title") or "Unknown",
            "borrower_name":  row.get("borrower_name") or "Unknown",
            "category":       category,
            "borrow_date":    borrow_date,
            "return_date":    return_date,
            "is_overdue":     is_overdue,
            "days_borrowed":  days_borrowed,
            "month_year":     borrow_date.strftime("%Y-%m"),
        })

    return records
