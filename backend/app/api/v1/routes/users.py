from fastapi import APIRouter, Depends, Response, HTTPException, Query, Request
from sqlalchemy.orm import Session
from app.models.user import User
from app.api.dependencies import (
    get_db,
    get_admin_user,
    get_current_user,
    get_optional_user,
)
from fastapi.templating import Jinja2Templates
from app.services.verification_service import verify_email_token
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
    ChangePasswordRequest,
    BioUpdate,
)
from app.security import (
    verify_password,
    hash_password,
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
    update_username,
    update_bio,
)
from app.services.google_service import verify_google_token
from app.services.post_service import get_user_posts

router = APIRouter(
    prefix="/users",
    tags=["Users"],
)

templates = Jinja2Templates(directory="app/templates")


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
    return {"message": "Login successful"}


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
    return {"message": "Google login successful"}


@router.get("/me")
def me(
    current_user: User = Depends(get_current_user),
):
    return {
        "id": current_user.id,
        "username": current_user.username,
        "email": current_user.email,
        "role": current_user.role,
        "bio": current_user.bio,
    }


@router.put("/me/username")
def change_username(
    data: dict,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return update_username(
        db=db,
        current_user=current_user,
        username=data.get("username", ""),
    )


@router.put("/me/bio")
def change_bio(
    data: BioUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return update_bio(
        db=db,
        current_user=current_user,
        bio=data.bio,
    )


@router.put("/me/password")
def change_password(
    data: ChangePasswordRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    if not verify_password(data.current_password, current_user.hashed_password):
        raise HTTPException(
            status_code=400,
            detail="Current password is incorrect",
        )

    if data.new_password != data.confirm_password:
        raise HTTPException(
            status_code=400,
            detail="Passwords do not match",
        )

    current_user.hashed_password = hash_password(data.new_password)
    db.commit()

    return {"message": "Password changed successfully"}


@router.get("/profile")
def profile(
    request: Request,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    posts = get_user_posts(db, current_user.id)
    followers = get_followers(db, current_user.id)
    following = get_following(db, current_user.id)

    return templates.TemplateResponse(
        "profile.html",
        {
            "request": request,
            "current_user": current_user,
            "posts": posts,
            "posts_count": len(posts),
            "followers": followers,
            "following": following,
            "followers_count": len(followers),
            "following_count": len(following),
        },
    )


@router.get(
    "/profile/posts",
    response_model=list[PostResponse],
)
def profile_posts(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return get_user_posts(db, current_user.id)


@router.get("/verify-email")
def verify_email(
    request: Request,
    token: str,
    db: Session = Depends(get_db),
):
    result = verify_email_token(
        db=db,
        token=token,
    )
    return templates.TemplateResponse(
        request=request,
        name="verify-email.html",
        context={"message": result["message"]},
    )


@router.post("/forgot-password")
async def forgot_password(
    data: PasswordResetRequest,
    db: Session = Depends(get_db),
):
    reset = create_reset_token(db, data.email)
    await send_password_reset_email(
        email=data.email,
        token=reset.token,
    )
    return {"message": "Password reset email sent."}


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
    return search_users(db, q)


@router.post("/logout")
def logout(response: Response):
    response.delete_cookie(
        "access_token",
        path="/",
    )
    return {"message": "Logged out"}


@router.get("/admin-test")
def admin_test(
    admin: User = Depends(get_admin_user),
):
    return {"message": f"Welcome Admin {admin.username}"}


@router.get("/{user_id}")
def user_profile(
    request: Request,
    user_id: int,
    db: Session = Depends(get_db),
    current_user: User | None = Depends(get_optional_user),
):
    profile_user = get_user_profile(
        db,
        current_user,
        user_id,
    )
    if not profile_user:
        raise HTTPException(
            status_code=404,
            detail="User not found",
        )

    posts = get_user_posts(db, user_id)
    followers = get_followers(db, user_id)
    following = get_following(db, user_id)

    is_following = False
    if current_user:
        is_following = current_user in followers

    return templates.TemplateResponse(
        "user_profile.html",
        {
            "request": request,
            "current_user": current_user,
            "profile_user": profile_user,
            "posts": posts,
            "posts_count": len(posts),
            "followers": followers,
            "following": following,
            "followers_count": len(followers),
            "following_count": len(following),
            "is_following": is_following,
        },
    )


@router.get(
    "/{user_id}/posts",
    response_model=list[PostResponse],
)
def user_posts(
    user_id: int,
    db: Session = Depends(get_db),
):
    return get_user_posts(db, user_id)


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


@router.post("/{user_id}/unfollow")
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
    return get_followers(db, user_id)


@router.get(
    "/{user_id}/following",
    response_model=list[UserMini],
)
def following(
    user_id: int,
    db: Session = Depends(get_db),
):
    return get_following(db, user_id)