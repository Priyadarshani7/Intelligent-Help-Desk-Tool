from pydantic_settings import BaseSettings
from dotenv import load_dotenv
import os

load_dotenv()

class Settings(BaseSettings):
    app_name: str = os.getenv("APP_NAME")
    env: str = os.getenv("ENV")
    host: str = os.getenv("HOST")
    port: int = int(os.getenv("PORT", 8000))
    database_url: str = os.getenv("DATABASE_URL")
    model_path: str = os.getenv("MODEL_PATH")
    encoder_path: str = os.getenv("ENCODER_PATH")
    gemini_api_key: str = os.getenv("GEMINI_API_KEY")
    chromadb_path: str = os.getenv("CHROMADB_PATH", "./chroma_db")


settings = Settings()
