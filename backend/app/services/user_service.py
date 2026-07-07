from fastapi import HTTPException
from sqlalchemy.orm import Session
from app.models.post import Post
from app.models.comment import Comment
from app.security import (
    hash_password,
    verify_password,
    create_access_token,
)
from app.models.user import User
from app.schemas.user import UserCreate


def create_user(
    db: Session,
    user: UserCreate,
) -> User:
    existing_user = (
        db.query(User)
        .filter(User.email == user.email)
        .first()
    )

    if existing_user:
        raise HTTPException(
            status_code=409,
            detail="Email already registered",
        )

    new_user = User(
        username=user.username,
        email=user.email,
        hashed_password=hash_password(user.password),
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return new_user


def login_user(
    db: Session,
    email: str,
    password: str,
) -> str:
    user = (
        db.query(User)
        .filter(User.email == email)
        .first()
    )

    if not user:
        raise HTTPException(
            status_code=401,
            detail="Invalid email or password",
        )

    if not verify_password(
        password,
        user.hashed_password,
    ):
        raise HTTPException(
            status_code=401,
            detail="Invalid email or password",
        )

    return create_access_token(
        data={"sub": user.email}
    )


def get_users(db: Session):
    return db.query(User).all()


def delete_user(
    db: Session,
    user_id: int,
    current_user: User,
):
    user = (
        db.query(User)
        .filter(User.id == user_id)
        .first()
    )

    if not user:
        raise HTTPException(
            status_code=404,
            detail="User not found",
        )

    if user.id == current_user.id:
        raise HTTPException(
            status_code=400,
            detail="You cannot delete your own account",
        )

    if user.role == "admin":
        raise HTTPException(
            status_code=400,
            detail="Admin users cannot be deleted",
        )

    db.delete(user)
    db.commit()

    return {
        "message": "User deleted successfully"
    }
def get_profile(
    db: Session,
    current_user: User,
):
    post_count = (
        db.query(Post)
        .filter(Post.user_id == current_user.id)
        .count()
    )

    comment_count = (
        db.query(Comment)
        .filter(Comment.user_id == current_user.id)
        .count()
    )

    return {
        "id": current_user.id,
        "username": current_user.username,
        "email": current_user.email,
        "role": current_user.role,
        "post_count": post_count,
        "comment_count": comment_count,
    }