# MEBIDAI Community Blog

A simple full-stack blog application built with **FastAPI (backend)** and **Next.js (frontend)**.

Users can register, login, create posts, and comment on posts.

---

##  Tech Stack

### Backend
- FastAPI
- SQLAlchemy
- SQLite (or your DB)
- JWT Authentication

### Frontend
- Next.js (App Router)
- React
- Tailwind CSS

---

## ✨ Features

- User registration & login
- Create, read posts
- View post details
- Add comments to posts
- Simple and clean UI

---

## 📁 Project Structure
backend/ # FastAPI backend
frontend/ # Next.js frontend

---

## ⚙️ Backend Setup

```bash
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload

Backend runs on:

http://127.0.0.1:8000

API docs:

http://127.0.0.1:8000/docs

💻 Frontend Setup
cd frontend
npm install
npm run dev

Frontend runs on:

http://localhost:3000
🔗 API Endpoints
Auth
POST /api/v1/users/register
POST /api/v1/users/login
Posts
GET /api/v1/posts
POST /api/v1/posts
GET /api/v1/posts/{id}
Comments
GET /api/v1/comments?post_id=ID
POST /api/v1/comments
📌 Notes
This is a learning project.
No advanced role system or categories included.
Focus is on basic full-stack CRUD workflow.
👨‍💻 Author

Built as a full-stack learning project with FastAPI + Next.js