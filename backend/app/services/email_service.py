from fastapi import FastAPI, Request, HTTPException
from pydantic import BaseModel
import smtplib
from email.mime.text import MIMEText
import os
from typing import Optional
import logging
from dotenv import load_dotenv  # Load environment variables

# Load .env file
load_dotenv()

# Configure logging
logging.basicConfig(level=logging.INFO)

# Initialize FastAPI app (only used if run via FastAPI server)
app = FastAPI()

# Ticket model
class Ticket(BaseModel):
    email: str
    subject: str
    description: str
    priority: str
    needs_help: bool = False

# Email sending logic
def send_email_to_support(ticket: Ticket):
    smtp_user = os.getenv("SMTP_USER")
    smtp_password = os.getenv("SMTP_PASSWORD")

    # Debug output
    print("SMTP_USER:", smtp_user)
    print("SMTP_PASSWORD:", "****" if smtp_password else None)

    if not smtp_user or not smtp_password:
        print("Fail")  # .env values not loaded
        logging.error("SMTP credentials not configured")
        return False

    try:
        with smtplib.SMTP("smtp.gmail.com", 587) as server:
            server.set_debuglevel(1)
            server.starttls()
            server.login(smtp_user, smtp_password)
            print("Success")  # Credentials correct

            body = f"""
Support Ticket Alert:
---------------------
Status: PENDING - Additional Help Needed
From: {ticket.email}
Subject: {ticket.subject}
Priority: {ticket.priority}

Description:
{ticket.description}

Action Required: User has requested additional assistance.
Please respond to this ticket as soon as possible.
            """

            msg = MIMEText(body)
            msg["Subject"] = f"[HELP NEEDED] {ticket.subject}"
            msg["From"] = smtp_user
            msg["To"] = "dhanesh.salunkhe@jadeglobal.com"
            msg["Reply-To"] = ticket.email

            server.send_message(msg)
            logging.info(f"Successfully sent email for ticket from {ticket.email}")
            return True

    except smtplib.SMTPAuthenticationError as auth_error:
        print("Fail")  # Login failed
        logging.error(f"SMTP Authentication failed: {auth_error}")
        raise HTTPException(status_code=500, detail="Email authentication failed")

    except Exception as e:
        print("Fail")  # Other SMTP error
        logging.error(f"Failed to send email: {str(e)}")
        return False

# API route: create ticket
@app.post("/api/tickets")
async def create_ticket(ticket: Ticket):
    try:
        ticket_status = "pending" if ticket.needs_help else "open"

        if ticket_status == "pending":
            email_sent = send_email_to_support(ticket)
            if not email_sent:
                raise HTTPException(
                    status_code=500,
                    detail="Failed to send notification email to support team"
                )

        return {
            "success": True,
            "ticket": {"ticket_id": "TICK123"},
            "has_solution": False,
            "solution": None
        }
    except Exception as e:
        logging.error(f"Error creating ticket: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail="Failed to create ticket. Please try again later."
        )

# API route: request help on existing ticket
@app.post("/api/tickets/{ticket_id}/need-help")
async def request_help(ticket_id: str, ticket: Ticket):
    try:
        logging.info(f"Processing help request for ticket {ticket_id}")
        ticket.needs_help = True

        email_sent = send_email_to_support(ticket)
        if not email_sent:
            raise HTTPException(status_code=500, detail="Failed to send email to support team")

        return {
            "success": True,
            "message": "Support team has been notified",
            "ticket_id": ticket_id
        }
    except Exception as e:
        logging.error(f"Error processing help request: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=str(e)
        )

# ✅ This block runs if script is executed directly
if __name__ == "__main__":
    try:
        test_ticket = Ticket(
            email="testuser@example.com",
            subject="Test Subject",
            description="Testing SMTP credentials via CLI",
            priority="High",
            needs_help=True
        )
        send_email_to_support(test_ticket)
    except Exception as e:
        print("Exception while testing:", e)
