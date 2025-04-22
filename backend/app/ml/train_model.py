import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.naive_bayes import MultinomialNB
from sklearn.preprocessing import LabelEncoder
from sklearn.pipeline import Pipeline
import joblib

# Load your dataset
df = pd.read_csv("C:\\Users\\krishna.sevada_jadeg\\Desktop\\jade_repo\\Intelligent project\\back\\data.csv")

# Use relevant columns and drop rows with missing values
df = df[["subject", "description", "priority", "category"]].dropna()

# Combine subject + description + priority into one input text
df["text"] = df["subject"] + " " + df["description"] + " " + df["priority"]

# Encode the category labels
label_encoder = LabelEncoder()
df["category_encoded"] = label_encoder.fit_transform(df["category"])

# Train-test split
X_train, X_test, y_train, y_test = train_test_split(
    df["text"], df["category_encoded"], test_size=0.2, random_state=42
)

# Build pipeline: TF-IDF + Naive Bayes
model = Pipeline([
    ("tfidf", TfidfVectorizer()),
    ("clf", MultinomialNB())
])

# Train the model
model.fit(X_train, y_train)

# Evaluate (optional)
accuracy = model.score(X_test, y_test)
print(f"✅ Model trained with accuracy: {accuracy * 100:.2f}%")

# Save model and label encoder
joblib.dump(model, "ai_model.pkl")
joblib.dump(label_encoder, "label_encoder.pkl")

print("🎉 Model and label encoder saved successfully.")
