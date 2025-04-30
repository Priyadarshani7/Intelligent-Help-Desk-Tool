from sqlmodel import SQLModel, Field
from typing import Optional
from datetime import datetime
from sqlalchemy import Text

class Ticket(SQLModel, table=True):
    id: Optional[int] = Field(default=None)  # Auto-incrementing internal ID
    ticket_id: str = Field(primary_key=True)
    active: Optional[bool] = Field(default=True, nullable=True, index=True)
    created_at: Optional[datetime] = Field(default=None, nullable=True, index=True)
    created_by: Optional[str] = Field(default=None, nullable=True, index=True)
    updated_by: Optional[str] = Field(default=None, nullable=True, index=True)
    updated_at: Optional[datetime] = Field(default=None, nullable=True, index=True)
    email: str
    subject: str
    description: str = Field(sa_type=Text)  # Using TEXT for longer descriptions
    category: Optional[str] = None 
    priority: str
    status: Optional[str] = "pending"
    solution: Optional[str] = Field(default=None, sa_type=Text)  # Using TEXT for longer solutions
    assigned_to: Optional[str] = None

class TicketCreate(SQLModel):
    email: str
    subject: str
    description: str
    priority: str
    created_at: Optional[datetime] = Field(default_factory=datetime.utcnow)
    created_by: Optional[str] = None
    updated_by: Optional[str] = None
    updated_at: Optional[datetime] = Field(default_factory=datetime.utcnow)
    solution: Optional[str] = None  # New field for RAG solution
    assigned_to: Optional[str] = None  # New field for ticket assignment

