"""
Application configuration settings.
"""
from functools import lru_cache
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    """Application settings loaded from environment variables."""
    
    # App
    APP_NAME: str = "News Verifier API"
    APP_VERSION: str = "1.0.0"
    DEBUG: bool = True
    API_V1_PREFIX: str = "/api/v1"
    
    # Database (localhost PostgreSQL with psycopg driver)
    DATABASE_URL: str = "postgresql+psycopg://postgres:postgres@localhost:5432/news_verifier"
    DATABASE_ECHO: bool = False
    
    # Scraping
    SCRAPER_TIMEOUT: int = 30
    SCRAPER_USER_AGENT: str = "NewsVerifier/1.0"
    
    # CORS
    CORS_ORIGINS: list[str] = ["http://localhost:3000", "http://localhost:5173"]
    
    class Config:
        env_file = ".env"
        case_sensitive = True


@lru_cache()
def get_settings() -> Settings:
    """Get cached settings instance."""
    return Settings()


settings = get_settings()
