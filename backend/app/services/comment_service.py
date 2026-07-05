from sqlalchemy.orm import Session
from fastapi import HTTPException
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

def get_comments(db: Session, post_id: int):
    return (
        db.query(Comment)
        .filter(Comment.post_id == post_id)
        .all()
    )
def get_all_comments(db: Session):
    return db.query(Comment).all()


def delete_comment(db: Session, comment_id: int):
    comment = (
        db.query(Comment)
        .filter(Comment.id == comment_id)
        .first()
    )

    if not comment:
        raise HTTPException(
            status_code=404,
            detail="Comment not found",
        )

    db.delete(comment)
    db.commit()

    return {
        "message": "Comment deleted successfully"
    }