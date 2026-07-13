from sqlalchemy import (
    Boolean,
    Column,
    ForeignKey,
    Integer,
    String,
    DateTime,
)
from sqlalchemy.orm import relationship
from datetime import datetime

from app.db.base import Base


class Notification(Base):
    __tablename__ = "notifications"

    id = Column(Integer, primary_key=True, index=True)

    recipient_id = Column(
        Integer,
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False,
    )

    sender_id = Column(
        Integer,
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False,
    )

    type = Column(String, nullable=False)

    is_read = Column(
        Boolean,
        default=False,
    )
    created_at = Column(
        DateTime,
        default=datetime.utcnow,
    )
    recipient = relationship(
        "User",
        foreign_keys=[recipient_id],
        back_populates="notifications",
    )
    sender = relationship(
        "User",
        foreign_keys=[sender_id],
    )