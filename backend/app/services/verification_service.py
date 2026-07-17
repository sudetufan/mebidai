from datetime import datetime, timedelta
import secrets

from sqlalchemy.orm import Session

from app.models.email_verification import EmailVerificationToken
from fastapi import HTTPException

from app.models.user import User

def create_verification_token(
    db: Session,
    user_id: int,
) -> EmailVerificationToken:

    token = secrets.token_urlsafe(32)

    verification = EmailVerificationToken(
        user_id=user_id,
        token=token,
        expires_at=datetime.utcnow() + timedelta(hours=24),
        used=False,
    )

    db.add(verification)
    db.commit()
    db.refresh(verification)

    return verification

def verify_email_token(
    db: Session,
    token: str,
):
    verification = (
        db.query(EmailVerificationToken)
        .filter(
            EmailVerificationToken.token == token,
        )
        .first()
    )

    if not verification:
        raise HTTPException(
            status_code=404,
            detail="Invalid verification token",
        )

    if verification.used:
        raise HTTPException(
            status_code=400,
            detail="This verification link has already been used.",
        )

    if verification.expires_at < datetime.utcnow():
        raise HTTPException(
            status_code=400,
            detail="Verification link has expired.",
        )

    user = (
        db.query(User)
        .filter(User.id == verification.user_id)
        .first()
    )

    if not user:
        raise HTTPException(
            status_code=404,
            detail="User not found",
        )

    print("Before:", user.is_verified)

    user.is_verified = True
    verification.used = True

    print("After set:", user.is_verified)

    db.commit()

    db.refresh(user)

    print("After commit:", user.is_verified)

    return {
        "message": "Email verified successfully."
    }