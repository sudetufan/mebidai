from fastapi import FastAPI

from app.api.v1.routes import (
    users,
    posts,
    comments,
    admin,
)
from app.db.base import Base
from app.db.session import engine
from app.models import user, post,comment
from fastapi.middleware.cors import CORSMiddleware

Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="MEBIDAI API",
    version="1.0.0"
)
allow_origins=[
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=allow_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(users.router, prefix="/api/v1")
app.include_router(posts.router, prefix="/api/v1")
app.include_router(comments.router, prefix="/api/v1")


@app.get("/")
def root():
    return {
        "project": "MEBIDAI",
        "status": "running",
        "docs": "/docs"
    }
app.include_router(admin.router, prefix="/api/v1")