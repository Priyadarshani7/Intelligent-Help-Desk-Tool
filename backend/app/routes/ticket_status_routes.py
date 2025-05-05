# from fastapi import APIRouter, HTTPException
# from pydantic import BaseModel
# from app.services.email_service import send_email_to_support
# from typing import Optional

# status_router = APIRouter(prefix="/api")

# class TicketStatusUpdate(BaseModel):
#     status: str
#     solution: Optional[str]
#     needs_help: bool
#     email: str
#     subject: str
#     description: str
#     priority: str

# @status_router.put("/tickets/{ticket_id}/status")
# async def update_ticket_status(ticket_id: str, update: TicketStatusUpdate):
#     try:
#         if update.needs_help:
#             email_sent = send_email_to_support(update)
#             if not email_sent:
#                 raise HTTPException(status_code=500, detail="Failed to send support email")
        
#         return {
#             "success": True,
#             "message": "Support team has been notified" if update.needs_help else "Ticket resolved"
#         }
#     except Exception as e:
#         raise HTTPException(status_code=500, detail=str(e))
