from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from typing import List, Optional
from app.core.database import get_db_session
from app.models.message import (
    Message,
    MessageCreate,
    MessageUpdate,
    MessageResponse,
    MessageListResponse,
)
import logging

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/messages", tags=["Messages"])


@router.get("/", response_model=MessageListResponse)
async def get_messages(
    page: int = Query(1, ge=1, description="Page number"),
    per_page: int = Query(10, ge=1, le=100, description="Items per page"),
    message_type: Optional[str] = Query(None, description="Filter by message type"),
    lead_id: Optional[int] = Query(None, description="Filter by lead ID"),
    grok_generated: Optional[bool] = Query(
        None, description="Filter by Grok-generated"
    ),
    db: AsyncSession = Depends(get_db_session),
):
    """Get all messages with pagination and filtering"""
    try:
        query = select(Message)

        if message_type:
            query = query.where(Message.message_type == message_type)
        if lead_id:
            query = query.where(Message.lead_id == lead_id)
        if grok_generated is not None:
            query = query.where(Message.grok_generated == grok_generated)

        # Get total count
        count_query = select(func.count(Message.id))
        if message_type:
            count_query = count_query.where(Message.message_type == message_type)
        if lead_id:
            count_query = count_query.where(Message.lead_id == lead_id)
        if grok_generated is not None:
            count_query = count_query.where(Message.grok_generated == grok_generated)

        total_result = await db.execute(count_query)
        total = total_result.scalar()

        # Apply pagination and ordering
        offset = (page - 1) * per_page
        query = query.order_by(desc(Message.created_at)).offset(offset).limit(per_page)

        result = await db.execute(query)
        messages = result.scalars().all()

        total_pages = (total + per_page - 1) // per_page

        return MessageListResponse(
            messages=messages,
            total=total,
            page=page,
            per_page=per_page,
            total_pages=total_pages,
        )

    except Exception as e:
        logger.error(f"Error fetching messages: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")


@router.post("/", response_model=MessageResponse, status_code=201)
async def create_message(
    message: MessageCreate, db: AsyncSession = Depends(get_db_session)
):
    """Create a new message"""
    try:
        db_message = Message(**message.model_dump())
        db.add(db_message)
        await db.commit()
        await db.refresh(db_message)

        logger.info(f"Created new message for lead ID: {db_message.lead_id}")
        return db_message

    except Exception as e:
        logger.error(f"Error creating message: {e}")
        await db.rollback()
        raise HTTPException(status_code=500, detail="Internal server error")


@router.get("/{message_id}", response_model=MessageResponse)
async def get_message(message_id: int, db: AsyncSession = Depends(get_db_session)):
    """Get a specific message by ID"""
    try:
        query = select(Message).where(Message.id == message_id)
        result = await db.execute(query)
        message = result.scalar_one_or_none()

        if not message:
            raise HTTPException(status_code=404, detail="Message not found")

        return message

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error fetching message {message_id}: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")


@router.put("/{message_id}", response_model=MessageResponse)
async def update_message(
    message_id: int,
    message_update: MessageUpdate,
    db: AsyncSession = Depends(get_db_session),
):
    """Update a message"""
    try:
        query = select(Message).where(Message.id == message_id)
        result = await db.execute(query)
        db_message = result.scalar_one_or_none()

        if not db_message:
            raise HTTPException(status_code=404, detail="Message not found")

        update_data = message_update.model_dump(exclude_unset=True)
        for field, value in update_data.items():
            setattr(db_message, field, value)

        await db.commit()
        await db.refresh(db_message)

        logger.info(f"Updated message: {db_message.id}")
        return db_message

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error updating message {message_id}: {e}")
        await db.rollback()
        raise HTTPException(status_code=500, detail="Internal server error")


@router.delete("/{message_id}")
async def delete_message(message_id: int, db: AsyncSession = Depends(get_db_session)):
    """Delete a message"""
    try:
        query = select(Message).where(Message.id == message_id)
        result = await db.execute(query)
        db_message = result.scalar_one_or_none()

        if not db_message:
            raise HTTPException(status_code=404, detail="Message not found")

        await db.delete(db_message)
        await db.commit()

        logger.info(f"Deleted message: {db_message.id}")
        return {"message": "Message deleted successfully"}

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error deleting message {message_id}: {e}")
        await db.rollback()
        raise HTTPException(status_code=500, detail="Internal server error")


@router.get("/stats/summary")
async def get_message_stats(db: AsyncSession = Depends(get_db_session)):
    """Get message statistics summary"""
    try:
        # Messages by type
        type_query = select(Message.message_type, func.count(Message.id)).group_by(
            Message.message_type
        )
        type_result = await db.execute(type_query)
        type_counts = {msg_type: count for msg_type, count in type_result.all()}

        return {
            "email_messages": type_counts.get("email", 0),
            "linkedin_messages": type_counts.get("linkedin", 0),
            "call_messages": type_counts.get("call", 0),
            "meeting_messages": type_counts.get("meeting", 0),
            "total_messages": sum(type_counts.values()),
        }

    except Exception as e:
        logger.error(f"Error fetching message stats: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")
