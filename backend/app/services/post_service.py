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