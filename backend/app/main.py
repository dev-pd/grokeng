# backend/app/main.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from app.core.config import settings
from app.core.database import connect_to_mysql, close_mysql_connection
from app.api import leads, grok

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    print("🚀 Starting Grok SDR System...")
    db_connected = await connect_to_mysql()
    if not db_connected:
        print("⚠️  Warning: Database connection failed, but continuing...")
    yield
    # Shutdown
    print("🛑 Shutting down Grok SDR System...")
    await close_mysql_connection()

app = FastAPI(
    title=settings.PROJECT_NAME,
    version="1.0.0",
    description="Grok-powered Sales Development Representative System",
    lifespan=lifespan
)

# Set up CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.BACKEND_CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Health check endpoints
@app.get("/")
async def root():
    return {
        "message": "Grok SDR System API is running!", 
        "version": "1.0.0",
        "status": "healthy"
    }

@app.get("/health")
async def health_check():
    from app.core.database import check_database_health
    db_healthy = await check_database_health()
    return {
        "status": "healthy" if db_healthy else "unhealthy",
        "service": "grok-sdr-api",
        "database": "connected" if db_healthy else "disconnected",
        "version": "1.0.0"
    }

# Include API routers
app.include_router(leads.router, prefix=f"{settings.API_V1_STR}/leads", tags=["leads"])
app.include_router(grok.router, prefix=f"{settings.API_V1_STR}/grok", tags=["grok"])

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)