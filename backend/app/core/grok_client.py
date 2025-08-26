# backend/app/core/grok_client.py
import requests
import logging
from typing import Dict, Any, Optional
from app.core.config import settings

logger = logging.getLogger(__name__)


class GrokClient:
    """Client for interacting with Grok API"""

    def __init__(self):
        self.api_key = settings.GROK_API_KEY
        self.api_url = settings.GROK_API_URL
        self.model = settings.GROK_MODEL
        self.headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json",
        }

        # Debug logging
        logger.info(f"Initializing GrokClient with API URL: {self.api_url}")
        logger.info(f"API Key configured: {'Yes' if self.api_key else 'No'}")
        logger.info(f"Model: {self.model}")

    def _make_request(self, endpoint: str, data: Dict[str, Any]) -> Dict[str, Any]:
        """Make a request to the Grok API"""
        try:
            if not self.api_key:
                raise ValueError("Grok API key is not configured")

            url = f"{self.api_url}/{endpoint}"

            # Log the request (without API key for security)
            logger.info(f"Making Grok API request to: {endpoint}")
            logger.debug(f"Request data: {data}")

            response = requests.post(url, json=data, headers=self.headers, timeout=30)

            response.raise_for_status()
            result = response.json()

            logger.info(f"Grok API request successful")
            return result

        except requests.exceptions.RequestException as e:
            logger.error(f"Grok API request failed: {e}")
            raise Exception(f"Failed to communicate with Grok API: {str(e)}")
        except Exception as e:
            logger.error(f"Unexpected error in Grok API request: {e}")
            raise

    def analyze_lead(self, lead_data: Dict[str, Any]) -> Dict[str, Any]:
        """Analyze a lead using Grok AI"""
        try:
            # Create a comprehensive prompt for lead analysis
            prompt = self._create_lead_analysis_prompt(lead_data)

            data = {
                "model": self.model,
                "messages": [
                    {
                        "role": "system",
                        "content": "You are an expert sales development representative with deep knowledge of lead qualification, scoring, and sales processes. Analyze leads objectively and provide actionable insights.",
                    },
                    {"role": "user", "content": prompt},
                ],
                "temperature": 0.3,  # Lower temperature for more consistent scoring
                "max_tokens": 1000,
                "stream": False,
            }

            result = self._make_request("chat/completions", data)

            # Extract and parse the response
            if result and "choices" in result and len(result["choices"]) > 0:
                content = result["choices"][0]["message"]["content"]
                return self._parse_lead_analysis(content)
            else:
                raise Exception("Invalid response format from Grok API")

        except Exception as e:
            logger.error(f"Error analyzing lead: {e}")
            # Return a default analysis if Grok fails
            return self._get_fallback_analysis()

    def _create_lead_analysis_prompt(self, lead_data: Dict[str, Any]) -> str:
        """Create a detailed prompt for lead analysis"""

        # Extract relevant lead information
        name = f"{lead_data.get('first_name', '')} {lead_data.get('last_name', '')}".strip()
        company = lead_data.get("company", "Unknown")
        title = lead_data.get("title", "Unknown")
        industry = lead_data.get("industry", "Unknown")
        company_size = lead_data.get("company_size", "Unknown")
        budget_range = lead_data.get("budget_range", "Unknown")
        lead_source = lead_data.get("lead_source", "Unknown")
        notes = lead_data.get("notes", "No additional notes")

        prompt = f"""
Analyze the following sales lead and provide a comprehensive assessment:

LEAD INFORMATION:
- Name: {name}
- Company: {company}
- Title: {title}
- Industry: {industry}
- Company Size: {company_size}
- Budget Range: {budget_range}
- Lead Source: {lead_source}
- Notes: {notes}

Please provide your analysis in the following JSON format:

{{
    "overall_score": <number between 0-100>,
    "qualification_status": "<Qualified|Not Qualified|Needs More Info>",
    "priority_level": "<High|Medium|Low>",
    "scoring_breakdown": {{
        "title_score": <0-100>,
        "company_score": <0-100>,
        "industry_fit": <0-100>,
        "budget_alignment": <0-100>
    }},
    "key_insights": [
        "<insight 1>",
        "<insight 2>",
        "<insight 3>"
    ],
    "recommended_approach": "<personalized outreach strategy>",
    "next_steps": [
        "<action 1>",
        "<action 2>"
    ],
    "risk_factors": [
        "<risk 1 if any>",
        "<risk 2 if any>"
    ]
}}

Consider these factors in your analysis:
1. Decision-making authority based on title
2. Company size and potential deal size alignment
3. Industry fit for our solutions
4. Budget range feasibility
5. Lead source quality and intent level
6. Any red flags or concerns

Be thorough but concise in your analysis.
"""
        return prompt

    def _parse_lead_analysis(self, content: str) -> Dict[str, Any]:
        """Parse the Grok response into structured data"""
        try:
            import json
            import re

            # Try to extract JSON from the response
            json_match = re.search(r"\{.*\}", content, re.DOTALL)
            if json_match:
                json_str = json_match.group()
                return json.loads(json_str)
            else:
                # If no valid JSON found, create a basic structure
                logger.warning("Could not parse Grok response as JSON, using fallback")
                return self._get_fallback_analysis()

        except Exception as e:
            logger.error(f"Error parsing Grok response: {e}")
            return self._get_fallback_analysis()

    def _get_fallback_analysis(self) -> Dict[str, Any]:
        """Provide a fallback analysis when Grok is unavailable"""
        return {
            "overall_score": 50,
            "qualification_status": "Needs More Info",
            "priority_level": "Medium",
            "scoring_breakdown": {
                "title_score": 50,
                "company_score": 50,
                "industry_fit": 50,
                "budget_alignment": 50,
            },
            "key_insights": [
                "Lead requires manual review",
                "Grok AI analysis unavailable",
            ],
            "recommended_approach": "Manual qualification recommended",
            "next_steps": ["Review lead manually", "Schedule discovery call"],
            "risk_factors": ["AI analysis unavailable"],
        }

    def generate_personalized_message(
        self, lead_data: Dict[str, Any], message_type: str = "email"
    ) -> str:
        """Generate a personalized outreach message"""
        try:
            prompt = f"""
Create a personalized {message_type} message for this sales lead:

Lead: {lead_data.get("first_name", "")} {lead_data.get("last_name", "")}
Company: {lead_data.get("company", "their company")}
Title: {lead_data.get("title", "their role")}
Industry: {lead_data.get("industry", "their industry")}

Requirements:
- Professional but friendly tone
- Personalized to their industry and role
- Clear value proposition
- Call to action
- Keep it concise (under 200 words)
- Don't be overly salesy

Generate only the message content, no subject line or signatures.
"""

            data = {
                "model": self.model,
                "messages": [
                    {
                        "role": "system",
                        "content": "You are an expert sales writer who creates compelling, personalized outreach messages that get responses. Focus on value and relevance.",
                    },
                    {"role": "user", "content": prompt},
                ],
                "temperature": 0.7,
                "max_tokens": 300,
                "stream": False,
            }

            result = self._make_request("chat/completions", data)

            if result and "choices" in result and len(result["choices"]) > 0:
                return result["choices"][0]["message"]["content"].strip()
            else:
                return "Hello! I'd love to discuss how we can help your business grow. Are you available for a brief call this week?"

        except Exception as e:
            logger.error(f"Error generating message: {e}")
            return "Hello! I'd love to discuss how we can help your business grow. Are you available for a brief call this week?"


# Create a global instance
grok_client = GrokClient()
