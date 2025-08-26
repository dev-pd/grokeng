# backend/app/core/database.py
from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine, async_sessionmaker
from sqlalchemy.orm import DeclarativeBase
from sqlalchemy import text
from app.core.config import settings
import logging

logger = logging.getLogger(__name__)

# Create async engine
engine = create_async_engine(
    settings.DATABASE_URL,
    echo=settings.DEBUG,  # Log SQL queries in debug mode
    pool_pre_ping=True,  # Verify connections before use
    pool_recycle=300,  # Recycle connections every 5 minutes
)

# Create session factory
AsyncSessionLocal = async_sessionmaker(
    engine, class_=AsyncSession, expire_on_commit=False
)


# Base class for all models
class Base(DeclarativeBase):
    pass


# Dependency to get database session
async def get_db_session() -> AsyncSession:
    async with AsyncSessionLocal() as session:
        try:
            yield session
        except Exception as e:
            await session.rollback()
            logger.error(f"Database session error: {e}")
            raise
        finally:
            await session.close()


# Database connection management for app lifecycle
async def connect_to_mysql():
    """Initialize database connection on app startup"""
    try:
        async with engine.begin() as conn:
            # Test the connection
            await conn.execute(text("SELECT 1"))
        logger.info("✅ Connected to MySQL database successfully")
        return True
    except Exception as e:
        logger.error(f"❌ Failed to connect to MySQL database: {e}")
        return False


async def close_mysql_connection():
    """Close database connection on app shutdown"""
    try:
        await engine.dispose()
        logger.info("✅ MySQL database connection closed")
    except Exception as e:
        logger.error(f"❌ Error closing MySQL database connection: {e}")


# Health check function
async def check_database_health() -> bool:
    """Check if database is accessible"""
    try:
        async with AsyncSessionLocal() as session:
            await session.execute(text("SELECT 1"))
            return True
    except Exception as e:
        logger.error(f"Database health check failed: {e}")
        return False
