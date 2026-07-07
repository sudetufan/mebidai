from pydantic import BaseModel, ConfigDict
from app.schemas.user import UserSimple


class PostCreate(BaseModel):
    title: str
    content: str


class PostResponse(PostCreate):
    id: int
    user: UserSimple

    like_count: int = 0
    liked: bool = False

    model_config = ConfigDict(from_attributes=True)