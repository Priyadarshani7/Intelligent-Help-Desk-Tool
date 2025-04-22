import os

from dotenv import load_dotenv

load_dotenv
class Settings:
    
    
    def __init__(self):
        self.database_url = os.getenv("DATABASE_URL")
        self.ai_model_path = os.getenv("MODEL_PATH")
        self.ai_encoder_path = os.getenv("ENCODER_PATH")
        

settings = Settings()




