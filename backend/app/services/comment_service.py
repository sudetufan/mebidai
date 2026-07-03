from sqlalchemy.orm import Session

from app.models.comment import Comment
from app.schemas.comment import CommentCreate


def create_comment(db: Session, comment: CommentCreate, user_id: int):
    new_comment = Comment(
        content=comment.content,
        post_id=comment.post_id,
        user_id=user_id
    )

    db.add(new_comment)
    db.commit()
    db.refresh(new_comment)
    return new_comment


def get_comments(db: Session):
    return db.query(Comment).all()