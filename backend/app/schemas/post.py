from pydantic import BaseModel, ConfigDict
from app.schemas.user import UserSimple


class PostCreate(BaseModel):
    title: str
    content: str


class PostResponse(PostCreate):
    id: int
    user: UserSimple

    model_config = ConfigDict(from_attributes=True)