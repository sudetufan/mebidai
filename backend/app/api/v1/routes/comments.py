from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.api.dependencies import (
    get_db,
    get_current_user,
)

from app.models.user import User

from app.schemas.comment import (
    CommentCreate,
    CommentUpdate,
    CommentResponse,
)

from app.services.comment_service import (
    create_comment,
    get_comments,
    update_comment,
    delete_comment,
)

router = APIRouter(
    prefix="/comments",
    tags=["Comments"],
)


@router.post("/", response_model=CommentResponse)
def create(
    comment: CommentCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return create_comment(
        db,
        comment,
        current_user.id,
    )


@router.get("/", response_model=list[CommentResponse])
def read_comments(
    post_id: int = Query(...),
    db: Session = Depends(get_db),
):
    return get_comments(
        db,
        post_id,
    )


@router.put("/{comment_id}", response_model=CommentResponse)
def update(
    comment_id: int,
    comment: CommentUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return update_comment(
        db,
        comment_id,
        comment,
        current_user,
    )


@router.delete("/{comment_id}")
def delete(
    comment_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return delete_comment(
        db,
        comment_id,
        current_user,
    )