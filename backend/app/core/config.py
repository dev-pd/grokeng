from typing import List

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    # API Settings
    API_V1_STR: str = "/api/v1"
    PROJECT_NAME: str = "Grok SDR System"
    DEBUG: bool = False

    # Grok API Configuration
    GROK_API_KEY: str
    GROK_API_URL: str = "https://api.x.ai/v1"
    GROK_MODEL: str = "grok-4-latest"

    # MySQL Database Configuration
    MYSQL_HOST: str = "127.0.0.1"
    MYSQL_PORT: int = 3306
    MYSQL_DATABASE: str = "grok_sdr"
    MYSQL_USER: str = "root"
    MYSQL_PASSWORD: str

    @property
    def DATABASE_URL(self) -> str:
        return f"mysql+aiomysql://{self.MYSQL_USER}:{self.MYSQL_PASSWORD}@{self.MYSQL_HOST}:{self.MYSQL_PORT}/{self.MYSQL_DATABASE}"

    # CORS Configuration
    BACKEND_CORS_ORIGINS: List[str] = [
        "http://localhost:3000",
        "http://localhost:5173",
        "http://127.0.0.1:3000",
        "http://127.0.0.1:5173",
    ]

    # Lead Scoring Configuration
    DEFAULT_LEAD_SCORE_WEIGHTS: dict = {
        "company_size": 0.3,
        "industry_match": 0.25,
        "budget_range": 0.25,
        "decision_maker_level": 0.2,
    }

    model_config = SettingsConfigDict(
        env_file=".env",
        case_sensitive=True,
        extra="ignore",
    )


settings = Settings()
