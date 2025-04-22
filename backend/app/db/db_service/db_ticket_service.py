# from sqlmodel import select
# from db.db_service.session import get_session
# from db.models.ticket_model import Ticket, TicketCreate
# from services.ticket_service import predict_category
# from datetime import datetime

# def create_ticket(ticket_data: TicketCreate):
#     try:
#         with get_session() as session:
#             category = predict_category(ticket_data.subject, ticket_data.description, ticket_data.priority)
#             new_ticket = Ticket(
#                 email=ticket_data.email,
#                 subject=ticket_data.subject,
#                 description=ticket_data.description,
#                 priority=ticket_data.priority,
#                 category=category,
#                 status="pending",
#                 created_at=datetime.utcnow()
#             )
#             session.add(new_ticket)
#             session.commit()
#             session.refresh(new_ticket)
#             return new_ticket
#     except Exception as e:
#         session.rollback()
#         return None

# def get_all_tickets():
#     with get_session() as session:
#         return session.exec(select(Ticket)).all()
