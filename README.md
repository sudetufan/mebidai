# MEBIDAI

MEBIDAI is a developer community platform built with **FastAPI**, **Jinja2**, **HTML**, **CSS**, and **JavaScript**. It allows users to create, share, and interact with blog posts while providing authentication, notifications, and an administration panel.

## Features

### User Features

* User registration and login
* Google OAuth login
* Email verification
* Forgot password / Reset password
* Create, edit, and delete blog posts
* Like and comment on posts
* Follow and unfollow users
* User profile page
* User search
* Mention system (`@username`)
* Notification system
* Account settings

  * Change username
  * Change password

### Admin Features

* Admin dashboard
* User management
* Post management
* Comment management
* Category management
* Pagination support

### Other Features

* Responsive interface
* Custom 403, 404 and 500 error pages
* SQLite database
* Server-side rendering with Jinja2

---

# Technologies

### Backend

* FastAPI
* SQLAlchemy
* SQLite
* Jinja2
* Pydantic
* Uvicorn

### Frontend

* HTML5
* CSS3
* JavaScript

### Authentication

* JWT Authentication
* Google OAuth 2.0

### Email

* SMTP
* FastAPI-Mail

---

# Project Structure

```text
backend/
│
├── app/
│   ├── api/
│   ├── db/
│   ├── models/
│   ├── schemas/
│   ├── services/
│   ├── static/
│   ├── templates/
│   ├── security.py
│   └── main.py
│
├── requirements.txt
└── mebidai.db
```

---

# Installation

Clone the repository:

```bash
git clone <repository-url>
cd mebidai/backend
```

Create a virtual environment:

```bash
python -m venv .venv
```

Activate the virtual environment:

### Windows

```bash
.venv\Scripts\activate
```

### macOS / Linux

```bash
source .venv/bin/activate
```

Install dependencies:

```bash
pip install -r requirements.txt
```

Create a `.env` file and configure the required environment variables.

Run the project:

```bash
uvicorn app.main:app --reload
```

Open your browser:

```
http://127.0.0.1:8000
```

---

# Environment Variables

Example `.env`

```env
SECRET_KEY=your_secret_key

GOOGLE_CLIENT_ID=your_google_client_id

SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USERNAME=your_email
SMTP_PASSWORD=your_app_password
```

---

# Screenshots

You can add screenshots of:

* Home Page
* Login
* Register
* Blog
* Profile
* Admin Panel
* Settings
* Notifications

---

# Author

Developed as a Computer Engineering project using FastAPI and Jinja2.
