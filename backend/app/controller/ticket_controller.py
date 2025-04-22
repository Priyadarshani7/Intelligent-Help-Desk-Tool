from fastapi import APIRouter, Depends
from sqlmodel import Session
from pydantic import BaseModel
from app.db.db_service.ticket_database import get_session
from app.services.ticket_service import create_ticket, get_all_tickets

router = APIRouter()

class TicketRequest(BaseModel):
    email: str
    subject: str
    description: str
    priority: str

@router.post("/tickets")
def create(ticket: TicketRequest, session: Session = Depends(get_session)):
    return create_ticket(session, ticket.email, ticket.subject, ticket.description, ticket.priority)

@router.get("/tickets")
def read_all(session: Session = Depends(get_session)):
    return get_all_tickets(session)
