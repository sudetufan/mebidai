from sqlalchemy.orm import Session
from fastapi import HTTPException

from app.models.comment import Comment
from app.models.user import User

from app.schemas.comment import CommentCreate



def create_comment(
    db: Session,
    comment: CommentCreate,
    user_id: int,
):
    new_comment = Comment(
        content=comment.content,
        post_id=comment.post_id,
        user_id=user_id,
    )

    db.add(new_comment)
    db.commit()
    db.refresh(new_comment)

    return new_comment



def get_comments(
    db: Session,
    post_id: int,
):
    return (
        db.query(Comment)
        .filter(Comment.post_id == post_id)
        .all()
    )



def get_all_comments(
    db: Session,
):
    return db.query(Comment).all()



def update_comment(
    db: Session,
    comment_id: int,
    data: CommentCreate,
    current_user: User,
):
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


    if (
        comment.user_id != current_user.id
        and current_user.role != "admin"
    ):
        raise HTTPException(
            status_code=403,
            detail="You cannot update this comment",
        )


    comment.content = data.content

    db.commit()
    db.refresh(comment)

    return comment



def delete_comment(
    db: Session,
    comment_id: int,
    current_user: User,
):
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


    if (
        comment.user_id != current_user.id
        and current_user.role != "admin"
    ):
        raise HTTPException(
            status_code=403,
            detail="You cannot delete this comment",
        )


    db.delete(comment)
    db.commit()


    return {
        "message": "Comment deleted successfully"
    }