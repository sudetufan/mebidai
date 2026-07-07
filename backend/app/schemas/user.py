from pydantic import BaseModel, EmailStr


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

    class Config:
        from_attributes = True


class UserProfile(BaseModel):
    id: int
    username: str
    email: EmailStr
    role: str

    post_count: int
    comment_count: int

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