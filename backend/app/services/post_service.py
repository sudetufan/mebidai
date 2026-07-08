from fastapi import HTTPException
from sqlalchemy import or_
from sqlalchemy.orm import Session, joinedload

from app.models.category import Category
from app.models.like import Like
from app.models.post import Post
from app.models.user import User
from app.schemas.post import PostCreate


def prepare_posts(
    posts: list[Post],
    db: Session,
    current_user: User | None,
):
    for post in posts:
        post.like_count = len(post.likes)

        if current_user:
            liked = (
                db.query(Like)
                .filter(
                    Like.post_id == post.id,
                    Like.user_id == current_user.id,
                )
                .first()
            )

            post.liked = liked is not None

        else:
            post.liked = False

    return posts


def create_post(
    db: Session,
    post: PostCreate,
    user_id: int,
) -> Post:

    new_post = Post(
        title=post.title,
        content=post.content,
        user_id=user_id,
        category_id=post.category_id,
    )

    db.add(new_post)
    db.commit()
    db.refresh(new_post)

    return new_post



def get_posts(
    db: Session,
    current_user: User | None,
    page: int,
    limit: int,
    category_id: int | None = None,
):

    skip = (page - 1) * limit

    total_query = db.query(Post)

    if category_id:
        total_query = total_query.filter(
            Post.category_id == category_id
        )

    total = total_query.count()


    query = (
        db.query(Post)
        .options(
            joinedload(Post.user),
            joinedload(Post.category),
        )
    )


    if category_id:
        query = query.filter(
            Post.category_id == category_id
        )


    posts = (
        query
        .order_by(Post.id.desc())
        .offset(skip)
        .limit(limit)
        .all()
    )


    posts = prepare_posts(
        posts,
        db,
        current_user,
    )


    return {
        "posts": posts,
        "total": total,
        "page": page,
        "limit": limit,
    }



def get_post(
    db: Session,
    post_id: int,
    current_user: User | None,
):

    post = (
        db.query(Post)
        .options(
            joinedload(Post.user),
            joinedload(Post.category),
        )
        .filter(Post.id == post_id)
        .first()
    )


    if not post:
        raise HTTPException(
            status_code=404,
            detail="Post not found",
        )


    post.like_count = len(post.likes)


    if current_user:

        liked = (
            db.query(Like)
            .filter(
                Like.post_id == post.id,
                Like.user_id == current_user.id,
            )
            .first()
        )

        post.liked = liked is not None

    else:
        post.liked = False


    return post



def update_post(
    db: Session,
    post_id: int,
    post: PostCreate,
    current_user: User,
):

    existing_post = (
        db.query(Post)
        .filter(Post.id == post_id)
        .first()
    )


    if not existing_post:
        raise HTTPException(
            status_code=404,
            detail="Post not found",
        )


    if (
        existing_post.user_id != current_user.id
        and current_user.role != "admin"
    ):
        raise HTTPException(
            status_code=403,
            detail="You cannot update this post",
        )


    existing_post.title = post.title
    existing_post.content = post.content
    existing_post.category_id = post.category_id


    db.commit()
    db.refresh(existing_post)


    return existing_post



def delete_post(
    db: Session,
    post_id: int,
    current_user: User,
):

    post = (
        db.query(Post)
        .filter(Post.id == post_id)
        .first()
    )


    if not post:
        raise HTTPException(
            status_code=404,
            detail="Post not found",
        )


    if (
        post.user_id != current_user.id
        and current_user.role != "admin"
    ):
        raise HTTPException(
            status_code=403,
            detail="You cannot delete this post",
        )


    db.delete(post)
    db.commit()


    return {
        "message": "Post deleted successfully"
    }



def get_user_posts(
    db: Session,
    user_id: int,
):

    posts = (
        db.query(Post)
        .options(
            joinedload(Post.user),
            joinedload(Post.category),
        )
        .filter(Post.user_id == user_id)
        .order_by(Post.id.desc())
        .all()
    )


    return prepare_posts(
        posts,
        db,
        None,
    )



def search_posts(
    db: Session,
    query: str,
    current_user: User | None,
):

    posts = (
        db.query(Post)
        .join(Category)
        .options(
            joinedload(Post.user),
            joinedload(Post.category),
        )
        .filter(
            or_(
                Post.title.ilike(f"%{query}%"),
                Post.content.ilike(f"%{query}%"),
                Category.name.ilike(f"%{query}%"),
            )
        )
        .order_by(Post.id.desc())
        .all()
    )


    return prepare_posts(
        posts,
        db,
        current_user,
    )