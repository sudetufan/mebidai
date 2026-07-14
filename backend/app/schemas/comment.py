from pydantic import BaseModel, ConfigDict
from app.schemas.user import UserSimple


class CommentCreate(BaseModel):
    content: str
    post_id: int
    parent_id: int | None = None


class CommentUpdate(BaseModel):
    content: str


class CommentResponse(BaseModel):
    id: int
    content: str
    post_id: int
    parent_id: int | None = None
    user: UserSimple
    replies: list["CommentResponse"] = []

    model_config = ConfigDict(
        from_attributes=True
    )
CommentResponse.model_rebuild()