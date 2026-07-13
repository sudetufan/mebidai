from sqlalchemy.orm import Session
from app.models.user import User

from app.models.notification import Notification


def create_notification(
    db: Session,
    recipient_id: int,
    sender_id: int,
    notification_type: str,
):
    notification = Notification(
        recipient_id=recipient_id,
        sender_id=sender_id,
        type=notification_type,
    )

    db.add(notification)
    db.commit()
    db.refresh(notification)

    return notification
def get_notifications(
    db: Session,
    user_id: int,
):
    notifications = (
        db.query(Notification)
        .filter(Notification.recipient_id == user_id)
        .order_by(Notification.created_at.desc())
        .all()
    )

    result = []

    for notification in notifications:
        sender = (
            db.query(User)
            .filter(User.id == notification.sender_id)
            .first()
        )

        result.append(
            {
                "id": notification.id,
                "type": notification.type,
                "sender_id": sender.id,
                "sender_username": sender.username,
                "is_read": notification.is_read,
                "created_at": notification.created_at,
            }
        )

    return result

def mark_notification_as_read(
    db: Session,
    notification_id: int,
    user_id: int,
):
    notification = (
        db.query(Notification)
        .filter(
            Notification.id == notification_id,
            Notification.recipient_id == user_id,
        )
        .first()
    )

    if not notification:
        return None

    notification.is_read = True

    db.commit()
    db.refresh(notification)

    return notification