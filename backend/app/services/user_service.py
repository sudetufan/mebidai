from fastapi import HTTPException
from sqlalchemy.orm import Session
from app.schemas.user import UserCreate
from app.models.post import Post
from app.models.comment import Comment
from app.models.like import Like
from app.models.user import User
from app.models.follow import Follow
from app.security import (
    hash_password,
    verify_password,
    create_access_token,
)
from sqlalchemy import func
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

def google_login_user(
    db: Session,
    google_data: dict,
) -> str:
    email = google_data.get("email")
    google_id = google_data.get("sub")
    username = google_data.get("name")
    if not email or not google_id:
        raise HTTPException(
            status_code=400,
            detail="Invalid Google account data",
        )
    user = (
        db.query(User)
        .filter(User.email == email)
        .first()
    )
    if not user:
        username = username.replace(" ", "_").lower()
        existing_username = (
            db.query(User)
            .filter(User.username == username)
            .first()
        )
        if existing_username:
            username = f"{username}_{google_id[:5]}"
        user = User(
            username=username,
            email=email,
            google_id=google_id,
            provider="google",
            hashed_password=None,
        )

        db.add(user)
        db.commit()
        db.refresh(user)


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

    like_count = (
        db.query(Like)
        .join(Post)
        .filter(Post.user_id == current_user.id)
        .count()
    )

    followers_count = (
        db.query(Follow)
        .filter(Follow.following_id == current_user.id)
        .count()
    )

    following_count = (
        db.query(Follow)
        .filter(Follow.follower_id == current_user.id)
        .count()
    )

    return {
        "id": current_user.id,
        "username": current_user.username,
        "email": current_user.email,
        "role": current_user.role,
        "post_count": post_count,
        "comment_count": comment_count,
        "like_count": like_count,
        "followers_count": followers_count,
        "following_count": following_count,
        "is_following": False,
    }

def follow_user(
    db: Session,
    current_user: User,
    target_user_id: int,
):
    if current_user.id == target_user_id:
        raise HTTPException(
            status_code=400,
            detail="You cannot follow yourself",
        )

    target_user = (
        db.query(User)
        .filter(User.id == target_user_id)
        .first()
    )

    if not target_user:
        raise HTTPException(
            status_code=404,
            detail="User not found",
        )

    existing_follow = (
        db.query(Follow)
        .filter(
            Follow.follower_id == current_user.id,
            Follow.following_id == target_user_id,
        )
        .first()
    )

    if existing_follow:
        raise HTTPException(
            status_code=400,
            detail="Already following this user",
        )

    follow = Follow(
        follower_id=current_user.id,
        following_id=target_user_id,
    )

    db.add(follow)
    db.commit()

    return {
        "message": "User followed successfully"
    }


def unfollow_user(
    db: Session,
    current_user: User,
    target_user_id: int,
):
    follow = (
        db.query(Follow)
        .filter(
            Follow.follower_id == current_user.id,
            Follow.following_id == target_user_id,
        )
        .first()
    )

    if not follow:
        raise HTTPException(
            status_code=404,
            detail="Follow relationship not found",
        )

    db.delete(follow)
    db.commit()

    return {
        "message": "User unfollowed successfully"
    }


def get_followers(
    db: Session,
    user_id: int,
):
    return (
        db.query(User)
        .join(
            Follow,
            Follow.follower_id == User.id,
        )
        .filter(
            Follow.following_id == user_id,
        )
        .all()
    )


def get_following(
    db: Session,
    user_id: int,
):
    return (
        db.query(User)
        .join(
            Follow,
            Follow.following_id == User.id,
        )
        .filter(
            Follow.follower_id == user_id,
        )
        .all()
    )

def get_user_profile(
    db: Session,
    current_user: User,
    user_id: int,
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

    post_count = (
        db.query(Post)
        .filter(Post.user_id == user.id)
        .count()
    )

    comment_count = (
        db.query(Comment)
        .filter(Comment.user_id == user.id)
        .count()
    )

    like_count = (
        db.query(Like)
        .join(Post)
        .filter(Post.user_id == user.id)
        .count()
    )

    followers_count = (
        db.query(Follow)
        .filter(Follow.following_id == user.id)
        .count()
    )

    following_count = (
        db.query(Follow)
        .filter(Follow.follower_id == user.id)
        .count()
    )

    is_following = (
        db.query(Follow)
        .filter(
            Follow.follower_id == current_user.id,
            Follow.following_id == user.id,
        )
        .first()
        is not None
    )

    return {
        "id": user.id,
        "username": user.username,
        "email": user.email,
        "role": user.role,
        "post_count": post_count,
        "comment_count": comment_count,
        "like_count": like_count,
        "followers_count": followers_count,
        "following_count": following_count,
        "is_following": is_following,
    }

def search_users(
    db: Session,
    query: str,
    current_user: User,
):
    return (
        db.query(User)
        .filter(
            User.username.ilike(f"%{query}%"),
            User.id != current_user.id,
        )
        .limit(10)
        .all()
    )