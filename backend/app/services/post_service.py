from fastapi import HTTPException
from sqlalchemy.orm import Session

from app.models.post import Post
from app.schemas.post import PostCreate


def create_post(db: Session, post: PostCreate) -> Post:
    new_post = Post(
        title=post.title,
        content=post.content,
    )

    db.add(new_post)
    db.commit()
    db.refresh(new_post)

    return new_post


def get_posts(db: Session):
    return db.query(Post).all()


def get_post(db: Session, post_id: int):
    post = db.query(Post).filter(Post.id == post_id).first()

    if not post:
        raise HTTPException(status_code=404, detail="Post not found")

    return post

def update_post(db: Session, post_id: int, post: PostCreate):
    existing_post = db.query(Post).filter(Post.id == post_id).first()

    if not existing_post:
        raise HTTPException(status_code=404, detail="Post not found")

    existing_post.title = post.title
    existing_post.content = post.content

    db.commit()
    db.refresh(existing_post)

    return existing_post

def delete_post(db: Session, post_id: int):
    post = db.query(Post).filter(Post.id == post_id).first()

    if not post:
        raise HTTPException(status_code=404, detail="Post not found")

    db.delete(post)
    db.commit()

    return {"message": "Post deleted successfully"}