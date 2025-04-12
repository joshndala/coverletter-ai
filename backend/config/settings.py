from pydantic_settings import BaseSettings
from dotenv import load_dotenv
import os

load_dotenv()

def parse_bool(value: str) -> bool:
    return value.lower() in ("true", "1", "yes", "y", "t")

class Settings(BaseSettings):
    AWS_ACCESS_KEY_ID: str = os.getenv("AWS_ACCESS_KEY_ID")
    AWS_SECRET_ACCESS_KEY: str = os.getenv("AWS_SECRET_ACCESS_KEY")
    AWS_REGION: str = os.getenv("AWS_REGION", "us-east-1")
    DATABASE_URL: str = os.getenv("DATABASE_URL")
    CORS_ORIGINS: list = ["http://localhost:3000"]
    FIREBASE_SERVICE_ACCOUNT_PATH: str = os.environ.get("FIREBASE_SERVICE_ACCOUNT_PATH")
    DEV_MODE: bool = parse_bool(os.getenv("DEV_MODE", "false"))
    TEST_USER_ID: str = os.getenv("TEST_USER_ID")
    TEST_USER_EMAIL: str = os.getenv("TEST_USER_EMAIL")
    TEST_USER_NAME: str = os.getenv("TEST_USER_NAME")

    class Config:
        env_file = ".env"

settings = Settings()