from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.api.dependencies import get_db
from app.schemas.user import UserCreate, UserLogin, Token
from app.services.user_service import create_user, login_user

router = APIRouter(prefix="/users", tags=["Users"])


@router.post("/register")
def register(user: UserCreate, db: Session = Depends(get_db)):
    return create_user(db, user)


@router.post("/login", response_model=Token)
def login(user: UserLogin, db: Session = Depends(get_db)):
    access_token = login_user(db, user.email, user.password)

    return {
        "access_token": access_token,
        "token_type": "bearer"
    }