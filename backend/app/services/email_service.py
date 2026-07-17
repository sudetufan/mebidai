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


async def send_verification_email(email: str, token: str):

    verify_link = (
        f"http://localhost:3000/verify-email?token={token}"
    )

    msg = MIMEMultipart("alternative")

    msg["Subject"] = "MEBIDAI Email Doğrulama"
    msg["From"] = SMTP_FROM
    msg["To"] = email


    html = f"""
    <html>
        <body>
            <h2>MEBIDAI'ye Hoş Geldin </h2>

            <p>Hesabını doğrulamak için aşağıdaki linke tıkla:</p>

            <a href="{verify_link}">
                Email Doğrula
            </a>

            <br><br>

            <p>MEBIDAI Ekibi</p>
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


    print("Mail gönderildi:", email)