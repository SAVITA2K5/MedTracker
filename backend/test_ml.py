"""
Phase 3 ML Verification
Tests that the API's predict and explain services correctly load the .pkl files
and use SHAP TreeExplainer for feature importance.
"""

import sys
import unittest
sys.path.append("C:/Users/Asus/Desktop/MedTracker/backend")

from app.services.prediction_service import predict_diabetes, predict_heart
from app.services.explain_service import explain_diabetes, explain_heart

class TestML(unittest.TestCase):
    def test_predict_and_explain_diabetes(self):
        # High risk features
        features = {
            "pregnancies": 3,
            "glucose": 180,
            "blood_pressure": 90,
            "skin_thickness": 35,
            "insulin": 200,
            "bmi": 36.5,
            "diabetes_pedigree": 1.2,
            "age": 55,
        }
        
        prob, label, risk_score = predict_diabetes(features)
        print(f"\n🩸 Diabetes Prediction:")
        print(f"  Probability: {prob:.4f}")
        print(f"  Risk Label:  {label}")
        
        explanations = explain_diabetes(features, prob)
        print(f"  Top SHAP Features:")
        for ex in explanations[:3]:
            print(f"    - {ex['feature']}: {ex['shap_value']:.4f} ({ex['impact']})")
            
        self.assertTrue(0 <= prob <= 1)
        self.assertTrue(len(explanations) > 0)
        
    def test_predict_and_explain_heart(self):
        # Moderate risk features
        features = {
            "age": 60,
            "sex": 1,
            "cp": 2,
            "trestbps": 140,
            "chol": 240,
            "fbs": 0,
            "restecg": 1,
            "thalach": 145,
            "exang": 1,
            "oldpeak": 2.2,
            "slope": 1,
            "ca": 1,
            "thal": 2,
        }
        
        prob, label, risk_score = predict_heart(features)
        print(f"\n❤️  Heart Disease Prediction:")
        print(f"  Probability: {prob:.4f}")
        print(f"  Risk Label:  {label}")
        
        explanations = explain_heart(features, prob)
        print(f"  Top SHAP Features:")
        for ex in explanations[:3]:
            print(f"    - {ex['feature']}: {ex['shap_value']:.4f} ({ex['impact']})")
            
        self.assertTrue(0 <= prob <= 1)
        self.assertTrue(len(explanations) > 0)

if __name__ == "__main__":
    unittest.main(verbosity=2)
