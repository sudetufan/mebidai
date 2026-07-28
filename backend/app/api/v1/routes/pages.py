import re
import os
from dotenv import load_dotenv

from fastapi import APIRouter, Request, Depends, Form, Query, HTTPException
from fastapi.responses import HTMLResponse, RedirectResponse
from fastapi.templating import Jinja2Templates
from sqlalchemy.orm import Session
from markupsafe import escape, Markup

load_dotenv()

from app.api.dependencies import (
    get_db,
    get_optional_user,
    get_current_user,
    get_admin_user,
)
from app.models.user import User
from app.models.comment import Comment
from app.services.category_service import get_categories
from app.services.post_service import (
    get_posts,
    get_post,
    create_post,
    update_post,
    delete_post,
    get_user_posts,
)
from app.services.user_service import (
    get_user_profile,
    get_followers,
    get_following,
    follow_user,
    unfollow_user,
    get_users,
)
from app.services.comment_service import (
    get_comments,
    create_comment,
    update_comment,
    delete_comment,
    get_all_comments,
)
from app.services.like_service import (
    like_post,
    unlike_post,
)
from app.schemas.post import PostCreate
from app.schemas.comment import (
    CommentCreate,
    CommentUpdate,
)

router = APIRouter()
templates = Jinja2Templates(
    directory="app/templates"
)

def mention_links(content):
    if not content:
        return ""
    escaped_content = str(escape(content))
    processed_content = re.sub(
        r"@([A-Za-zA-Z0-9_]+)",
        r'<a href="/users/\1">@\1</a>',
        escaped_content,
    )
    return Markup(processed_content)

templates.env.filters["mention_links"] = mention_links

@router.get("/", response_class=HTMLResponse)
async def home(
    request: Request,
    current_user: User | None = Depends(get_optional_user),
):
    return templates.TemplateResponse(
        request=request,
        name="index.html",
        context={
            "request": request,
            "current_user": current_user,
        },
    )

@router.get("/login", response_class=HTMLResponse)
async def login_page(request: Request):
    return templates.TemplateResponse(
        request=request,
        name="login.html",
        context={
            "request": request,
            "google_client_id": os.getenv("GOOGLE_CLIENT_ID"),
        },
    )

@router.get("/register", response_class=HTMLResponse)
async def register_page(request: Request):
    return templates.TemplateResponse(
        request=request,
        name="register.html",
        context={
            "request": request,
            "google_client_id": os.getenv("GOOGLE_CLIENT_ID"),
        },
    )

@router.get("/forgot-password", response_class=HTMLResponse)
async def forgot_password_page(request: Request):
    return templates.TemplateResponse(
        request=request,
        name="forgot-password.html",
        context={},
    )

@router.get("/reset-password", response_class=HTMLResponse)
async def reset_password_page(request: Request):
    return templates.TemplateResponse(
        request=request,
        name="reset-password.html",
        context={},
    )

@router.get("/blog", response_class=HTMLResponse)
async def blog_page(
    request: Request,
    db: Session = Depends(get_db),
    current_user: User | None = Depends(get_optional_user),
    category_id: int | None = Query(None),
    q: str | None = Query(None),
    page: int = Query(1, ge=1),
):
    result = get_posts(
        db=db,
        current_user=current_user,
        page=page,
        limit=10,
        category_id=category_id,
        query=q,
    )
    categories = get_categories(db)
    return templates.TemplateResponse(
        request=request,
        name="blog.html",
        context={
            "request": request,
            "posts": result["posts"],
            "categories": categories,
            "selected_category": category_id,
            "query": q,
            "page": result["page"],
            "limit": result["limit"],
            "total": result["total"],
            "current_user": current_user,
        },
    )

@router.get("/posts/{post_id}", response_class=HTMLResponse)
async def post_detail(
    post_id: int,
    request: Request,
    db: Session = Depends(get_db),
    current_user: User | None = Depends(get_optional_user),
):
    post = get_post(
        db=db,
        post_id=post_id,
        current_user=current_user,
    )
    comments = get_comments(
        db,
        post_id,
    )
    return templates.TemplateResponse(
        request=request,
        name="post-detail.html",
        context={
            "request": request,
            "post": post,
            "comments": comments,
            "current_user": current_user,
        },
    )

@router.post("/posts/{post_id}/comment")
async def add_comment(
    post_id: int,
    content: str = Form(...),
    parent_id: int | None = Form(None),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    create_comment(
        db=db,
        comment=CommentCreate(
            content=content,
            post_id=post_id,
            parent_id=parent_id,
        ),
        user_id=current_user.id,
    )
    return RedirectResponse(
        url=f"/posts/{post_id}",
        status_code=303,
    )

@router.post("/posts/{post_id}/like")
async def like(
    post_id: int,
    db: Session = Depends(get_db),
    current_user: User | None = Depends(get_optional_user),
):
    if current_user is None:
        return RedirectResponse(
            url="/login",
            status_code=303,
        )
    like_post(
        db,
        post_id,
        current_user,
    )
    return RedirectResponse(
        url=f"/posts/{post_id}",
        status_code=303,
    )

@router.post("/posts/{post_id}/unlike")
async def unlike(
    post_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    unlike_post(
        db,
        post_id,
        current_user,
    )
    return RedirectResponse(
        url=f"/posts/{post_id}",
        status_code=303,
    )

@router.get("/create-post", response_class=HTMLResponse)
async def create_post_page(
    request: Request,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    categories = get_categories(db)
    return templates.TemplateResponse(
        request=request,
        name="create-post.html",
        context={
            "request": request,
            "categories": categories,
            "current_user": current_user,
        },
    )

@router.post("/create-post")
async def create_post_submit(
    title: str = Form(...),
    content: str = Form(...),
    category_id: int = Form(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    create_post(
        db=db,
        post=PostCreate(
            title=title,
            content=content,
            category_id=category_id,
        ),
        user_id=current_user.id,
    )
    return RedirectResponse(
        url="/blog",
        status_code=303,
    )

@router.get("/posts/{post_id}/edit", response_class=HTMLResponse)
async def edit_post_page(
    post_id: int,
    request: Request,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    post = get_post(
        db=db,
        post_id=post_id,
        current_user=current_user,
    )
    if post.user_id != current_user.id and current_user.role != "admin":
        return RedirectResponse(
            url="/blog?error=no_permission",
            status_code=303,
        )
    categories = get_categories(db)
    return templates.TemplateResponse(
        request=request,
        name="edit-post.html",
        context={
            "request": request,
            "post": post,
            "categories": categories,
            "current_user": current_user,
        },
    )

@router.post("/posts/{post_id}/edit")
async def edit_post_submit(
    post_id: int,
    title: str = Form(...),
    content: str = Form(...),
    category_id: int = Form(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    update_post(
        db=db,
        post_id=post_id,
        post=PostCreate(
            title=title,
            content=content,
            category_id=category_id,
        ),
        current_user=current_user,
    )
    return RedirectResponse(
        url=f"/posts/{post_id}",
        status_code=303,
    )

@router.post("/posts/{post_id}/delete")
async def delete_post_submit(
    post_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    delete_post(
        db=db,
        post_id=post_id,
        current_user=current_user,
    )
    return RedirectResponse(
        url="/blog",
        status_code=303,
    )

@router.get(
    "/comments/{comment_id}/edit",
    response_class=HTMLResponse
)
async def edit_comment_page(
    comment_id: int,
    request: Request,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    comment = (
        db.query(Comment)
        .filter(Comment.id == comment_id)
        .first()
    )
    if not comment:
        return RedirectResponse(
            url="/blog",
            status_code=303,
        )

    if comment.user_id != current_user.id and current_user.role != "admin":
        return RedirectResponse(
            url=f"/posts/{comment.post_id}?error=no_permission",
            status_code=303,
        )
    return templates.TemplateResponse(
        request=request,
        name="edit-comment.html",
        context={
            "request": request,
            "comment": comment,
        },
    )

@router.post("/comments/{comment_id}/edit")
async def edit_comment_submit(
    comment_id: int,
    content: str = Form(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    comment = (
        db.query(Comment)
        .filter(Comment.id == comment_id)
        .first()
    )
    if not comment:
        return RedirectResponse(
            url="/blog",
            status_code=303,
        )
    if comment.user_id != current_user.id and current_user.role != "admin":
        return RedirectResponse(
            url=f"/posts/{comment.post_id}?error=no_permission",
            status_code=303,
        )
    update_comment(
        db=db,
        comment_id=comment_id,
        data=CommentUpdate(
            content=content
        ),
        current_user=current_user,
    )
    return RedirectResponse(
        url=f"/posts/{comment.post_id}",
        status_code=303,
    )

@router.post("/comments/{comment_id}/delete")
async def delete_comment_submit(
    comment_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    comment = (
        db.query(Comment)
        .filter(Comment.id == comment_id)
        .first()
    )
    if not comment:
        return RedirectResponse(
            url="/blog",
            status_code=303,
        )
    delete_comment(
        db=db,
        comment_id=comment_id,
        current_user=current_user,
    )
    return RedirectResponse(
        url=f"/posts/{comment.post_id}",
        status_code=303,
    )

@router.get("/logout")
async def logout():
    response = RedirectResponse(
        url="/login",
        status_code=303,
    )
    response.delete_cookie(
        key="access_token",
        path="/",
    )
    return response

@router.get("/admin", response_class=HTMLResponse)
async def admin_page(
    request: Request,
    user_query: str | None = Query(None),
    post_query: str | None = Query(None),
    comment_query: str | None = Query(None),
    user_page: int = Query(1, ge=1),
    post_page: int = Query(1, ge=1),
    comment_page: int = Query(1, ge=1),
    db: Session = Depends(get_db),
    admin: User = Depends(get_admin_user),
):
    users = get_users(
        db=db,
        page=user_page,
        limit=10,
        query=user_query,
    )
    posts_data = get_posts(
        db=db,
        current_user=admin,
        page=post_page,
        limit=10,
        query=post_query,
    )
    comments_data = get_all_comments(
        db=db,
        page=comment_page,
        limit=10,
        query=comment_query,
    )
    return templates.TemplateResponse(
        request=request,
        name="admin.html",
        context={
            "request": request,
            "current_user": admin,
            "users": users["items"],
            "users_count": users["total"],
            "user_page": users["page"],
            "user_limit": users["limit"],
            "users_pages": users["pages"],
            "user_query": user_query,
            "posts": posts_data["posts"],
            "posts_count": posts_data["total"],
            "post_page": posts_data["page"],
            "post_limit": posts_data["limit"],
            "posts_pages": posts_data["pages"],
            "post_query": post_query,
            "comments": comments_data["items"],
            "comments_count": comments_data["total"],
            "comment_page": comments_data["page"],
            "comment_limit": comments_data["limit"],
            "comments_pages": comments_data["pages"],
            "comment_query": comment_query,
        },
    )

@router.get("/profile", response_class=HTMLResponse)
async def profile_page(
    request: Request,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    db.refresh(current_user)
    posts = get_user_posts(
        db,
        current_user.id,
    )
    followers = get_followers(
        db,
        current_user.id,
    )
    following = get_following(
        db,
        current_user.id,
    )
    return templates.TemplateResponse(
        request=request,
        name="profile.html",
        context={
            "request": request,
            "profile_user": current_user,
            "posts": posts,
            "followers_count": len(followers),
            "following_count": len(following),
            "posts_count": len(posts),
            "followers": followers,
            "following": following,
            "current_user": current_user,
        },
    )

@router.get("/users/{user_identifier}", response_class=HTMLResponse)
async def user_profile_page(
    user_identifier: str,
    request: Request,
    db: Session = Depends(get_db),
    current_user: User | None = Depends(get_optional_user),
):
    if user_identifier.isdigit():
        profile_user_model = (
            db.query(User)
            .filter(User.id == int(user_identifier))
            .first()
        )
    else:
        profile_user_model = (
            db.query(User)
            .filter(User.username == user_identifier)
            .first()
        )
    if not profile_user_model:
        return RedirectResponse(
            url="/blog",
            status_code=303,
        )
    user_id = profile_user_model.id
    profile_user = get_user_profile(
        db,
        current_user,
        user_id,
    )
    posts = get_user_posts(
        db,
        user_id,
    )
    followers = get_followers(
        db,
        user_id,
    )
    following = get_following(
        db,
        user_id,
    )
    is_following = False
    if current_user:
        is_following = current_user.id in [
            follower.id for follower in followers
        ]
    return templates.TemplateResponse(
        request=request,
        name="user-profile.html",
        context={
            "request": request,
            "profile_user": profile_user,
            "posts": posts,
            "posts_count": len(posts),
            "followers_count": len(followers),
            "following_count": len(following),
            "followers": followers,
            "following": following,
            "current_user": current_user,
            "is_following": is_following,
        },
    )

@router.get("/settings", response_class=HTMLResponse)
async def settings_page(
    request: Request,
    db: Session = Depends(get_db),
    current_user: User | None = Depends(get_optional_user),
):
    if current_user is None:
        return RedirectResponse(
            url="/login",
            status_code=303,
        )
    db.refresh(current_user)
    return templates.TemplateResponse(
        request=request,
        name="settings.html",
        context={
            "request": request,
            "current_user": current_user,
        },
    )

@router.post("/users/{user_id}/follow")
async def follow_user_page(
    user_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    follow_user(
        db,
        current_user,
        user_id,
    )
    user = (
        db.query(User)
        .filter(User.id == user_id)
        .first()
    )
    return RedirectResponse(
        url=f"/users/{user.username}",
        status_code=303,
    )

@router.post("/users/{user_id}/unfollow")
async def unfollow_user_page(
    user_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    unfollow_user(
        db,
        current_user,
        user_id,
    )
    user = (
        db.query(User)
        .filter(User.id == user_id)
        .first()
    )
    return RedirectResponse(
        url=f"/users/{user.username}",
        status_code=303,
    )