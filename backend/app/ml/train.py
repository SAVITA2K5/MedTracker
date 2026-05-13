"""
MEDTRACK ML Training Script (Phase 3)
Generates realistic synthetic datasets (mirroring Pima Indians and UCI Heart cohorts)
and trains RandomForestClassifiers. Models are saved as .pkl for API usage.
"""

import os
import joblib
import numpy as np
import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score, classification_report

# ── Setup paths ───────────────────────────────────────────────
BASE_DIR = os.path.dirname(__file__)
MODELS_DIR = os.path.join(BASE_DIR, "models")
os.makedirs(MODELS_DIR, exist_ok=True)

DIABETES_MODEL_PATH = os.path.join(MODELS_DIR, "diabetes_model.pkl")
HEART_MODEL_PATH = os.path.join(MODELS_DIR, "heart_model.pkl")


# ── Diabetes Data & Training ──────────────────────────────────
DIABETES_FEATURES = [
    "pregnancies", "glucose", "blood_pressure", "skin_thickness",
    "insulin", "bmi", "diabetes_pedigree", "age",
]

def generate_diabetes_data(n=2000):
    """Generate realistic synthetic data inspired by the Pima Indians dataset."""
    np.random.seed(42)
    df = pd.DataFrame()
    df["pregnancies"] = np.random.randint(0, 15, n)
    df["glucose"] = np.random.normal(120, 30, n).clip(70, 200)
    df["blood_pressure"] = np.random.normal(70, 15, n).clip(40, 130)
    df["skin_thickness"] = np.random.normal(20, 10, n).clip(0, 60)
    df["insulin"] = np.random.normal(80, 50, n).clip(0, 400)
    df["bmi"] = np.random.normal(32, 7, n).clip(18, 55)
    df["diabetes_pedigree"] = np.random.normal(0.5, 0.3, n).clip(0.1, 2.5)
    df["age"] = np.random.randint(21, 80, n)
    
    # Target function (logistic logic)
    z = (
        (df["glucose"] - 120) * 0.05 +
        (df["bmi"] - 30) * 0.1 +
        (df["age"] - 45) * 0.04 +
        (df["pregnancies"]) * 0.1 +
        (df["diabetes_pedigree"] - 0.5) * 1.5 -
        2.5 # baseline offset
    )
    prob = 1 / (1 + np.exp(-z))
    df["target"] = (np.random.rand(n) < prob).astype(int)
    return df

def train_diabetes():
    print("🩸 Training Diabetes Classifier...")
    df = generate_diabetes_data()
    X = df[DIABETES_FEATURES]
    y = df["target"]
    
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    
    model = RandomForestClassifier(n_estimators=100, max_depth=6, random_state=42)
    model.fit(X_train, y_train)
    
    y_pred = model.predict(X_test)
    print(f"Accuracy: {accuracy_score(y_test, y_pred):.4f}")
    
    joblib.dump(model, DIABETES_MODEL_PATH)
    print(f"✅ Saved to {DIABETES_MODEL_PATH}\n")


# ── Heart Disease Data & Training ─────────────────────────────
HEART_FEATURES = [
    "age", "sex", "cp", "trestbps", "chol", "fbs",
    "restecg", "thalach", "exang", "oldpeak", "slope", "ca", "thal",
]

def generate_heart_data(n=2000):
    """Generate realistic synthetic data inspired by the UCI Heart dataset."""
    np.random.seed(123)
    df = pd.DataFrame()
    df["age"] = np.random.randint(30, 80, n)
    df["sex"] = np.random.randint(0, 2, n)
    df["cp"] = np.random.randint(0, 4, n)
    df["trestbps"] = np.random.normal(130, 20, n).clip(90, 200)
    df["chol"] = np.random.normal(240, 50, n).clip(120, 500)
    df["fbs"] = np.random.randint(0, 2, n)
    df["restecg"] = np.random.randint(0, 3, n)
    df["thalach"] = np.random.normal(150, 25, n).clip(70, 210)
    df["exang"] = np.random.randint(0, 2, n)
    df["oldpeak"] = np.random.exponential(1.0, n).clip(0, 6)
    df["slope"] = np.random.randint(0, 3, n)
    df["ca"] = np.random.randint(0, 5, n)
    df["thal"] = np.random.randint(0, 4, n)
    
    # Target function (logistic logic)
    z = (
        (df["age"] - 50) * 0.05 +
        (df["sex"] * 0.6) +
        (df["cp"] * 0.8) +          # Higher CP usually = more chest pain = higher risk in this synthetic logic
        (df["trestbps"] - 130) * 0.02 +
        (df["chol"] - 200) * 0.01 +
        ((200 - df["thalach"]) * 0.03) + # lower max heart rate = higher risk
        (df["exang"] * 1.5) +
        (df["oldpeak"] * 0.8) +
        (df["ca"] * 0.8) +
        (df["thal"] * 0.5) -
        6.0 # baseline offset
    )
    prob = 1 / (1 + np.exp(-z))
    df["target"] = (np.random.rand(n) < prob).astype(int)
    return df

def train_heart():
    print("❤️  Training Heart Disease Classifier...")
    df = generate_heart_data()
    X = df[HEART_FEATURES]
    y = df["target"]
    
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    
    model = RandomForestClassifier(n_estimators=100, max_depth=6, random_state=42)
    model.fit(X_train, y_train)
    
    y_pred = model.predict(X_test)
    print(f"Accuracy: {accuracy_score(y_test, y_pred):.4f}")
    
    joblib.dump(model, HEART_MODEL_PATH)
    print(f"✅ Saved to {HEART_MODEL_PATH}\n")


if __name__ == "__main__":
    print(f"Initializing Phase 3 Model Training...\n")
    train_diabetes()
    train_heart()
    print("🎉 Phase 3 Training Complete. Models are ready for the API.")
