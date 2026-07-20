from sqlalchemy.orm import Session
from fastapi import APIRouter, Depends, Query
from app.api.dependencies import (
    get_db,
    get_admin_user,
)
from fastapi import Query
from app.models.user import User

from app.schemas.user import UserResponse
from app.schemas.post import PostResponse
from app.schemas.comment import CommentResponse

from app.services.user_service import (
    get_users,
    delete_user,
)

from app.services.post_service import (
    get_posts,
    delete_post,
)

from app.services.comment_service import (
    get_all_comments,
    delete_comment,
)


router = APIRouter(
    prefix="/admin",
    tags=["Admin"],
)

@router.get("/users")
def read_users(
    page: int = Query(1, ge=1),
    limit: int = Query(10, ge=1, le=100),
    query: str | None = None,
    db: Session = Depends(get_db),
    admin: User = Depends(get_admin_user),
):
    return get_users(
        db=db,
        page=page,
        limit=limit,
        query=query,
    )

@router.get("/posts")
def read_posts(
    page: int = Query(1, ge=1),
    limit: int = Query(10, ge=1, le=100),
    query: str | None = None,
    db: Session = Depends(get_db),
    admin: User = Depends(get_admin_user),
):
    data = get_posts(
        db=db,
        current_user=admin,
        page=page,
        limit=limit,
        query=query,
    )

    return {
        "items": data["posts"],
        "page": data["page"],
        "limit": data["limit"],
        "total": data["total"],
        "pages": (
            (data["total"] + limit - 1) // limit
            if data["total"] > 0
            else 1
        ),
    }

@router.get("/comments")
def read_comments(
    page: int = Query(1, ge=1),
    limit: int = Query(10, ge=1, le=100),
    query: str | None = None,
    db: Session = Depends(get_db),
    admin: User = Depends(get_admin_user),
):
    return get_all_comments(
        db=db,
        page=page,
        limit=limit,
        query=query,
    )

@router.delete("/posts/{post_id}")
def remove_post(
    post_id: int,
    db: Session = Depends(get_db),
    admin: User = Depends(get_admin_user),
):
    return delete_post(
        db,
        post_id,
        admin,
    )



@router.delete("/comments/{comment_id}")
def remove_comment(
    comment_id: int,
    db: Session = Depends(get_db),
    admin: User = Depends(get_admin_user),
):
    return delete_comment(
        db,
        comment_id,
        admin,
    )



@router.delete("/users/{user_id}")
def delete_user_endpoint(
    user_id: int,
    db: Session = Depends(get_db),
    admin: User = Depends(get_admin_user),
):
    return delete_user(
        db,
        user_id,
        admin,
    )