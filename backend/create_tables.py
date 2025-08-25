# backend/create_tables.py
"""
Script to create database tables and initialize sample data
"""
import asyncio
from app.core.database import engine, Base
from app.models.lead import Lead
from app.core.config import settings


async def create_tables():
    """Create all database tables"""
    print("🏗️  Creating database tables...")

    async with engine.begin() as conn:
        # Create all tables
        await conn.run_sync(Base.metadata.create_all)

    print("✅ Database tables created successfully!")


async def create_sample_data():
    """Create some sample leads for testing"""
    from app.core.database import AsyncSessionLocal

    print("📝 Creating sample data...")

    sample_leads = [  # HIGH-QUALITY LEADS (Should score 80-100)
        {
            "first_name": "Alexandra",
            "last_name": "Rodriguez",
            "email": "alex.rodriguez@techgiant.com",
            "company": "TechGiant Corp",
            "title": "Chief Technology Officer",
            "phone": "+1-555-0001",
            "industry": "Technology",
            "company_size": "1000+",
            "budget_range": "$100,000+",
            "lead_source": "Referral",
            "notes": "Actively looking for AI-powered sales automation. Has budget approved. Timeline: Q1 2024. Previously used Salesforce but unhappy with limitations.",
            "linkedin_url": "https://linkedin.com/in/alexrodriguez-cto",
            "website": "https://techgiant.com"
        },
        {
            "first_name": "David",
            "last_name": "Kim",
            "email": "d.kim@unicorn-startup.io",
            "company": "UnicornStartup",
            "title": "VP of Sales",
            "phone": "+1-555-0002",
            "industry": "Technology",
            "company_size": "51-200",
            "budget_range": "$50,000-$100,000",
            "lead_source": "Conference",
            "notes": "Series B startup, 10x growth last year. Desperately needs lead scoring and automation. Decision maker, ready to buy.",
            "linkedin_url": "https://linkedin.com/in/davidkim-vpsales",
            "website": "https://unicorn-startup.io"
        },

        # MEDIUM-QUALITY LEADS (Should score 50-79)
        {
            "first_name": "Jennifer",
            "last_name": "Smith",
            "email": "jen.smith@midsize-corp.com",
            "company": "MidSize Corp",
            "title": "Sales Manager",
            "phone": "+1-555-0003",
            "industry": "Manufacturing",
            "company_size": "201-1000",
            "budget_range": "$25,000-$50,000",
            "lead_source": "Website",
            "notes": "Exploring CRM options. Not urgent but interested in automation features."
        },
        {
            "first_name": "Robert",
            "last_name": "Johnson",
            "email": "rob.johnson@consulting-firm.com",
            "company": "Johnson Consulting",
            "title": "Managing Partner",
            "phone": "+1-555-0004",
            "industry": "Professional Services",
            "company_size": "11-50",
            "budget_range": "$10,000-$25,000",
            "lead_source": "LinkedIn",
            "notes": "Small consulting firm, interested in client management tools"
        },

        # LOW-QUALITY LEADS (Should score 0-49)
        {
            "first_name": "Student",
            "last_name": "Researcher",
            "email": "student@university.edu",
            "company": "State University",
            "title": "Graduate Student",
            "phone": "",
            "industry": "Education",
            "company_size": "1000+",
            "budget_range": "Under $5,000",
            "lead_source": "Website",
            "notes": "Doing research on CRM systems for thesis project"
        },
        {
            "first_name": "Mark",
            "last_name": "Thompson",
            "email": "mark.t.personal@gmail.com",
            "company": "",
            "title": "Freelancer",
            "phone": "+1-555-0005",
            "industry": "Other",
            "company_size": "1-10",
            "budget_range": "Under $5,000",
            "lead_source": "Cold Outreach",
            "notes": "Solo freelancer, just browsing options"
        },

        # EDGE CASES & TESTING SCENARIOS
        {
            "first_name": "María José",
            "last_name": "González-López",
            "email": "maria.gonzalez@empresa-internacional.mx",
            "company": "Empresa Internacional México",
            "title": "Directora de Ventas",
            "phone": "+52-555-123456",
            "industry": "Manufacturing",
            "company_size": "201-1000",
            "budget_range": "$25,000-$50,000",
            "lead_source": "Trade Show",
            "notes": "International prospect from Mexico. Spanish-speaking market. High potential but language barrier considerations."
        },
        {
            "first_name": "李",
            "last_name": "明",
            "email": "li.ming@tech-company.cn",
            "company": "Beijing Tech Solutions",
            "title": "Sales Director",
            "phone": "+86-10-12345678",
            "industry": "Technology",
            "company_size": "201-1000",
            "budget_range": "$50,000-$100,000",
            "lead_source": "Partner Referral",
            "notes": "Chinese market entry opportunity. Cultural considerations important."
        },
        {
            "first_name": "",
            "last_name": "",
            "email": "noreply@automated-system.com",
            "company": "AutoBot Systems",
            "title": "",
            "phone": "",
            "industry": "",
            "company_size": "",
            "budget_range": "",
            "lead_source": "Website",
            "notes": "Possible bot/automated submission. Very minimal information provided."
        },
        {
            "first_name": "Dr. Elizabeth",
            "last_name": "Montgomery-Whittingshire III",
            "email": "e.montgomery@prestigious-hospital.org",
            "company": "Prestigious Medical Center & Research Institute",
            "title": "Chief Medical Information Officer & VP of Digital Transformation",
            "phone": "+1-555-MEDICAL",
            "industry": "Healthcare",
            "company_size": "1000+",
            "budget_range": "$100,000+",
            "lead_source": "Medical Conference",
            "notes": "Extremely long names and titles. Healthcare compliance requirements. HIPAA considerations for CRM implementation."
        },

        # COMPETITOR INTELLIGENCE
        {
            "first_name": "Jane",
            "last_name": "Competitor",
            "email": "jane@direct-competitor.com",
            "company": "Direct Competitor Inc",
            "title": "Product Manager",
            "phone": "+1-555-0006",
            "industry": "Technology",
            "company_size": "51-200",
            "budget_range": "$25,000-$50,000",
            "lead_source": "Website",
            "notes": "Works at a direct competitor. Possibly doing competitive research."
        },

        # BUDGET MISMATCHES
        {
            "first_name": "Small",
            "last_name": "Budget",
            "email": "owner@tiny-business.com",
            "company": "Tiny Local Business",
            "title": "Owner",
            "phone": "+1-555-0007",
            "industry": "Retail",
            "company_size": "1-10",
            "budget_range": "Under $5,000",
            "lead_source": "Google Search",
            "notes": "Very small business with unrealistic expectations for enterprise features"
        },
        {
            "first_name": "Enterprise",
            "last_name": "Buyer",
            "email": "procurement@mega-corp.com",
            "company": "MegaCorp International",
            "title": "Procurement Specialist",
            "phone": "+1-555-0008",
            "industry": "Manufacturing",
            "company_size": "1000+",
            "budget_range": "$500,000+",
            "lead_source": "RFP Process",
            "notes": "Complex procurement process. Not the decision maker, just gathering information for RFP."
        },

        # TIMING ISSUES
        {
            "first_name": "Future",
            "last_name": "Planner",
            "email": "future@planning-company.com",
            "company": "Long Term Planning Co",
            "title": "Strategic Planning Manager",
            "phone": "+1-555-0009",
            "industry": "Consulting",
            "company_size": "51-200",
            "budget_range": "$50,000-$100,000",
            "lead_source": "Industry Report",
            "notes": "Interested but timeline is 2025-2026. Very early in evaluation process."
        },
        {
            "first_name": "Urgent",
            "last_name": "Need",
            "email": "urgent@crisis-mode.com",
            "company": "Crisis Mode Solutions",
            "title": "Operations Director",
            "phone": "+1-555-0010",
            "industry": "Technology",
            "company_size": "11-50",
            "budget_range": "$25,000-$50,000",
            "lead_source": "Emergency Search",
            "notes": "Current CRM system failed. Needs replacement ASAP. High urgency but may make hasty decisions."
        },

        # SUSPICIOUS/FRAUD PATTERNS
        {
            "first_name": "Fake",
            "last_name": "Person",
            "email": "totally.real@suspicious-domain.tk",
            "company": "Definitely Real Company LLC",
            "title": "CEO",
            "phone": "+1-555-FAKE",
            "industry": "Technology",
            "company_size": "1000+",
            "budget_range": "$1,000,000+",
            "lead_source": "Cold Email",
            "notes": "Suspicious domain, unrealistic budget, generic information. Possible fraud attempt."
        },

        # EXISTING CUSTOMER SCENARIOS
        {
            "first_name": "Current",
            "last_name": "Customer",
            "email": "existing@our-customer.com",
            "company": "Our Existing Customer Inc",
            "title": "IT Manager",
            "phone": "+1-555-0011",
            "industry": "Finance",
            "company_size": "201-1000",
            "budget_range": "$50,000-$100,000",
            "lead_source": "Customer Referral",
            "notes": "Already our customer but different department. Expansion opportunity."
        },

        # INDUSTRY-SPECIFIC EDGE CASES
        {
            "first_name": "Government",
            "last_name": "Official",
            "email": "procurement@city.gov",
            "company": "City Government",
            "title": "IT Procurement Officer",
            "phone": "+1-555-0012",
            "industry": "Government",
            "company_size": "1000+",
            "budget_range": "$100,000+",
            "lead_source": "Government Portal",
            "notes": "Government sector. Complex procurement rules, long sales cycles, compliance requirements."
        },
        {
            "first_name": "Non",
            "last_name": "Profit",
            "email": "director@good-cause.org",
            "company": "Good Cause Foundation",
            "title": "Executive Director",
            "phone": "+1-555-0013",
            "industry": "Non-Profit",
            "company_size": "11-50",
            "budget_range": "$5,000-$10,000",
            "lead_source": "Grant Program",
            "notes": "Non-profit organization. Limited budget but stable funding. Different decision-making process."
        },

        # TECHNICAL DECISION MAKERS
        {
            "first_name": "Technical",
            "last_name": "Expert",
            "email": "tech.lead@engineering-firm.com",
            "company": "Advanced Engineering Solutions",
            "title": "Principal Software Architect",
            "phone": "+1-555-0014",
            "industry": "Technology",
            "company_size": "51-200",
            "budget_range": "$75,000-$150,000",
            "lead_source": "GitHub",
            "notes": "Highly technical buyer. Will ask detailed API questions. Influences but doesn't control budget."
        },

        # RE-ENGAGEMENT SCENARIOS
        {
            "first_name": "Lost",
            "last_name": "Prospect",
            "email": "lost@previous-opportunity.com",
            "company": "Previous Opportunity Corp",
            "title": "VP Sales",
            "phone": "+1-555-0015",
            "industry": "SaaS",
            "company_size": "201-1000",
            "budget_range": "$100,000+",
            "lead_source": "Re-engagement Campaign",
            "notes": "Previously engaged 6 months ago but went with competitor. Now reconsidering due to issues with current solution."
        }
    ]

    async with AsyncSessionLocal() as session:
        for lead_data in sample_leads:
            # Check if lead already exists
            from sqlalchemy import select
            result = await session.execute(
                select(Lead).where(Lead.email == lead_data["email"])
            )
            existing_lead = result.scalar_one_or_none()

            if not existing_lead:
                lead = Lead(**lead_data)
                session.add(lead)

        await session.commit()

    print("✅ Sample data created successfully!")


async def main():
    """Main function to set up database"""
    print(f"🚀 Initializing database: {settings.MYSQL_DATABASE}")
    print(f"📍 Host: {settings.MYSQL_HOST}:{settings.MYSQL_PORT}")

    try:
        await create_tables()
        await create_sample_data()
        print("\n🎉 Database initialization complete!")
        print("You can now start using the API endpoints.")

    except Exception as e:
        print(f"❌ Error initializing database: {e}")
        raise

if __name__ == "__main__":
    asyncio.run(main())
