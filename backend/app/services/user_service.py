from fastapi import HTTPException
from sqlalchemy.orm import Session
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
from app.services.verification_service import create_verification_token
from app.schemas.user import UserCreate
from app.services.notification_service import create_notification
from app.services.password_reset_service import (
    create_reset_token,
    reset_password,
)

from math import ceil


def create_user(
    db: Session,
    user: UserCreate,
) -> User:

    existing_email = (
        db.query(User)
        .filter(User.email == user.email)
        .first()
    )

    if existing_email:
        raise HTTPException(
            status_code=409,
            detail="Email already registered",
        )

    existing_username = (
        db.query(User)
        .filter(User.username == user.username)
        .first()
    )

    if existing_username:
        raise HTTPException(
            status_code=409,
            detail="Username already taken",
        )

    new_user = User(
        username=user.username,
        email=user.email,
        hashed_password=hash_password(user.password),
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    verification = create_verification_token(
        db=db,
        user_id=new_user.id,
    )

    return{
        "user": new_user,
        "token": verification.token,
    }


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

    if not user.is_verified:
        raise HTTPException(
            status_code=403,
            detail="Please verify your email before logging in.",
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
            is_verified=True,
        )

        db.add(user)
        db.commit()
        db.refresh(user)


    return create_access_token(
        data={"sub": user.email}
    )


def get_users(
    db: Session,
    page: int = 1,
    limit: int = 10,
    query: str | None = None,
):
    users_query = db.query(User)

    if query:
        users_query = users_query.filter(
            User.username.ilike(f"%{query}%")
        )

    total = users_query.count()

    users = (
        users_query
        .order_by(User.id.desc())
        .offset((page - 1) * limit)
        .limit(limit)
        .all()
    )

    return {
        "items": users,
        "page": page,
        "limit": limit,
        "total": total,
        "pages": ceil(total / limit) if total else 1,
    }


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
    create_notification(
        db=db,
        recipient_id=target_user.id,
        sender_id=current_user.id,
        notification_type="follow",
    )
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

    if current_user:
        is_following = (
            db.query(Follow)
            .filter(
                Follow.follower_id == current_user.id,
                Follow.following_id == user.id,
            )
            .first()
            is not None
        )
    else:
        is_following = False

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
):
    return (
        db.query(User)
        .filter(
            User.username.ilike(f"%{query}%")
        )
        .limit(10)
        .all()
    )

def get_user_by_username(
    db: Session,
    username: str,
):
    user = (
        db.query(User)
        .filter(User.username == username)
        .first()
    )

    if not user:
        raise HTTPException(
            status_code=404,
            detail="User not found",
        )

    return {
        "id": user.id,
        "username": user.username,
    }