from fastapi import HTTPException
from sqlalchemy.orm import Session

from app.models.category import Category
from app.schemas.category import CategoryCreate


def get_categories(
    db: Session,
):
    return (
        db.query(Category)
        .order_by(Category.id)
        .all()
    )


def create_category(
    db: Session,
    category: CategoryCreate,
):
    existing_category = (
        db.query(Category)
        .filter(Category.name == category.name)
        .first()
    )

    if existing_category:
        raise HTTPException(
            status_code=400,
            detail="Category already exists",
        )

    new_category = Category(
        name=category.name,
    )

    db.add(new_category)
    db.commit()
    db.refresh(new_category)

    return new_category


def delete_category(
    db: Session,
    category_id: int,
):
    category = (
        db.query(Category)
        .filter(Category.id == category_id)
        .first()
    )

    if not category:
        raise HTTPException(
            status_code=404,
            detail="Category not found",
        )

    if category.posts:
        raise HTTPException(
            status_code=400,
            detail="Cannot delete category with posts",
        )

    db.delete(category)
    db.commit()

    return {
        "message": "Category deleted successfully"
    }