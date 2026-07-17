import smtplib
from email.message import EmailMessage

SMTP_USER = "mebidinfo@gmail.com"
APP_PASSWORD = "sieeuvjmasdwpofg"

msg = EmailMessage()
msg["Subject"] = "SMTP Test"
msg["From"] = SMTP_USER
msg["To"] = "s376287@gmail.com"
msg.set_content("Merhaba! SMTP testi başarılı.")

with smtplib.SMTP("smtp.gmail.com", 587) as smtp:
    smtp.ehlo()
    smtp.starttls()
    smtp.ehlo()
    smtp.login(SMTP_USER, APP_PASSWORD)
    smtp.send_message(msg)

print("Mail gönderildi.")