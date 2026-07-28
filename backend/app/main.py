import re
from markupsafe import escape, Markup

from fastapi import FastAPI, Request, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.templating import Jinja2Templates
from fastapi.staticfiles import StaticFiles
from fastapi.responses import HTMLResponse, JSONResponse
from starlette.exceptions import HTTPException as StarletteHTTPException

from app.api.v1.routes import (
    users,
    posts,
    comments,
    admin,
    categories,
    notifications,
    pages,
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
    password_reset,
)


Base.metadata.create_all(bind=engine)

seed_categories()


app = FastAPI(
    title="MEBIDAI API",
    version="1.0.0",
)


templates = Jinja2Templates(
    directory="app/templates"
)


def mention_links(text):
    if not text:
        return ""

    escaped_text = str(escape(text))

    processed_text = re.sub(
        r"@([a-zA-Z0-9_]+)",
        r'<a href="/users/\1">@\1</a>',
        escaped_text
    )

    return Markup(processed_text)


templates.env.filters["mention_links"] = mention_links


app.mount(
    "/static",
    StaticFiles(directory="app/static"),
    name="static"
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


app.include_router(
    pages.router
)

app.include_router(
    users.router,
    prefix="/api/v1"
)

app.include_router(
    posts.router,
    prefix="/api/v1"
)

app.include_router(
    comments.router,
    prefix="/api/v1"
)

app.include_router(
    admin.router,
    prefix="/api/v1"
)

app.include_router(
    categories.router,
    prefix="/api/v1"
)

app.include_router(
    notifications.router,
    prefix="/api/v1"
)


@app.exception_handler(StarletteHTTPException)
async def http_exception_handler(
    request: Request,
    exc: StarletteHTTPException,
):
    if request.url.path.startswith("/api/"):
        return JSONResponse(
            content={
                "detail": exc.detail
            },
            status_code=exc.status_code,
        )

    if exc.status_code == status.HTTP_404_NOT_FOUND:
        return templates.TemplateResponse(
            request,
            "errors/404.html",
            {
                "request": request
            },
            status_code=404,
        )

    if exc.status_code == status.HTTP_403_FORBIDDEN:
        return templates.TemplateResponse(
            request,
            "errors/403.html",
            {
                "request": request
            },
            status_code=403,
        )

    return HTMLResponse(
        content=exc.detail,
        status_code=exc.status_code,
    )


@app.exception_handler(Exception)
async def internal_server_error(
    request: Request,
    exc: Exception,
):
    if request.url.path.startswith("/api/"):
        return JSONResponse(
            content={
                "detail": "Internal server error"
            },
            status_code=500,
        )

    return templates.TemplateResponse(
        request,
        "errors/500.html",
        {
            "request": request
        },
        status_code=500,
    )