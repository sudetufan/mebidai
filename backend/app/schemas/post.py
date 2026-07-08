from pydantic import BaseModel, ConfigDict

from app.schemas.user import UserSimple


class PostCreate(BaseModel):
    title: str
    content: str
    category_id: int


class CategorySimple(BaseModel):
    id: int
    name: str

    model_config = ConfigDict(
        from_attributes=True
    )


class PostResponse(PostCreate):
    id: int
    user: UserSimple
    category: CategorySimple

    like_count: int = 0
    liked: bool = False

    model_config = ConfigDict(
        from_attributes=True
    )


class PaginatedPostsResponse(BaseModel):
    posts: list[PostResponse]
    total: int
    page: int
    limit: int