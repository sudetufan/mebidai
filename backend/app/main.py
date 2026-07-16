from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.v1.routes import (
    users,
    posts,
    comments,
    admin,
    categories,
    notifications,
)

from app.db.base import Base
from app.db.session import engine
from app.seed import seed_categories

from app.models import (
    user,
    post,
    comment,
    like,
    category,
    follow,
    notification,
    email_verification,
)


Base.metadata.create_all(bind=engine)

seed_categories()


app = FastAPI(
    title="MEBIDAI API",
    version="1.0.0",
)


app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.include_router(users.router, prefix="/api/v1")
app.include_router(posts.router, prefix="/api/v1")
app.include_router(comments.router, prefix="/api/v1")
app.include_router(admin.router, prefix="/api/v1")
app.include_router(categories.router, prefix="/api/v1")


@app.get("/")
def root():
    return {
        "project": "MEBIDAI",
        "status": "running",
        "docs": "/docs",
    }
app.include_router(notifications.router, prefix="/api/v1")