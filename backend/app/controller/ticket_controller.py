from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session
from pydantic import BaseModel
from app.services.email_service import send_email_to_support
from app.db.db_service.ticket_database import get_session
from app.services.ticket_service import create_ticket, get_all_tickets, update_ticket_status, get_ticket_by_id
from app.db.models.ticket_model import Ticket
from app.rag.answer_generation import generate_answer
from app.ml.model import predict_ticket_category
from typing import Optional
import re

router = APIRouter()

class TicketRequest(BaseModel):
    email: str
    subject: str
    description: str
    priority: str


class StatusUpdate(BaseModel):
    status: str
    solution: Optional[str] = None
    needs_help: Optional[bool] = False
    email: Optional[str] = None
    subject: Optional[str] = None
    description: Optional[str] = None
    priority: Optional[str] = None


@router.post("/tickets")
def create(ticket: TicketRequest, session: Session = Depends(get_session)):
    try:
        # Generate solution using RAG
        query = f"{ticket.subject} {ticket.description}"
        solution = generate_answer(query)
        
        # Create ticket with the solution
        new_ticket = create_ticket(
            session=session,
            email=ticket.email,
            subject=ticket.subject,
            description=ticket.description,
            priority=ticket.priority,
            solution=solution
        )
        
        return {
            "success": True,
            "ticket": {
                "ticket_id": new_ticket.ticket_id,
                "subject": new_ticket.subject,
                "status": new_ticket.status
            },
            "solution": solution,
            "has_solution": "I apologize" not in solution.lower()
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/tickets")
def read_all(session: Session = Depends(get_session)):
    return get_all_tickets(session)

@router.get("/tickets/{ticket_id}")
def get_ticket(ticket_id: str, session: Session = Depends(get_session)):
    ticket = get_ticket_by_id(session, ticket_id)
    if not ticket:
        raise HTTPException(status_code=404, detail="Ticket not found")
    return ticket



@router.put("/tickets/{ticket_id}/status")
def update_status(ticket_id: str, status_update: StatusUpdate, session: Session = Depends(get_session)):
    try:
        ticket = get_ticket_by_id(session, ticket_id)
        if not ticket:
            raise HTTPException(status_code=404, detail="Ticket not found")

        # ✅ Send email to support if needed
        if status_update.needs_help:
            email_sent = send_email_to_support(status_update)
            if not email_sent:
                raise HTTPException(status_code=500, detail="Failed to send support email")

        # ✅ Assign ticket if marked pending
        assigned_to = None
        if status_update.status == "pending":
            category = predict_ticket_category(ticket.subject, ticket.description, ticket.priority)
            assignees = {
                "software": "software.team@company.com",
                "hardware": "hardware.team@company.com",
                "network": "network.team@company.com",
                "security": "security.team@company.com",
                "other": "support.team@company.com"
            }
            assigned_to = assignees.get(category.lower(), "support.team@company.com")

        # ✅ Update ticket status
        updated_ticket = update_ticket_status(
            session=session,
            ticket_id=ticket_id,
            new_status=status_update.status,
            solution=status_update.solution if status_update.status == "resolved" else None,
            assigned_to=assigned_to
        )

        return {
            "success": True,
            "ticket": updated_ticket,
            "message": "Support team has been notified" if status_update.needs_help else "Ticket status updated"
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
