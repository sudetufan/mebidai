from datetime import datetime
from pydantic import BaseModel

class NotificationResponse(BaseModel):
    id: int
    type: str
    sender_id: int
    sender_username: str
    post_id: int | None
    is_read: bool
    created_at: datetime

    class Config:
        from_attributes = True