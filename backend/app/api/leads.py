# backend/app/api/leads.py
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, desc
from typing import List, Optional
from app.core.database import get_db_session
from app.models.lead import Lead, LeadCreate, LeadUpdate, LeadResponse, LeadListResponse
import logging

logger = logging.getLogger(__name__)
router = APIRouter()

@router.get("/", response_model=LeadListResponse)
async def get_leads(
    page: int = Query(1, ge=1, description="Page number"),
    per_page: int = Query(10, ge=1, le=100, description="Items per page"), 
    status: Optional[str] = Query(None, description="Filter by status"),
    industry: Optional[str] = Query(None, description="Filter by industry"),
    company_size: Optional[str] = Query(None, description="Filter by company size"),
    search: Optional[str] = Query(None, description="Search in name, email, or company"),
    db: AsyncSession = Depends(get_db_session)
):
    """Get all leads with pagination and filtering"""
    try:
        # Build query with filters
        query = select(Lead)
        
        if status:
            query = query.where(Lead.status == status)
        if industry:
            query = query.where(Lead.industry == industry)
        if company_size:
            query = query.where(Lead.company_size == company_size)
        if search:
            search_term = f"%{search}%"
            query = query.where(
                Lead.first_name.ilike(search_term) |
                Lead.last_name.ilike(search_term) |
                Lead.email.ilike(search_term) |
                Lead.company.ilike(search_term)
            )
        
        # Get total count
        count_query = select(func.count(Lead.id))
        if status:
            count_query = count_query.where(Lead.status == status)
        if industry:
            count_query = count_query.where(Lead.industry == industry)
        if company_size:
            count_query = count_query.where(Lead.company_size == company_size)
        if search:
            search_term = f"%{search}%"
            count_query = count_query.where(
                Lead.first_name.ilike(search_term) |
                Lead.last_name.ilike(search_term) |
                Lead.email.ilike(search_term) |
                Lead.company.ilike(search_term)
            )
        
        total_result = await db.execute(count_query)
        total = total_result.scalar()
        
        # Apply pagination and ordering
        offset = (page - 1) * per_page
        query = query.order_by(desc(Lead.created_at)).offset(offset).limit(per_page)
        
        # Execute query
        result = await db.execute(query)
        leads = result.scalars().all()
        
        total_pages = (total + per_page - 1) // per_page
        
        return LeadListResponse(
            leads=leads,
            total=total,
            page=page,
            per_page=per_page,
            total_pages=total_pages
        )
        
    except Exception as e:
        logger.error(f"Error fetching leads: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")

@router.post("/", response_model=LeadResponse, status_code=201)
async def create_lead(
    lead: LeadCreate,
    db: AsyncSession = Depends(get_db_session)
):
    """Create a new lead"""
    try:
        # Check if lead with email already exists
        existing_query = select(Lead).where(Lead.email == lead.email.lower())
        result = await db.execute(existing_query)
        existing_lead = result.scalar_one_or_none()
        
        if existing_lead:
            raise HTTPException(
                status_code=400, 
                detail=f"Lead with email {lead.email} already exists"
            )
        
        # Create new lead
        db_lead = Lead(**lead.model_dump())
        db.add(db_lead)
        await db.commit()
        await db.refresh(db_lead)
        
        logger.info(f"Created new lead: {db_lead.email}")
        return db_lead
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error creating lead: {e}")
        await db.rollback()
        raise HTTPException(status_code=500, detail="Internal server error")

@router.get("/{lead_id}", response_model=LeadResponse)
async def get_lead(
    lead_id: int,
    db: AsyncSession = Depends(get_db_session)
):
    """Get a specific lead by ID"""
    try:
        query = select(Lead).where(Lead.id == lead_id)
        result = await db.execute(query)
        lead = result.scalar_one_or_none()
        
        if not lead:
            raise HTTPException(status_code=404, detail="Lead not found")
        
        return lead
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error fetching lead {lead_id}: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")

@router.put("/{lead_id}", response_model=LeadResponse)
async def update_lead(
    lead_id: int,
    lead_update: LeadUpdate,
    db: AsyncSession = Depends(get_db_session)
):
    """Update a lead"""
    try:
        query = select(Lead).where(Lead.id == lead_id)
        result = await db.execute(query)
        db_lead = result.scalar_one_or_none()
        
        if not db_lead:
            raise HTTPException(status_code=404, detail="Lead not found")
        
        # Update fields
        update_data = lead_update.model_dump(exclude_unset=True)
        for field, value in update_data.items():
            setattr(db_lead, field, value)
        
        await db.commit()
        await db.refresh(db_lead)
        
        logger.info(f"Updated lead: {db_lead.email}")
        return db_lead
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error updating lead {lead_id}: {e}")
        await db.rollback()
        raise HTTPException(status_code=500, detail="Internal server error")

@router.delete("/{lead_id}")
async def delete_lead(
    lead_id: int,
    db: AsyncSession = Depends(get_db_session)
):
    """Delete a lead"""
    try:
        query = select(Lead).where(Lead.id == lead_id)
        result = await db.execute(query)
        db_lead = result.scalar_one_or_none()
        
        if not db_lead:
            raise HTTPException(status_code=404, detail="Lead not found")
        
        await db.delete(db_lead)
        await db.commit()
        
        logger.info(f"Deleted lead: {db_lead.email}")
        return {"message": "Lead deleted successfully"}
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error deleting lead {lead_id}: {e}")
        await db.rollback()
        raise HTTPException(status_code=500, detail="Internal server error")

@router.get("/stats/summary")
async def get_lead_stats(
    db: AsyncSession = Depends(get_db_session)
):
    """Get lead statistics summary"""
    try:
        # Total leads
        total_query = select(func.count(Lead.id))
        total_result = await db.execute(total_query)
        total_leads = total_result.scalar()
        
        # Leads by status
        status_query = select(Lead.status, func.count(Lead.id)).group_by(Lead.status)
        status_result = await db.execute(status_query)
        status_counts = {status: count for status, count in status_result.all()}
        
        # Average score
        avg_score_query = select(func.avg(Lead.score))
        avg_result = await db.execute(avg_score_query)
        avg_score = avg_result.scalar() or 0
        
        return {
            "total_leads": total_leads,
            "status_breakdown": status_counts,
            "average_score": round(float(avg_score), 2)
        }
        
    except Exception as e:
        logger.error(f"Error fetching lead stats: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")