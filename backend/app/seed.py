from app.db.session import SessionLocal
from app.models.category import Category


def seed_categories():
    db = SessionLocal()

    categories = [
        "Backend",
        "Frontend",
        "AI",
        "DevOps",
        "Mobile",
        "Database",
    ]

    try:
        for name in categories:
            existing = (
                db.query(Category)
                .filter(Category.name == name)
                .first()
            )

            if not existing:
                category = Category(
                    name=name
                )

                db.add(category)

        db.commit()

    finally:
        db.close()