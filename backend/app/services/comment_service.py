from sqlalchemy.orm import Session
from fastapi import HTTPException

from app.services.mention_service import process_mentions
from app.services.notification_service import create_notification

from app.models.comment import Comment
from app.models.post import Post
from app.models.user import User

from app.schemas.comment import (
    CommentCreate,
    CommentUpdate,
)

def create_comment(
    db: Session,
    comment: CommentCreate,
    user_id: int,
):

    post = (
        db.query(Post)
        .filter(Post.id == comment.post_id)
        .first()
    )

    if not post:
        raise HTTPException(
            status_code=404,
            detail="Post not found",
        )
    new_comment = Comment(
        content=comment.content,
        post_id=comment.post_id,
        user_id=user_id,
        parent_id=comment.parent_id,
    )
    db.add(new_comment)
    db.commit()
    db.refresh(new_comment)

    if post.user_id != user_id:

        create_notification(
            db,
            recipient_id=post.user_id,
            sender_id=user_id,
            notification_type="comment",
            post_id=post.id,
            comment_id=new_comment.id,
        )
    process_mentions(
        db,
        new_comment.content,
        user_id,
        post.id,
        new_comment.id,
    )

    return new_comment

def get_comments(
    db: Session,
    post_id: int,
):

    comments = (
        db.query(Comment)
        .filter(
            Comment.post_id == post_id,
            Comment.parent_id == None,
        )
        .all()
    )

    def build_comment(comment):

        return {
            "id": comment.id,
            "content": comment.content,
            "post_id": comment.post_id,
            "user": comment.user,
            "parent_id": comment.parent_id,
            "replies": [
                build_comment(reply)
                for reply in comment.replies
            ],
        }

    return [
        build_comment(comment)
        for comment in comments
    ]
def get_all_comments(
    db: Session,
):
    return db.query(Comment).all()

def update_comment(
    db: Session,
    comment_id: int,
    data: CommentUpdate,
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