import sys, os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
import models

def load(db, records):
    db.query(models.AnalyticsTransaction).delete()
    db.commit()
    for r in records:
        db.add(models.AnalyticsTransaction(**r))
    db.commit()
    return len(records)
