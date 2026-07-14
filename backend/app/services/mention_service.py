import re

from sqlalchemy.orm import Session

from app.models.user import User
from app.services.notification_service import create_notification


def process_mentions(
    db: Session,
    content: str,
    sender_id: int,
    post_id: int,
    comment_id: int,
):
    usernames = set(
        re.findall(r"@([A-Za-zA-Z0-9_]+)", content)
    )

    for username in usernames:

        user = (
            db.query(User)
            .filter(User.username == username)
            .first()
        )

        if not user:
            continue

        if user.id == sender_id:
            continue

        create_notification(
            db,
            recipient_id=user.id,
            sender_id=sender_id,
            notification_type="mention",
            post_id=post_id,
            comment_id=comment_id,
        )