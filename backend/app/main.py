from fastapi import FastAPI

from app.api.v1.routes import users, posts, comments
from app.db.base import Base
from app.db.session import engine
from app.models import user, post,comment

Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="MEBIDAI API",
    version="1.0.0"
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