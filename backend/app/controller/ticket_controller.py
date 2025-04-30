from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session
from pydantic import BaseModel
from app.db.db_service.ticket_database import get_session
from app.services.ticket_service import create_ticket, get_all_tickets, update_ticket_status, get_ticket_by_id
from app.db.models.ticket_model import Ticket

router = APIRouter()

class TicketRequest(BaseModel):
    email: str
    subject: str
    description: str
    priority: str

class StatusUpdate(BaseModel):
    status: str

@router.post("/tickets")
def create(ticket: TicketRequest, session: Session = Depends(get_session)):
    new_ticket = create_ticket(session, ticket.email, ticket.subject, ticket.description, ticket.priority)
    # Return the full ticket object which includes ticket_id
    return new_ticket

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
        updated_ticket = update_ticket_status(session, ticket_id, status_update.status)
        if updated_ticket:
            return {"success": True, "ticket": updated_ticket}
        raise HTTPException(status_code=404, detail="Ticket not found")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
