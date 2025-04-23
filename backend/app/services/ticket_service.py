from datetime import datetime
from sqlmodel import Session, select
from app.db.models.ticket_model import Ticket
from app.ml.model import predict_ticket_category

def get_next_ticket_number(session: Session) -> int:
    # Get the current year
    current_year = datetime.utcnow().year
    
    # Find the last ticket for the current year
    result = session.exec(
        select(Ticket)
        .where(Ticket.ticket_id.like(f"TKT{current_year}-%"))
        .order_by(Ticket.ticket_id.desc())
        .limit(1)
    ).first()
    
    if result:
        # Extract the number from the last ticket ID and increment
        last_number = int(result.ticket_id.split("-")[-1])
        return last_number + 1
    else:
        # If no tickets exist for this year, start with 1
        return 1

def create_ticket(session: Session, email: str, subject: str, description: str, priority: str) -> Ticket:
    # Generate the next ticket number
    next_number = get_next_ticket_number(session)
    current_year = datetime.utcnow().year
    
    # Format the ticket ID (e.g., TKT2025-0001)
    ticket_id = f"TKT{current_year}-{next_number:04d}"
    
    predicted_category = predict_ticket_category(subject, description, priority)
    
    ticket = Ticket(
        ticket_id=ticket_id,
        email=email,
        subject=subject,
        description=description,
        priority=priority,
        category=predicted_category,
        created_at=datetime.utcnow(),
        created_by=email,
        updated_by=email,
        updated_at=datetime.utcnow(),
    )

    session.add(ticket)
    session.commit()
    session.refresh(ticket)
    return ticket

def get_all_tickets(session: Session):
    return session.exec(
        select(Ticket).order_by(Ticket.created_at.desc())
    ).all()