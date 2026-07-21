import os
import smtplib

from dotenv import load_dotenv
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart


load_dotenv()


SMTP_HOST = os.getenv("SMTP_HOST")
SMTP_PORT = int(os.getenv("SMTP_PORT"))
SMTP_USERNAME = os.getenv("SMTP_USERNAME")
SMTP_PASSWORD = os.getenv("SMTP_PASSWORD")
SMTP_FROM = os.getenv("SMTP_FROM")
FRONTEND_URL = os.getenv("FRONTEND_URL")


async def send_verification_email(email: str, token: str):

    verify_link = (
        f"{FRONTEND_URL}/verify-email?token={token}"
    )

    msg = MIMEMultipart("alternative")

    msg["Subject"] = "MEBIDAI Email Verification"
    msg["From"] = SMTP_FROM
    msg["To"] = email


    html = f"""
    <html>
        <body>
            <h2>Welcome to MEBIDAI</h2>

            <p>Please click the link below to verify your email address:</p>

            <a href="{verify_link}">
                Verify Email
            </a>

            <br><br>

            <p>Best regards,<br>MEBIDAI Team</p>
        </body>
    </html>
    """


    msg.attach(
        MIMEText(html, "html")
    )


    with smtplib.SMTP(SMTP_HOST, SMTP_PORT) as server:

        server.starttls()

        server.login(
            SMTP_USERNAME,
            SMTP_PASSWORD
        )

        server.send_message(msg)


    print("Verification email sent to:", email)
    
async def send_password_reset_email(email: str, token: str):

    reset_link = (
        f"{FRONTEND_URL}/reset-password?token={token}"
    )

    msg = MIMEMultipart("alternative")

    msg["Subject"] = "MEBIDAI Password Reset"
    msg["From"] = SMTP_FROM
    msg["To"] = email

    html = f"""
    <html>
        <body>
            <h2>Password Reset</h2>

            <p>We received a request to reset your password.</p>

            <p>Click the button below to create a new password:</p>

            <a href="{reset_link}">
                Reset Password
            </a>

            <br><br>

            <p>This link will expire in <strong>1 hour</strong>.</p>

            <p>If you didn't request a password reset, you can safely ignore this email.</p>

            <br>

            <p>Best regards,<br>MEBIDAI Team</p>
        </body>
    </html>
    """

    msg.attach(
        MIMEText(html, "html")
    )

    with smtplib.SMTP(SMTP_HOST, SMTP_PORT) as server:
        server.starttls()
        server.login(
            SMTP_USERNAME,
            SMTP_PASSWORD,
        )

        server.send_message(msg)

    print("Password reset email sent to:", email)