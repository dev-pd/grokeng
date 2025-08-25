# backend/app/core/config.py
from pydantic_settings import BaseSettings
from typing import List
import os


class Settings(BaseSettings):
    # API Settings
    API_V1_STR: str = "/api/v1"
    PROJECT_NAME: str = "Grok SDR System"
    DEBUG: bool = True

    # Grok API Configuration
    GROK_API_KEY: str = "xai-I1wXucEXNdStVX7iVt6PkD5Lbt2GhcaVK9q399XDscL66pmnZhA64EU0APB0m3vhE6uTCJUZjQgijhSZ"
    GROK_API_URL: str = "https://api.x.ai/v1"
    GROK_MODEL: str = "grok-4-latest"

    # MySQL Database Configuration
    MYSQL_HOST: str = "127.0.0.1"
    MYSQL_PORT: int = 3306
    MYSQL_DATABASE: str = "grok_sdr"
    MYSQL_USER: str = "root"
    MYSQL_PASSWORD: str = "rootroot"

    @property
    def DATABASE_URL(self) -> str:
        return f"mysql+aiomysql://{self.MYSQL_USER}:{self.MYSQL_PASSWORD}@{self.MYSQL_HOST}:{self.MYSQL_PORT}/{self.MYSQL_DATABASE}"

    # CORS Configuration
    BACKEND_CORS_ORIGINS: List[str] = [
        "http://localhost:3000",
        "http://localhost:5173",
        "http://127.0.0.1:3000",
        "http://127.0.0.1:5173"
    ]

    # Lead Scoring Configuration
    DEFAULT_LEAD_SCORE_WEIGHTS: dict = {
        "company_size": 0.3,
        "industry_match": 0.25,
        "budget_range": 0.25,
        "decision_maker_level": 0.2
    }

    class Config:
        env_file = ".env"
        case_sensitive = True


settings = Settings()
