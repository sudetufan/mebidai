from pydantic import BaseModel


class CommentCreate(BaseModel):
    content: str
    post_id: int


class CommentResponse(CommentCreate):
    id: int

    class Config:
        from_attributes = True