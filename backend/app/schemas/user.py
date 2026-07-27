from pydantic import BaseModel, EmailStr
from app.models.follow import Follow

class UserCreate(BaseModel):
    username: str
    email: EmailStr
    password: str


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class UserMini(BaseModel):
    id: int
    username: str

    class Config:
        from_attributes = True


class UserResponse(BaseModel):
    id: int
    username: str
    email: EmailStr
    role: str
    bio: str | None = None

    class Config:
        from_attributes = True


class UserProfile(BaseModel):
    id: int
    username: str
    email: EmailStr
    role: str
    bio: str | None = None
    post_count: int
    comment_count: int
    like_count: int

    followers_count: int
    following_count: int

    is_following: bool

    class Config:
        from_attributes = True


class Token(BaseModel):
    access_token: str
    token_type: str


class UserSimple(BaseModel):
    id: int
    username: str

    class Config:
        from_attributes = True

class PasswordResetRequest(BaseModel):
    email: EmailStr


class PasswordResetConfirm(BaseModel):
    token: str
    new_password: str

class RegisterResponse(BaseModel):
    message: str
    user: UserResponse
class ChangePasswordRequest(BaseModel):
    current_password: str
    new_password: str
    confirm_password: str
class BioUpdate(BaseModel):
    bio: str