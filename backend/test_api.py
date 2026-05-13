import sys
from pprint import pprint
import requests

BASE_URL = "http://127.0.0.1:8000"

# 1. Register user
print("1. Registering User...")
reg_resp = requests.post(
    f"{BASE_URL}/users/register",
    json={
        "full_name": "ML Test User",
        "email": "mltest@example.com",
        "password": "password123",
    }
)

if reg_resp.status_code == 400:
    # Already exists, just login
    print("User exists, logging in instead.")
    resp = requests.post(f"{BASE_URL}/users/login", json={
        "email": "mltest@example.com",
        "password": "password123"
    })
    token = resp.json()["access_token"]
elif reg_resp.status_code >= 400:
    print(f"Error registering: {reg_resp.text}")
    sys.exit(1)
else:
    token = reg_resp.json()["access_token"]

# 2. Call Predict Endpoint
print("\n2. Calling /predict/diabetes endpoint with new Model & SHAP...")
predict_resp = requests.post(
    f"{BASE_URL}/predict/diabetes",
    headers={"Authorization": f"Bearer {token}"},
    json={
        "pregnancies": 4,
        "glucose": 155,
        "blood_pressure": 82,
        "skin_thickness": 30,
        "insulin": 0,
        "bmi": 32.5,
        "diabetes_pedigree": 0.5,
        "age": 45
    }
)
if predict_resp.status_code == 200:
    data = predict_resp.json()
    print(f"\n✅ Prediction returned successfully.")
    print(f"Risk Label:  {data['risk_label']}")
    print(f"Algorithm:   RandomForest (scikit-learn)")
    print(f"Probability: {data['probability']}")
    print("\nSHAP Feature Importance (Model explanations):")
    for feat in data["shap_features"][:4]:
        print(f"  - {feat['feature']:<18}: {feat['shap_value']:>+.4f} ({feat['impact']})")
else:
    print(f"❌ Error: {predict_resp.text}")

# 3. Call Explain Endpoint
print("\n3. Calling /explain/ (Heart Disease)...")
explain_resp = requests.post(
    f"{BASE_URL}/explain/",
    headers={"Authorization": f"Bearer {token}"},
    json={
        "disease": "heart disease",
        "probability": 0.85,
        "features": {
            "age": 62, "sex": 1, "cp": 2, "trestbps": 150, "chol": 260, 
            "fbs": 0, "restecg": 1, "thalach": 120, "exang": 1, 
            "oldpeak": 2.5, "slope": 1, "ca": 2, "thal": 2
        }
    }
)
if explain_resp.status_code == 200:
    data = explain_resp.json()
    print(f"✅ Explain returned successfully from '{data['classifier_name']}'.")
    print(f"Summary: {data['summary']}")
    for feat in data["top_features"][:3]:
        print(f"  - {feat['feature']:<12}: {feat['shap_value']:>+.4f}")
else:
    print(f"❌ Error: {explain_resp.text}")

