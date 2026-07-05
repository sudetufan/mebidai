from pydantic import BaseModel, ConfigDict
from app.schemas.user import UserSimple


class CommentCreate(BaseModel):
    content: str
    post_id: int


class CommentResponse(CommentCreate):
    id: int
    user: UserSimple

    model_config = ConfigDict(from_attributes=True)