from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session
from pydantic import BaseModel
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

@router.post("/tickets")
def create(ticket: TicketRequest, session: Session = Depends(get_session)):
    # Generate solution using RAG
    query = f"{ticket.subject} {ticket.description}"
    solution = generate_answer(query)
    
    # Check if we have a valid solution
    no_solution_messages = [
        "I apologize, but I don't have any documented solutions",
        "I apologize, but I don't have any documentation",
        "I don't have documented solutions",
        "Please contact IT support"
    ]
    
    if any(msg.lower() in solution.lower() for msg in no_solution_messages):
        # Return early without creating ticket
        return {
            "ticket": None,
            "solution": solution,
            "has_solution": False
        }
    
    # Create ticket only if we have a valid solution
    new_ticket = create_ticket(
        session=session,
        email=ticket.email,
        subject=ticket.subject,
        description=ticket.description,
        priority=ticket.priority,
        solution=solution
    )
    
    return {
        "ticket": new_ticket,
        "solution": solution,
        "has_solution": True
    }

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

        # Handle assignment for pending tickets
        assigned_to = None
        if status_update.status == "pending":
            # Predict category based on ticket info
            category = predict_ticket_category(ticket.subject, ticket.description, ticket.priority)
            
            # Map categories to assignees
            assignees = {
                "software": "software.team@company.com",
                "hardware": "hardware.team@company.com",
                "network": "network.team@company.com",
                "security": "security.team@company.com",
                "other": "support.team@company.com"
            }
            assigned_to = assignees.get(category.lower(), "support.team@company.com")
        
        # Update ticket status
        updated_ticket = update_ticket_status(
            session=session,
            ticket_id=ticket_id,
            new_status=status_update.status,
            solution=status_update.solution if status_update.status == "resolved" else None,
            assigned_to=assigned_to
        )
        
        return {"success": True, "ticket": updated_ticket}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
