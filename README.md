# MEBIDAI Community Platform

MEBIDAI is a developer community platform where users can share technical content, interact with other developers, and build their own developer profiles.

The platform allows users to create blog posts, discover content, interact through comments and likes, follow other users, and receive notifications.

## Features

### User Management

- User registration and login
- Email verification system
- Google OAuth authentication
- Forgot password and password reset system
- User profile pages
- Profile statistics
- Secure password hashing

### Blog System

- Create, edit, and delete blog posts
- Category-based content organization
- Post search functionality
- Pagination support
- Post detail pages
- Like system
- Comment system

### Social Features

- Follow and unfollow users
- User interaction notifications
- Mention system in comments
- Notification dropdown
- User discovery and search

### Admin Panel

- Admin authentication and authorization
- User management
- Post management
- Comment management
- Category management
- Search functionality
- Pagination support
- Delete operations with confirmation modals


# Tech Stack

## Frontend

- Next.js 16
- React
- TypeScript
- Tailwind CSS
- Sonner Toast Notifications
- Lucide React Icons

## Backend

- FastAPI
- SQLAlchemy
- SQLite Database
- Pydantic
- JWT Authentication
- Google OAuth Verification
- SMTP Email Service


# Project Structure

```text
MEBIDAI
│
├── backend
│   ├── app
│   │   ├── api
│   │   ├── models
│   │   ├── schemas
│   │   ├── services
│   │   ├── database
│   │   └── main.py
│   │
│   └── requirements.txt
│
├── frontend
│   ├── app
│   ├── components
│   ├── context
│   ├── lib
│   ├── types
│   └── package.json
│
└── README.md
```


# Installation

## Backend Setup

Navigate to the backend directory:

```bash
cd backend
```

Create a virtual environment:

```bash
python -m venv .venv
```

Activate the virtual environment:

Mac/Linux:

```bash
source .venv/bin/activate
```

Install dependencies:

```bash
pip install -r requirements.txt
```

Run the backend server:

```bash
uvicorn app.main:app --reload
```

Backend will run on:

```
http://localhost:8000
```


## Frontend Setup

Open another terminal and navigate to the frontend directory:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Run the development server:

```bash
npm run dev
```

Frontend will run on:

```
http://localhost:3000
```


# Environment Variables

## Frontend

Create a `.env.local` file:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1
```

## Backend

Required environment variables:

```env
DATABASE_URL
SECRET_KEY
GOOGLE_CLIENT_ID
SMTP_HOST
SMTP_PORT
SMTP_EMAIL
SMTP_PASSWORD
```


# Authentication System

MEBIDAI provides multiple authentication methods:

- Email and password authentication
- Email verification system
- Google OAuth login
- Password reset via email link

The authentication system uses secure password hashing and token-based verification flows.


# Database Models

Main database entities:

- User
- Post
- Comment
- Category
- Like
- Follow
- Notification
- EmailVerificationToken
- PasswordResetToken


# Development Tools

- Visual Studio Code
- Git
- GitHub
- Postman
- Chrome Developer Tools


# Future Improvements

Planned future improvements:

- Premium membership system
- Educational package integration
- AI assistant integration
- Mobile application development


# Deployment

The project is structured as a full-stack application with a separate frontend and backend architecture.

## Frontend

Next.js application

## Backend

FastAPI REST API

## Database

SQLAlchemy based database layer


# Author

Sude Tufan