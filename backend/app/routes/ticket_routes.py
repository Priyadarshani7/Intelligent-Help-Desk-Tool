# from fastapi import APIRouter
# from typing import List
# from db.models.ticket_model import Ticket, TicketCreate
# from controller.ticket_controller import create_ticket, get_all_tickets

# router = APIRouter()

# @router.post("/", response_model=Ticket)
# def submit_ticket(ticket: TicketCreate):
#     return create_ticket(ticket)

# @router.get("/", response_model=List[Ticket])
# def fetch_tickets():
#     return get_all_tickets()


from fastapi import APIRouter
from app.controller import ticket_controller

router = APIRouter()
router.include_router(ticket_controller.router, prefix="/api")
