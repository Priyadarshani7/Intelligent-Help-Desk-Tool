import joblib
from app.core.config import settings
import pandas as pd

model = joblib.load(settings.model_path)
encoder = joblib.load(settings.encoder_path)

def predict_ticket_category(subject: str, description: str, priority: str) -> str:
    input_text = f"{subject} {description} {priority}"
    prediction = model.predict([input_text])
    category = encoder.inverse_transform(prediction)[0]
    return category
    
