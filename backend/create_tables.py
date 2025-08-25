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
    
    sample_leads = [
        {
            "first_name": "John",
            "last_name": "Doe", 
            "email": "john.doe@techcorp.com",
            "company": "TechCorp Inc",
            "title": "CTO",
            "phone": "+1-555-0123",
            "industry": "Technology",
            "company_size": "51-200",
            "budget_range": "$10,000-$50,000",
            "lead_source": "Website",
            "notes": "Interested in AI solutions for sales automation"
        },
        {
            "first_name": "Sarah",
            "last_name": "Johnson",
            "email": "sarah.johnson@healthplus.com", 
            "company": "HealthPlus Solutions",
            "title": "VP of Operations",
            "phone": "+1-555-0124",
            "industry": "Healthcare",
            "company_size": "11-50",
            "budget_range": "$5,000-$25,000",
            "lead_source": "LinkedIn",
            "notes": "Looking for CRM automation tools"
        },
        {
            "first_name": "Michael",
            "last_name": "Chen",
            "email": "m.chen@financeflow.com",
            "company": "FinanceFlow Ltd",
            "title": "Director of Sales",
            "phone": "+1-555-0125", 
            "industry": "Finance",
            "company_size": "201-1000",
            "budget_range": "$25,000-$100,000",
            "lead_source": "Referral",
            "notes": "Needs lead qualification and scoring system"
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