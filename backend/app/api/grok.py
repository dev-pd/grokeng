# backend/app/api/grok.py
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import Dict, Any
from app.core.database import get_db_session
from app.models.lead import Lead
from app.services.grok_service import GrokService
import logging

logger = logging.getLogger(__name__)
router = APIRouter()


@router.post("/analyze-lead/{lead_id}")
async def analyze_lead_with_grok(
    lead_id: int, db: AsyncSession = Depends(get_db_session)
) -> Dict[str, Any]:
    """Analyze a lead using Grok AI and return comprehensive insights"""
    try:
        # Fetch the lead
        query = select(Lead).where(Lead.id == lead_id)
        result = await db.execute(query)
        lead = result.scalar_one_or_none()

        if not lead:
            raise HTTPException(status_code=404, detail="Lead not found")

        # Analyze with Grok
        analysis = GrokService.analyze_and_score_lead(lead)

        # Optionally update the lead's score based on Grok analysis
        if not analysis.get("error", False):
            grok_score = analysis.get("overall_score", lead.score)
            if grok_score and grok_score > 0:
                lead.score = grok_score
                await db.commit()
                await db.refresh(lead)
                logger.info(
                    f"Updated lead {lead_id} score to {grok_score} based on Grok analysis"
                )

        return {
            "success": True,
            "lead_id": lead_id,
            "lead_email": lead.email,
            "analysis": analysis,
            "message": "Lead analysis completed successfully",
        }

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error analyzing lead {lead_id} with Grok: {e}")
        raise HTTPException(status_code=500, detail="Failed to analyze lead")


@router.post("/generate-message/{lead_id}")
async def generate_personalized_message(
    lead_id: int,
    message_type: str = "email",
    db: AsyncSession = Depends(get_db_session),
) -> Dict[str, Any]:
    """Generate a personalized message for a lead using Grok AI"""
    try:
        # Validate message type
        valid_types = ["email", "linkedin", "call", "meeting"]
        if message_type not in valid_types:
            raise HTTPException(
                status_code=400,
                detail=f"Invalid message type. Must be one of: {', '.join(valid_types)}",
            )

        # Fetch the lead
        query = select(Lead).where(Lead.id == lead_id)
        result = await db.execute(query)
        lead = result.scalar_one_or_none()

        if not lead:
            raise HTTPException(status_code=404, detail="Lead not found")

        # Generate message with Grok
        message_data = await GrokService.generate_outreach_message(lead, message_type)

        return {
            "success": True,
            "lead_id": lead_id,
            "lead_name": f"{lead.first_name} {lead.last_name}",
            "company": lead.company,
            "message": message_data,
            "generated_at": "now",
        }

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error generating message for lead {lead_id}: {e}")
        raise HTTPException(status_code=500, detail="Failed to generate message")


@router.post("/qualify-lead/{lead_id}")
async def auto_qualify_lead(
    lead_id: int, db: AsyncSession = Depends(get_db_session)
) -> Dict[str, Any]:
    """Auto-qualify a lead using Grok AI analysis"""
    try:
        # Fetch the lead
        query = select(Lead).where(Lead.id == lead_id)
        result = await db.execute(query)
        lead = result.scalar_one_or_none()

        if not lead:
            raise HTTPException(status_code=404, detail="Lead not found")

        # Analyze with Grok
        analysis = await GrokService.analyze_and_score_lead(lead)

        if not analysis.get("error", False):
            # Update lead based on Grok recommendations
            recommended_status = GrokService.extract_recommended_status(analysis)
            grok_score = analysis.get("overall_score", lead.score)

            # Update the lead
            lead.score = grok_score
            if recommended_status and recommended_status != "New Lead":
                lead.status = recommended_status

            await db.commit()
            await db.refresh(lead)

            logger.info(
                f"Auto-qualified lead {lead_id}: status={lead.status}, score={lead.score}"
            )

        return {
            "success": True,
            "lead_id": lead_id,
            "previous_status": lead.status,
            "new_score": float(lead.score),
            "qualification_result": analysis.get("qualification_status"),
            "priority_level": analysis.get("priority_level"),
            "key_insights": analysis.get("key_insights", []),
            "next_steps": analysis.get("next_steps", []),
            "analysis": analysis,
        }

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error auto-qualifying lead {lead_id}: {e}")
        raise HTTPException(status_code=500, detail="Failed to qualify lead")


@router.get("/test-connection")
def test_grok_connection() -> Dict[str, Any]:
    """Test the Grok API connection"""
    try:
        # Import the grok_client directly
        from app.core.grok_client import grok_client

        # Simple test with minimal data
        test_data = {
            "first_name": "Test",
            "last_name": "User",
            "company": "Test Company",
            "title": "Manager",
            "industry": "Technology",
        }

        analysis = grok_client.analyze_lead(test_data)

        return {
            "success": True,
            "message": "Grok API connection successful",
            "test_analysis": analysis,
            "api_url": grok_client.api_url,
            "model": grok_client.model,
        }

    except Exception as e:
        logger.error(f"Grok connection test failed: {e}")
        return {
            "success": False,
            "message": "Grok API connection failed",
            "error": str(e),
            "api_url": grok_client.api_url if "grok_client" in locals() else "Unknown",
        }
