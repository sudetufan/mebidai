from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.schemas.post import PostCreate, PostResponse
from app.services.post_service import create_post, get_posts

router = APIRouter(prefix="/posts", tags=["Posts"])


@router.post("/", response_model=PostResponse)
def create(post: PostCreate, db: Session = Depends(get_db)):
    return create_post(db, post, user_id=1)


@router.get("/", response_model=list[PostResponse])
def read_posts(db: Session = Depends(get_db)):
    return get_posts(db)