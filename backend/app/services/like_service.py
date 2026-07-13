from fastapi import HTTPException
from sqlalchemy.orm import Session

from app.models.like import Like
from app.models.post import Post
from app.models.user import User

from app.services.notification_service import create_notification

def like_post(db: Session, post_id: int, current_user: User):

    post = db.query(Post).filter(Post.id == post_id).first()

    if not post:
        raise HTTPException(
            status_code=404,
            detail="Post not found"
        )


    existing_like = (
        db.query(Like)
        .filter(
            Like.user_id == current_user.id,
            Like.post_id == post_id,
        )
        .first()
    )


    if existing_like:
        raise HTTPException(
            status_code=400,
            detail="You already liked this post",
        )


    like = Like(
        user_id=current_user.id,
        post_id=post_id,
    )


    db.add(like)
    db.commit()


    if post.user_id != current_user.id:
        create_notification(
            db,
            recipient_id=post.user_id,
            sender_id=current_user.id,
            notification_type="like",
        )


    return {
        "message": "Post liked successfully"
    }

def unlike_post(db: Session, post_id: int, current_user: User):
    like = (
        db.query(Like)
        .filter(
            Like.user_id == current_user.id,
            Like.post_id == post_id,
        )
        .first()
    )

    if not like:
        raise HTTPException(
            status_code=404,
            detail="Like not found",
        )

    db.delete(like)
    db.commit()

    return {"message": "Like removed successfully"}
