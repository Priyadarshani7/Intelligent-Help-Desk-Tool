import joblib
from app.core.config import settings
import pandas as pd

model = joblib.load(settings.model_path)
encoder = joblib.load(settings.encoder_path)
from huggingface_hub import login
import os

from transformers import RobertaForSequenceClassification, RobertaTokenizer
import torch
model = RobertaForSequenceClassification.from_pretrained("purveshmule/roberta-ticket-model")
tokenizer = RobertaTokenizer.from_pretrained("purveshmule/roberta-ticket-model")
model.eval()

# Load label encoder correctly
# import joblib
# encoder = joblib.load(encoder)  # Or settings.encoder_path

def predict_ticket_category(subject: str, description: str, priority: str) -> str:
    try:
        input_text = f"{subject} {description} {priority}"
        inputs = tokenizer(input_text, return_tensors="pt", truncation=True, padding=True)

        with torch.no_grad():
            outputs = model(**inputs)
            logits = outputs.logits
            predicted_class_id = torch.argmax(logits, dim=1).item()

        category = encoder.inverse_transform([predicted_class_id])[0]
        return category
    except Exception as e:
        print(f"Error during prediction: {e}")
        raise e



# def predict_ticket_roberta(text):
#     model.eval()
#     inputs = tokenizer(text, return_tensors="pt", truncation=True, padding=True, max_length=128).to(device)
#     with torch.no_grad():
#         outputs = model(**inputs)
#         logits = outputs.logits
#         probs = F.softmax(logits, dim=1)  # Convert logits to probabilities
#         pred_label_id = torch.argmax(probs, dim=1).item()
#         confidence = probs[0][pred_label_id].item()  # Confidence score of predicted label

#     if confidence < 0.50:
#         return "Helpdesk", confidence
#     else:
#         predicted_label = le.inverse_transform([pred_label_id])[0]
#         return predicted_label, confidence
# def predict_ticket_category(subject: str, description: str, priority: str) -> str:
#     try:
#         # input_text = f"{subject} {description} {priority}"
#         # prediction = model.predict([input_text])
#         # category = encoder.inverse_transform(prediction)[0]
#         # return category

#     except Exception as e:
#         print(f"Error during prediction: {e}")
#         raise e
    
