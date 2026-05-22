import csv
import os
import random
from faker import Faker
from datetime import datetime, timedelta

fake = Faker()
random.seed(42)

PROJECT_ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
OUTPUT_DIR = os.path.join(PROJECT_ROOT, "datasets")

BOOKS = [
    (1,  "Clean Code",                   "Robert C. Martin",      "Programming",          "9780132350884"),
    (2,  "The Pragmatic Programmer",      "David Thomas",          "Programming",          "9780201616224"),
    (3,  "Introduction to Algorithms",    "Thomas H. Cormen",      "Computer Science",     "9780262033848"),
    (4,  "Python Crash Course",           "Eric Matthes",          "Programming",          "9781593276034"),
    (5,  "Atomic Habits",                 "James Clear",           "Self Development",     "9780735211292"),
    (6,  "Design Patterns",               "Gang of Four",          "Software Engineering", "9780201633610"),
    (7,  "The Clean Coder",               "Robert C. Martin",      "Programming",          "9780137081073"),
    (8,  "Deep Learning",                 "Ian Goodfellow",        "Artificial Intelligence","9780262035613"),
    (9,  "Data Structures",               "Mark Allen Weiss",      "Computer Science",     "9780132576277"),
    (10, "Thinking Fast and Slow",        "Daniel Kahneman",       "Psychology",           "9780374533557"),
    (11, "The Art of War",                "Sun Tzu",               "Philosophy",           "9781599869773"),
    (12, "Rich Dad Poor Dad",             "Robert Kiyosaki",       "Finance",              "9781612680194"),
    (13, "Sapiens",                       "Yuval Noah Harari",     "History",              "9780062316097"),
    (14, "1984",                          "George Orwell",         "Fiction",              "9780451524935"),
    (15, "To Kill a Mockingbird",         "Harper Lee",            "Fiction",              "9780061935466"),
    (16, "The Great Gatsby",              "F. Scott Fitzgerald",   "Fiction",              "9780743273565"),
    (17, "Algorithms Unlocked",           "Thomas H. Cormen",      "Computer Science",     "9780262518802"),
    (18, "Machine Learning",              "Tom M. Mitchell",       "Artificial Intelligence","9780070428072"),
    (19, "SQL in 10 Minutes",             "Ben Forta",             "Database",             "9780135182796"),
    (20, "JavaScript: The Good Parts",    "Douglas Crockford",     "Programming",          "9780596517748"),
]


def generate_books():
    rows = [{"book_id": bid, "title": t, "author": a, "category": c, "isbn": isbn}
            for bid, t, a, c, isbn in BOOKS]

    # dirty: mixed-case categories
    rows[0]["category"] = "PROGRAMMING"
    rows[2]["category"] = "computer science"
    rows[7]["category"] = "artificial intelligence"
    # dirty: extra whitespace
    rows[4]["title"]  = "  Atomic Habits  "
    rows[5]["author"] = "  Gang of Four  "
    # dirty: missing author
    rows[8]["author"] = ""
    rows[9]["author"] = ""
    # dirty: duplicate rows
    rows += [dict(rows[0]), dict(rows[3]), dict(rows[10])]

    random.shuffle(rows)
    return rows


def generate_borrowers():
    rows = [{"borrower_id": i + 1, "name": fake.name(),
             "email": fake.email(), "phone": fake.numerify("##########")}
            for i in range(30)]

    # dirty: missing names
    rows[2]["name"] = ""
    rows[5]["name"] = ""
    # dirty: extra whitespace
    rows[8]["name"]  = "  " + rows[8]["name"]  + "  "
    rows[12]["name"] = "  " + rows[12]["name"] + "  "
    # dirty: duplicate rows
    rows += [dict(rows[0]), dict(rows[1]), dict(rows[4])]

    random.shuffle(rows)
    return rows


def generate_transactions():
    valid_book_ids     = [b[0] for b in BOOKS]
    valid_borrower_ids = list(range(1, 31))
    base_date          = datetime.now() - timedelta(days=365)
    rows = []

    for i in range(160):
        borrow_date = base_date + timedelta(days=random.randint(0, 340))
        return_date = (borrow_date + timedelta(days=random.randint(1, 30))
                       if random.random() < 0.7 else None)
        rows.append({
            "transaction_id": 0,  # assigned after sorting
            "book_id":        random.choice(valid_book_ids),
            "borrower_id":    random.choice(valid_borrower_ids),
            "borrow_date":    borrow_date.strftime("%Y-%m-%d %H:%M:%S"),
            "return_date":    return_date.strftime("%Y-%m-%d %H:%M:%S") if return_date else "",
        })

    # Sort by borrow_date so IDs are chronologically sequential
    rows.sort(key=lambda r: r["borrow_date"])
    for i, row in enumerate(rows):
        row["transaction_id"] = i + 1

    # dirty: missing book_id
    rows[0]["book_id"] = ""
    rows[1]["book_id"] = ""
    rows[2]["book_id"] = ""
    # dirty: missing borrower_id
    rows[3]["borrower_id"] = ""
    rows[4]["borrower_id"] = ""
    # dirty: invalid foreign keys
    rows[5]["book_id"] = 999
    rows[6]["book_id"] = 888
    # dirty: return_date before borrow_date
    for idx in [10, 11]:
        bd = datetime.strptime(rows[idx]["borrow_date"], "%Y-%m-%d %H:%M:%S")
        rows[idx]["return_date"] = (bd - timedelta(days=5)).strftime("%Y-%m-%d %H:%M:%S")
    # dirty: duplicate rows
    rows += [dict(rows[20]), dict(rows[21]), dict(rows[22]),
             dict(rows[23]), dict(rows[24])]

    random.shuffle(rows)
    return rows


def write_csv(path, rows, fieldnames):
    with open(path, "w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(rows)
    print(f"  {len(rows)} rows → {path}")


def main():
    os.makedirs(OUTPUT_DIR, exist_ok=True)

    books_rows   = generate_books()
    borr_rows    = generate_borrowers()
    tx_rows      = generate_transactions()

    write_csv(os.path.join(OUTPUT_DIR, "books.csv"),        books_rows,
              ["book_id", "title", "author", "category", "isbn"])
    write_csv(os.path.join(OUTPUT_DIR, "borrowers.csv"),    borr_rows,
              ["borrower_id", "name", "email", "phone"])
    write_csv(os.path.join(OUTPUT_DIR, "transactions.csv"), tx_rows,
              ["transaction_id", "book_id", "borrower_id", "borrow_date", "return_date"])

    print("Done. Upload these 3 files via the Analytics page to run ETL.")


if __name__ == "__main__":
    main()
