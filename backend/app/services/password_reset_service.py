from datetime import datetime, timedelta
import secrets

from fastapi import HTTPException
from sqlalchemy.orm import Session

from app.models.password_reset import PasswordResetToken
from app.models.user import User
from app.security import hash_password


def create_reset_token(
    db: Session,
    email: str,
) -> PasswordResetToken:

    user = (
        db.query(User)
        .filter(User.email == email)
        .first()
    )

    if not user:
        raise HTTPException(
            status_code=404,
            detail="User not found",
        )

    token = secrets.token_urlsafe(32)

    reset = PasswordResetToken(
        user_id=user.id,
        token=token,
        expires_at=datetime.utcnow() + timedelta(hours=1),
        used=False,
    )

    db.add(reset)
    db.commit()
    db.refresh(reset)

    return reset


def verify_reset_token(
    db: Session,
    token: str,
) -> PasswordResetToken:

    reset = (
        db.query(PasswordResetToken)
        .filter(PasswordResetToken.token == token)
        .first()
    )

    if not reset:
        raise HTTPException(
            status_code=404,
            detail="Invalid token",
        )

    if reset.used:
        raise HTTPException(
            status_code=400,
            detail="Token already used",
        )

    if reset.expires_at < datetime.utcnow():
        raise HTTPException(
            status_code=400,
            detail="Token expired",
        )

    return reset


def reset_password(
    db: Session,
    token: str,
    new_password: str,
):

    reset = verify_reset_token(
        db,
        token,
    )

    user = (
        db.query(User)
        .filter(User.id == reset.user_id)
        .first()
    )

    user.hashed_password = hash_password(
        new_password
    )

    reset.used = True

    db.commit()

    return {
        "message": "Password reset successfully."
    }