from fastapi import FastAPI
from app.api.v1.routes import health

app = FastAPI(title="MEBIDAI API")

app.include_router(health.router, prefix="/api/v1")
