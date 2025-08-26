# backend/app/services/grok_service.py
from typing import Dict, Any
from app.core.grok_client import grok_client
from app.models.lead import Lead
import logging

logger = logging.getLogger(__name__)


class GrokService:
    """Service for Grok AI operations on leads"""

    @staticmethod
    def analyze_and_score_lead(lead: Lead) -> Dict[str, Any]:
        """Analyze a lead and return comprehensive scoring and insights"""
        try:
            # Prepare lead data for Grok analysis
            lead_data = {
                "first_name": lead.first_name,
                "last_name": lead.last_name,
                "email": lead.email,
                "company": lead.company,
                "title": lead.title,
                "industry": lead.industry,
                "company_size": lead.company_size,
                "budget_range": lead.budget_range,
                "lead_source": lead.lead_source,
                "notes": lead.notes,
                "phone": lead.phone,
                "linkedin_url": lead.linkedin_url,
                "website": lead.website,
            }

            logger.info(f"Analyzing lead {lead.id} ({lead.email}) with Grok AI")

            # Get Grok analysis
            analysis = grok_client.analyze_lead(lead_data)

            # Add metadata about the analysis
            analysis["analyzed_at"] = (
                lead.updated_at.isoformat() if lead.updated_at else None
            )
            analysis["lead_id"] = lead.id
            analysis["grok_version"] = "grok-4-latest"

            logger.info(
                f"Grok analysis complete for lead {lead.id}. Score: {analysis.get('overall_score', 'N/A')}"
            )

            return analysis

        except Exception as e:
            logger.error(f"Error in Grok lead analysis for lead {lead.id}: {e}")
            # Return a basic fallback analysis
            return {
                "overall_score": 25,
                "qualification_status": "Error - Manual Review Required",
                "priority_level": "Low",
                "scoring_breakdown": {
                    "title_score": 0,
                    "company_score": 0,
                    "industry_fit": 0,
                    "budget_alignment": 0,
                },
                "key_insights": [
                    "AI analysis failed - manual review required",
                    f"Error: {str(e)[:100]}...",
                ],
                "recommended_approach": "Manual qualification required due to analysis error",
                "next_steps": ["Review lead manually", "Check Grok API connection"],
                "risk_factors": ["AI analysis unavailable"],
                "error": True,
            }

    @staticmethod
    async def generate_outreach_message(
        lead: Lead, message_type: str = "email", context: str = ""
    ) -> Dict[str, Any]:
        """Generate personalized outreach message for a lead"""
        try:
            lead_data = {
                "first_name": lead.first_name,
                "last_name": lead.last_name,
                "company": lead.company,
                "title": lead.title,
                "industry": lead.industry,
                "company_size": lead.company_size,
                "notes": lead.notes,
                "lead_source": lead.lead_source,
            }

            logger.info(f"Generating {message_type} message for lead {lead.id}")

            message_content = await grok_client.generate_personalized_message(
                lead_data, message_type
            )

            # Generate a subject line for emails
            subject = ""
            if message_type == "email":
                subject = await GrokService._generate_email_subject(lead)

            result = {
                "content": message_content,
                "subject": subject,
                "message_type": message_type,
                "generated_for": f"{lead.first_name} {lead.last_name}",
                "company": lead.company,
                "personalization_level": "high",
                "grok_generated": True,
            }

            logger.info(f"Message generated successfully for lead {lead.id}")
            return result

        except Exception as e:
            logger.error(f"Error generating message for lead {lead.id}: {e}")
            # Return a basic fallback message
            return {
                "content": f"Hi {lead.first_name}, I'd love to discuss how we can help {lead.company or 'your business'} achieve its goals. Would you be open to a brief conversation?",
                "subject": f"Quick question about {lead.company or 'your business'}",
                "message_type": message_type,
                "generated_for": f"{lead.first_name} {lead.last_name}",
                "company": lead.company,
                "personalization_level": "basic",
                "grok_generated": False,
                "error": True,
            }

    @staticmethod
    async def _generate_email_subject(lead: Lead) -> str:
        """Generate an email subject line"""
        try:
            prompt = f"""
Generate a compelling email subject line for a sales outreach to:
- {lead.first_name} {lead.last_name}
- {lead.title or "Professional"} at {lead.company or "their company"}
- Industry: {lead.industry or "Unknown"}

Requirements:
- Personal but professional
- Curiosity-driven
- Under 60 characters
- No spammy words
- Industry-relevant when possible

Generate only the subject line, nothing else.
"""

            data = {
                "model": grok_client.model,
                "messages": [
                    {
                        "role": "system",
                        "content": "You are an expert at writing email subject lines that get opened. Focus on curiosity and relevance.",
                    },
                    {"role": "user", "content": prompt},
                ],
                "temperature": 0.8,
                "max_tokens": 50,
            }

            result = await grok_client._make_request("chat/completions", data)

            if result and "choices" in result and len(result["choices"]) > 0:
                subject = result["choices"][0]["message"]["content"].strip()
                # Remove quotes if present
                subject = subject.strip('"').strip("'")
                return subject
            else:
                return f"Quick question about {lead.company or 'your business'}"

        except Exception as e:
            logger.error(f"Error generating email subject: {e}")
            return f"Quick question about {lead.company or 'your business'}"

    @staticmethod
    def calculate_lead_priority(analysis: Dict[str, Any]) -> str:
        """Calculate lead priority based on Grok analysis"""
        try:
            score = analysis.get("overall_score", 0)
            qualification = analysis.get("qualification_status", "").lower()

            if score >= 80 and "qualified" in qualification:
                return "High"
            elif score >= 60 or "qualified" in qualification:
                return "Medium"
            elif score >= 40:
                return "Low"
            else:
                return "Very Low"

        except Exception:
            return "Medium"

    @staticmethod
    def extract_recommended_status(analysis: Dict[str, Any]) -> str:
        """Extract recommended status from Grok analysis"""
        try:
            qualification = analysis.get("qualification_status", "").lower()
            score = analysis.get("overall_score", 0)

            if "qualified" in qualification and score >= 70:
                return "Qualified"
            elif "not qualified" in qualification or score < 30:
                return "Not Qualified"
            else:
                return "Needs Review"

        except Exception:
            return "New Lead"
