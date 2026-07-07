from fastapi import HTTPException
from sqlalchemy.orm import Session, joinedload

from app.models.like import Like
from app.models.post import Post
from app.models.user import User
from app.schemas.post import PostCreate


def create_post(
    db: Session,
    post: PostCreate,
    user_id: int,
) -> Post:
    new_post = Post(
        title=post.title,
        content=post.content,
        user_id=user_id,
    )

    db.add(new_post)
    db.commit()
    db.refresh(new_post)

    return new_post


def get_posts(
    db: Session,
    current_user: User | None,
):
    posts = (
        db.query(Post)
        .options(joinedload(Post.user))   # 🔥 user fix
        .all()
    )

    for post in posts:
        post.like_count = len(post.likes)

        if current_user:
            liked = (
                db.query(Like)
                .filter(
                    Like.post_id == post.id,
                    Like.user_id == current_user.id,
                )
                .first()
            )

            post.liked = liked is not None
        else:
            post.liked = False

    return posts


def get_post(
    db: Session,
    post_id: int,
    current_user: User | None,
):
    post = (
        db.query(Post)
        .options(joinedload(Post.user))   # 🔥 USER FIX BURADA
        .filter(Post.id == post_id)
        .first()
    )

    if not post:
        raise HTTPException(
            status_code=404,
            detail="Post not found",
        )

    post.like_count = len(post.likes)

    if current_user:
        liked = (
            db.query(Like)
            .filter(
                Like.post_id == post.id,
                Like.user_id == current_user.id,
            )
            .first()
        )

        post.liked = liked is not None
    else:
        post.liked = False

    return post


def update_post(
    db: Session,
    post_id: int,
    post: PostCreate,
):
    existing_post = (
        db.query(Post)
        .filter(Post.id == post_id)
        .first()
    )

    if not existing_post:
        raise HTTPException(
            status_code=404,
            detail="Post not found",
        )

    existing_post.title = post.title
    existing_post.content = post.content

    db.commit()
    db.refresh(existing_post)

    return existing_post


def delete_post(
    db: Session,
    post_id: int,
):
    post = (
        db.query(Post)
        .filter(Post.id == post_id)
        .first()
    )

    if not post:
        raise HTTPException(
            status_code=404,
            detail="Post not found",
        )

    db.delete(post)
    db.commit()

    return {
        "message": "Post deleted successfully"
    }