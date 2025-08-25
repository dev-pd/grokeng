# backend/app/models/lead.py
from sqlalchemy import Column, Integer, String, Text, DECIMAL, TIMESTAMP, Boolean, Index
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.core.database import Base
from pydantic import BaseModel, EmailStr, validator
from typing import Optional, List
from datetime import datetime
from decimal import Decimal


class Lead(Base):
    __tablename__ = "leads"

    id = Column(Integer, primary_key=True, autoincrement=True)
    first_name = Column(String(100), nullable=False)
    last_name = Column(String(100), nullable=False)
    email = Column(String(255), nullable=False, unique=True, index=True)
    company = Column(String(255), index=True)
    title = Column(String(150))
    phone = Column(String(20))
    industry = Column(String(100))
    company_size = Column(String(50))
    budget_range = Column(String(50))
    status = Column(String(50), default="New Lead", index=True)
    score = Column(DECIMAL(5, 2), default=0.00, index=True)
    lead_source = Column(String(100))
    notes = Column(Text)
    linkedin_url = Column(String(500))
    website = Column(String(500))
    created_at = Column(TIMESTAMP, server_default=func.now(), index=True)
    updated_at = Column(
        TIMESTAMP, server_default=func.now(), onupdate=func.now())

    @property
    def full_name(self) -> str:
        return f"{self.first_name} {self.last_name}"

    def __repr__(self):
        return f"<Lead(id={self.id}, name='{self.full_name}', email='{self.email}', status='{self.status}')>"

# Pydantic models for API serialization


class LeadBase(BaseModel):
    first_name: str
    last_name: str
    email: EmailStr
    company: Optional[str] = None
    title: Optional[str] = None
    phone: Optional[str] = None
    industry: Optional[str] = None
    company_size: Optional[str] = None
    budget_range: Optional[str] = None
    lead_source: Optional[str] = None
    notes: Optional[str] = None
    linkedin_url: Optional[str] = None
    website: Optional[str] = None


class LeadCreate(LeadBase):
    @validator('email')
    def validate_email(cls, v):
        if not v or '@' not in v:
            raise ValueError('Valid email is required')
        return v.lower()


class LeadUpdate(BaseModel):
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    email: Optional[EmailStr] = None
    company: Optional[str] = None
    title: Optional[str] = None
    phone: Optional[str] = None
    industry: Optional[str] = None
    company_size: Optional[str] = None
    budget_range: Optional[str] = None
    status: Optional[str] = None
    lead_source: Optional[str] = None
    notes: Optional[str] = None
    linkedin_url: Optional[str] = None
    website: Optional[str] = None
    score: Optional[float] = None


class LeadResponse(LeadBase):
    id: int
    status: str
    score: Decimal
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class LeadListResponse(BaseModel):
    leads: List[LeadResponse]
    total: int
    page: int
    per_page: int
    total_pages: int
