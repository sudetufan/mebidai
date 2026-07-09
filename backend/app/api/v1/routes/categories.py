from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.api.dependencies import (
    get_db,
    get_admin_user,
)

from app.models.user import User

from app.schemas.category import (
    CategoryCreate,
    CategoryResponse,
)

from app.services.category_service import (
    get_categories,
    create_category,
    delete_category,
)


router = APIRouter(
    prefix="/categories",
    tags=["Categories"],
)


@router.get(
    "/",
    response_model=list[CategoryResponse],
)
def read_categories(
    db: Session = Depends(get_db),
):
    return get_categories(db)


@router.post(
    "/",
    response_model=CategoryResponse,
)
def add_category(
    category: CategoryCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_admin_user),
):
    return create_category(
        db,
        category,
    )


@router.delete(
    "/{category_id}",
)
def remove_category(
    category_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_admin_user),
):
    return delete_category(
        db,
        category_id,
    )