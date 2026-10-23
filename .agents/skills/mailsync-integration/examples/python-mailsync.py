"""
MailSync Client Helper for Python applications (FastAPI, Django, Flask, or scripts)

Requirements:
    pip install requests python-dotenv
"""

import os
import requests
from dotenv import load_dotenv

load_dotenv()

MAILSYNC_API_URL = os.getenv("MAILSYNC_API_URL", "https://mailsync-sigma.vercel.app")
MAILSYNC_ACCESS_KEY = os.getenv("MAILSYNC_ACCESS_KEY", None)


def send_mail(
    to: str,
    subject: str = "New Notification from MailSync",
    message: str = None,
    html: str = None,
    name: str = None,
    from_name: str = None,
) -> dict:
    """
    Sends an email using the hosted MailSync API instance.
    """
    if not to:
        raise ValueError("Recipient 'to' email address is required.")
    if not message and not html:
        raise ValueError("Either 'message' or 'html' must be provided.")

    endpoint = f"{MAILSYNC_API_URL.rstrip('/')}/mail"
    headers = {"Content-Type": "application/json"}
    if MAILSYNC_ACCESS_KEY:
        headers["x-access-key"] = MAILSYNC_ACCESS_KEY

    payload = {
        "email": to,
        "subject": subject,
        "name": name,
        "fromName": from_name,
    }
    if message:
        payload["message"] = message
    if html:
        payload["html"] = html

    response = requests.post(endpoint, json=payload, headers=headers, timeout=15)
    data = response.json()

    if not response.ok or not data.get("success"):
        error_msg = data.get("error") or data.get("details") or f"HTTP {response.status_code}"
        raise RuntimeError(f"MailSync Error: {error_msg}")

    return data


if __name__ == "__main__":
    res = send_mail(
        to="test@example.com",
        subject="Python MailSync Test",
        message="Hello from MailSync Python client!",
        from_name="Python App",
    )
    print("Result:", res)
