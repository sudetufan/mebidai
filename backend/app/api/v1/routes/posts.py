from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.api.dependencies import get_db, get_current_user
from app.models.user import User
from app.schemas.post import PostCreate, PostResponse
from app.services.post_service import (
    create_post,
    get_posts,
    get_post,
    update_post,
    delete_post
)
router = APIRouter(prefix="/posts", tags=["Posts"])


@router.post("/", response_model=PostResponse)
def create(
    post: PostCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return create_post(db, post, current_user.id)


@router.get("/", response_model=list[PostResponse])
def read_posts(db: Session = Depends(get_db)):
    return get_posts(db)
@router.get("/{post_id}", response_model=PostResponse)
def read_post(post_id: int, db: Session = Depends(get_db)):
    return get_post(db, post_id)

@router.put("/{post_id}", response_model=PostResponse)
def update(
    post_id: int,
    post: PostCreate,
    db: Session = Depends(get_db)
):
    return update_post(db, post_id, post)
@router.delete("/{post_id}")
def delete(post_id: int, db: Session = Depends(get_db)):
    return delete_post(db, post_id)