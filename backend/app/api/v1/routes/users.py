from fastapi import APIRouter, Depends, Response
from sqlalchemy.orm import Session

from app.models.user import User
from app.api.dependencies import (
    get_db,
    get_admin_user,
    get_current_user,
)
from app.schemas.user import (
    UserCreate,
    UserLogin,
    UserProfile,
)
from app.schemas.post import PostResponse

from app.services.user_service import (
    create_user,
    login_user,
    get_profile,
)
from app.services.post_service import (
    get_user_posts,
)

router = APIRouter(
    prefix="/users",
    tags=["Users"],
)


@router.post("/register")
def register(
    user: UserCreate,
    db: Session = Depends(get_db),
):
    return create_user(db, user)


@router.post("/login")
def login(
    user: UserLogin,
    response: Response,
    db: Session = Depends(get_db),
):
    access_token = login_user(
        db,
        user.email,
        user.password,
    )

    response.set_cookie(
        key="access_token",
        value=access_token,
        httponly=True,
        samesite="lax",
        secure=False,
        path="/",
    )

    return {"message": "Login successful"}


@router.get("/me")
def me(
    current_user: User = Depends(get_current_user),
):
    return {
        "id": current_user.id,
        "username": current_user.username,
        "email": current_user.email,
        "role": current_user.role,
    }


@router.get(
    "/profile",
    response_model=UserProfile,
)
def profile(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return get_profile(db, current_user)


@router.get(
    "/profile/posts",
    response_model=list[PostResponse],
)
def profile_posts(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return get_user_posts(
        db,
        current_user.id,
    )


@router.post("/logout")
def logout(response: Response):
    response.delete_cookie(
        "access_token",
        path="/",
    )
    return {
        "message": "Logged out"
    }


@router.get("/admin-test")
def admin_test(
    admin: User = Depends(get_admin_user),
):
    return {
        "message": f"Welcome Admin {admin.username}"
    }