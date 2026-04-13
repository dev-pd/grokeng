from datetime import datetime
from typing import List, Optional, Literal

from pydantic import BaseModel, ConfigDict
from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey
from sqlalchemy.sql import func
from app.core.database import Base


# SQLAlchemy Model
class Message(Base):
    __tablename__ = "messages"

    id = Column(Integer, primary_key=True, index=True)
    lead_id = Column(Integer, ForeignKey("leads.id"), nullable=False)
    message_type = Column(String, nullable=False)  # email, linkedin, call, meeting
    subject = Column(String, nullable=True)
    content = Column(String, nullable=False)
    sent_at = Column(DateTime, nullable=True)
    response_received = Column(Boolean, default=False)
    response_content = Column(String, nullable=True)
    response_at = Column(DateTime, nullable=True)
    grok_generated = Column(Boolean, default=False)
    template_used = Column(String, nullable=True)
    created_at = Column(DateTime, default=func.now())
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now())


# Pydantic Models
class MessageCreate(BaseModel):
    lead_id: int
    message_type: Literal["email", "linkedin", "call", "meeting"]
    subject: Optional[str] = None
    content: str
    sent_at: Optional[datetime] = None
    response_received: bool = False
    response_content: Optional[str] = None
    response_at: Optional[datetime] = None
    grok_generated: bool = False
    template_used: Optional[str] = None


class MessageUpdate(BaseModel):
    lead_id: Optional[int] = None
    message_type: Optional[Literal["email", "linkedin", "call", "meeting"]] = None
    subject: Optional[str] = None
    content: Optional[str] = None
    sent_at: Optional[datetime] = None
    response_received: Optional[bool] = None
    response_content: Optional[str] = None
    response_at: Optional[datetime] = None
    grok_generated: Optional[bool] = None
    template_used: Optional[str] = None


class MessageResponse(BaseModel):
    id: int
    lead_id: int
    message_type: str
    subject: Optional[str]
    content: str
    sent_at: Optional[datetime]
    response_received: bool
    response_content: Optional[str]
    response_at: Optional[datetime]
    grok_generated: bool
    template_used: Optional[str]
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)


class MessageListResponse(BaseModel):
    messages: List[MessageResponse]
    total: int
    page: int
    per_page: int
    total_pages: int
