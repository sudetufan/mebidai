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
    post_id = Column(
        Integer,
        ForeignKey("posts.id", ondelete="CASCADE"),
        nullable=True,
    )
    comment_id = Column(
        Integer,
        ForeignKey("comments.id", ondelete="CASCADE"),
        nullable=True,
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
    post = relationship(
        "Post",
    )
    comment = relationship(
        "Comment",
    )