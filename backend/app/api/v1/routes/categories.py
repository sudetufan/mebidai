from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.api.dependencies import get_db
from app.schemas.category import CategoryResponse
from app.services.category_service import get_categories


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