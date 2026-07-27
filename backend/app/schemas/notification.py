from datetime import datetime
from pydantic import BaseModel, ConfigDict


class NotificationResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    type: str
    sender_id: int
    sender_username: str
    post_id: int | None = None
    is_read: bool
    created_at: datetime