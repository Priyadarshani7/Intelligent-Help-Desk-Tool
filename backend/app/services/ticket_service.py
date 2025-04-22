from datetime import datetime
from sqlmodel import Session, select
from app.db.models.ticket_model import Ticket
from app.ml.model import predict_ticket_category

def create_ticket(session: Session,email:str, subject: str, description: str, priority: str) -> Ticket:
    predicted_category = predict_ticket_category(subject,description,priority)
    ticket = Ticket(
        email=email,
        subject=subject,
        description=description,
        priority=priority,
        category=predicted_category,
        created_at=datetime.utcnow() , # Assuming you want to set the created_at field
        created_by=email,  # Assuming you want to set the created_by field to the email
        updated_by=email,
        updated_at=datetime.utcnow(), # Assuming you want to set the updated_at field to the current time
    )
    session.add(ticket)
    session.commit()
    session.refresh(ticket)
    return ticket

def get_all_tickets(session: Session):
    return session.exec(select(Ticket)).all()
