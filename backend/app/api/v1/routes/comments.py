from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.schemas.comment import CommentCreate, CommentResponse
from app.services.comment_service import create_comment, get_comments

router = APIRouter(prefix="/comments", tags=["Comments"])


@router.post("/", response_model=CommentResponse)
def create(comment: CommentCreate, db: Session = Depends(get_db)):
    return create_comment(db, comment, user_id=1)


@router.get("/", response_model=list[CommentResponse])
def read_comments(db: Session = Depends(get_db)):
    return get_comments(db)