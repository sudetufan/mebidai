from fastapi import FastAPI

from app.api.v1.routes import users
from app.db.base import Base
from app.db.session import engine
from app.models.user import User
app = FastAPI(
    title="MEBIDAI API",
    version="1.0.0"
)

app.include_router(users.router, prefix="/api/v1")
app.include_router(users.router, prefix="/api/v1")

Base.metadata.create_all(bind=engine)

@app.get("/")
def root():
    return {
        "project": "MEBIDAI",
        "version": "1.0.0",
        "status": "running",
        "docs": "/docs"
    }