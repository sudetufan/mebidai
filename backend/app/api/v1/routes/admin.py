from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.api.dependencies import (
    get_db,
    get_admin_user,
)

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


@router.get(
    "/users",
    response_model=list[UserResponse],
)
def read_users(
    db: Session = Depends(get_db),
    admin: User = Depends(get_admin_user),
):
    return get_users(db)



@router.get(
    "/posts",
    response_model=list[PostResponse],
)
def read_posts(
    db: Session = Depends(get_db),
    admin: User = Depends(get_admin_user),
):
    return get_posts(
        db,
        admin,
    )



@router.get(
    "/comments",
    response_model=list[CommentResponse],
)
def read_comments(
    db: Session = Depends(get_db),
    admin: User = Depends(get_admin_user),
):
    return get_all_comments(db)



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