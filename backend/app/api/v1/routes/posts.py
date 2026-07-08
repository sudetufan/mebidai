from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.api.dependencies import (
    get_db,
    get_current_user,
    get_optional_user,
)

from app.models.user import User

from app.schemas.post import (
    PostCreate,
    PostResponse,
    PaginatedPostsResponse,
)

from app.services.like_service import (
    like_post,
    unlike_post,
)

from app.services.post_service import (
    create_post,
    get_posts,
    get_post,
    update_post,
    delete_post,
    search_posts,
)

router = APIRouter(
    prefix="/posts",
    tags=["Posts"],
)


@router.post("/", response_model=PostResponse)
def create(
    post: PostCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return create_post(
        db,
        post,
        current_user.id,
    )


@router.get("/", response_model=PaginatedPostsResponse)
def read_posts(
    page: int = Query(1, ge=1),
    limit: int = Query(10, ge=1, le=100),
    category_id: int | None = Query(None),
    db: Session = Depends(get_db),
    current_user: User | None = Depends(get_optional_user),
):
    return get_posts(
        db,
        current_user,
        page,
        limit,
        category_id,
    )


@router.get("/search", response_model=list[PostResponse])
def search(
    q: str,
    db: Session = Depends(get_db),
    current_user: User | None = Depends(get_optional_user),
):
    return search_posts(
        db,
        q,
        current_user,
    )


@router.get("/{post_id}")
def read_post(
    post_id: int,
    db: Session = Depends(get_db),
    current_user: User | None = Depends(get_optional_user),
):
    return get_post(
        db,
        post_id,
        current_user,
    )


@router.put("/{post_id}", response_model=PostResponse)
def update(
    post_id: int,
    post: PostCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return update_post(
        db,
        post_id,
        post,
        current_user,
    )


@router.delete("/{post_id}")
def delete(
    post_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return delete_post(
        db,
        post_id,
        current_user,
    )


@router.post("/{post_id}/like")
def like(
    post_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return like_post(
        db,
        post_id,
        current_user,
    )


@router.delete("/{post_id}/like")
def unlike(
    post_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return unlike_post(
        db,
        post_id,
        current_user,
    )