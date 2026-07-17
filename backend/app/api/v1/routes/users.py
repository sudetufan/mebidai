from fastapi import APIRouter, Depends, Response, HTTPException, Query
from sqlalchemy.orm import Session
from app.models.user import User
from app.api.dependencies import (
    get_db,
    get_admin_user,
    get_current_user,
    get_optional_user,
)
from app.services.verification_service import (
    verify_email_token,
)
from app.services.email_service import (
    send_verification_email,
    send_password_reset_email,
)
from app.services.password_reset_service import (
    create_reset_token,
    reset_password,
)
from app.schemas.user import (
    UserCreate,
    UserLogin,
    UserProfile,
    UserMini,
    PasswordResetRequest,
    PasswordResetConfirm,
    RegisterResponse,
)

from app.schemas.post import PostResponse

from app.services.user_service import (
    create_user,
    login_user,
    google_login_user,
    get_profile,
    get_user_profile,
    follow_user,
    unfollow_user,
    get_followers,
    get_following,
    search_users,
)

from app.services.google_service import (
    verify_google_token,
)

from app.services.post_service import (
    get_user_posts,
)


router = APIRouter(
    prefix="/users",
    tags=["Users"],
)


@router.post("/register", response_model=RegisterResponse)
async def register(
    user: UserCreate,
    db: Session = Depends(get_db),
):
    result = create_user(db, user)

    await send_verification_email(
        email=result["user"].email,
        token=result["token"],
    )

    return {
        "message": "Registration successful. Please verify your email.",
        "user": result["user"],
    }


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

    return {
        "message": "Login successful"
    }


@router.post("/google-login")
def google_login(
    data: dict,
    response: Response,
    db: Session = Depends(get_db),
):

    token = data.get("token")

    if not token:
        raise HTTPException(
            status_code=400,
            detail="Google token is required",
        )

    google_user = verify_google_token(token)

    if not google_user:
        raise HTTPException(
            status_code=401,
            detail="Invalid Google token",
        )

    access_token = google_login_user(
        db,
        google_user,
    )

    response.set_cookie(
        key="access_token",
        value=access_token,
        httponly=True,
        samesite="lax",
        secure=False,
        path="/",
    )

    return {
        "message": "Google login successful"
    }


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
    return get_profile(
        db,
        current_user,
    )


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

@router.get("/verify-email")
def verify_email(
    token: str,
    db: Session = Depends(get_db),
):
    return verify_email_token(
        db=db,
        token=token,
    )

@router.post("/forgot-password")
async def forgot_password(
    data: PasswordResetRequest,
    db: Session = Depends(get_db),
):
    reset = create_reset_token(
        db,
        data.email,
    )

    await send_password_reset_email(
        email=data.email,
        token=reset.token,
    )

    return {
        "message": "Password reset email sent."
    }


@router.post("/reset-password")
def reset_password_endpoint(
    data: PasswordResetConfirm,
    db: Session = Depends(get_db),
):
    return reset_password(
        db,
        data.token,
        data.new_password,
    )

@router.get("/search", response_model=list[UserMini])
def search(
    q: str = Query(...),
    db: Session = Depends(get_db),
):
    return search_users(
        db,
        q,
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

@router.get(
    "/{user_id}",
    response_model=UserProfile,
)
def user_profile(
    user_id: int,
    db: Session = Depends(get_db),
    current_user: User | None = Depends(get_optional_user),
):
    return get_user_profile(
        db,
        current_user,
        user_id,
    )

@router.get(
    "/{user_id}/posts",
    response_model=list[PostResponse],
)
def user_posts(
    user_id: int,
    db: Session = Depends(get_db),
):
    return get_user_posts(
        db,
        user_id,
    )




@router.post("/{user_id}/follow")
def follow(
    user_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):

    return follow_user(
        db,
        current_user,
        user_id,
    )


@router.delete("/{user_id}/follow")
def unfollow(
    user_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):

    return unfollow_user(
        db,
        current_user,
        user_id,
    )


@router.get(
    "/{user_id}/followers",
    response_model=list[UserMini],
)
def followers(
    user_id: int,
    db: Session = Depends(get_db),
):

    return get_followers(
        db,
        user_id,
    )

@router.get(
    "/{user_id}/following",
    response_model=list[UserMini],
)
def following(
    user_id: int,
    db: Session = Depends(get_db),
):

    return get_following(
        db,
        user_id,
    )