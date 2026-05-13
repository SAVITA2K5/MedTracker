"""
Application configuration – reads from .env file via pydantic-settings.
"""

from pydantic_settings import BaseSettings
from typing import List


class Settings(BaseSettings):
    # App
    APP_ENV: str = "development"
    DEBUG: bool = True

    # Database
    DATABASE_URL: str = "postgresql://postgres:password@localhost:5432/medtrack"

    # Security / JWT
    SECRET_KEY: str = "change-me-in-production"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60

    # Twilio (SOS alerts)
    TWILIO_ACCOUNT_SID: str = ""
    TWILIO_AUTH_TOKEN: str = ""
    TWILIO_FROM_NUMBER: str = ""

    # CORS – stored as a plain string in .env, split at runtime
    # Example: ALLOWED_ORIGINS_RAW=http://localhost:8081,http://localhost:3000
    ALLOWED_ORIGINS_RAW: str = "http://localhost:8081,http://localhost:3000,http://127.0.0.1:8081"

    @property
    def ALLOWED_ORIGINS(self) -> List[str]:
        return [o.strip() for o in self.ALLOWED_ORIGINS_RAW.split(",") if o.strip()]

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"
        extra = "ignore"   # silently ignore unknown env vars


settings = Settings()
