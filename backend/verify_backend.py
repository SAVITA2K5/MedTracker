"""
Phase 2 Backend Verification Script
Run BEFORE starting the server to check all imports resolve correctly.

Usage:
  cd backend
  .\\venv\\Scripts\\python verify_backend.py
"""

import sys

def check(label, fn):
    try:
        fn()
        print(f"  ✅  {label}")
        return True
    except Exception as exc:
        print(f"  ❌  {label} → {exc}")
        return False


print("\n🔍 MEDTRACK Backend Verification")
print("=" * 46)

failures = 0

# Core
failures += 0 if check("Core config", lambda: __import__("app.core.config", fromlist=["settings"])) else 1
failures += 0 if check("Core security", lambda: __import__("app.core.security", fromlist=["hash_password"])) else 1
failures += 0 if check("Core dependencies", lambda: __import__("app.core.dependencies", fromlist=["get_current_user"])) else 1

# Models
failures += 0 if check("Model: User", lambda: __import__("app.models.user", fromlist=["User"])) else 1
failures += 0 if check("Model: HealthData", lambda: __import__("app.models.health_data", fromlist=["HealthData"])) else 1
failures += 0 if check("Model: EmergencyContact", lambda: __import__("app.models.emergency_contact", fromlist=["EmergencyContact"])) else 1

# Schemas
failures += 0 if check("Schema: user_schema", lambda: __import__("app.schemas.user_schema", fromlist=["UserCreate"])) else 1
failures += 0 if check("Schema: prediction_schema", lambda: __import__("app.schemas.prediction_schema", fromlist=["DiabetesInput"])) else 1
failures += 0 if check("Schema: sos_schema", lambda: __import__("app.schemas.sos_schema", fromlist=["SOSTrigger"])) else 1

# Services
failures += 0 if check("Service: user_service", lambda: __import__("app.services.user_service", fromlist=["create_user"])) else 1
failures += 0 if check("Service: prediction_service", lambda: __import__("app.services.prediction_service", fromlist=["predict_diabetes"])) else 1
failures += 0 if check("Service: explain_service", lambda: __import__("app.services.explain_service", fromlist=["explain_diabetes"])) else 1
failures += 0 if check("Service: recommendation_service", lambda: __import__("app.services.recommendation_service", fromlist=["get_recommendations"])) else 1
failures += 0 if check("Service: chatbot_service", lambda: __import__("app.services.chatbot_service", fromlist=["process_message"])) else 1
failures += 0 if check("Service: sos_service", lambda: __import__("app.services.sos_service", fromlist=["send_sos_alerts"])) else 1
failures += 0 if check("Service: health_data_service", lambda: __import__("app.services.health_data_service", fromlist=["save_health_record"])) else 1

# Routes
failures += 0 if check("Route: user_routes", lambda: __import__("app.routes.user_routes", fromlist=["router"])) else 1
failures += 0 if check("Route: prediction_routes", lambda: __import__("app.routes.prediction_routes", fromlist=["router"])) else 1
failures += 0 if check("Route: explain_routes", lambda: __import__("app.routes.explain_routes", fromlist=["router"])) else 1
failures += 0 if check("Route: recommendation_routes", lambda: __import__("app.routes.recommendation_routes", fromlist=["router"])) else 1
failures += 0 if check("Route: chatbot_routes", lambda: __import__("app.routes.chatbot_routes", fromlist=["router"])) else 1
failures += 0 if check("Route: sos_routes", lambda: __import__("app.routes.sos_routes", fromlist=["router"])) else 1

# Utils
failures += 0 if check("Utils: helpers", lambda: __import__("app.utils.helpers", fromlist=["compute_health_score"])) else 1

# Quick logic tests
def test_logic():
    from app.utils.helpers import compute_health_score, risk_label
    assert risk_label(0.1) == "Low"
    assert risk_label(0.5) == "Moderate"
    assert risk_label(0.9) == "High"
    assert compute_health_score(0.0, 0.0, 22) == 100.0

failures += 0 if check("Logic: helpers correctness", test_logic) else 1

def test_chatbot():
    from app.services.chatbot_service import process_message
    reply = process_message("Tell me about diabetes")
    assert "diabetes" in reply.lower() or "glucose" in reply.lower()

failures += 0 if check("Logic: chatbot intent match", test_chatbot) else 1

def test_recommendations():
    from app.services.recommendation_service import get_recommendations
    recs = get_recommendations("diabetes", "High")
    assert len(recs) > 0

failures += 0 if check("Logic: recommendations", test_recommendations) else 1

def test_heuristic_prediction():
    from app.services.prediction_service import predict_diabetes, predict_heart
    prob, label, score = predict_diabetes({"glucose": 180, "bmi": 33, "age": 50})
    assert 0 <= prob <= 1
    assert label in ("Low", "Moderate", "High")
    prob2, label2, score2 = predict_heart({"chol": 260, "trestbps": 150, "age": 58})
    assert 0 <= prob2 <= 1

failures += 0 if check("Logic: heuristic predictions", test_heuristic_prediction) else 1

print("=" * 46)
if failures == 0:
    print("🎉 All checks passed! Server is ready to start.")
    print("\nStart with:\n  .\\venv\\Scripts\\uvicorn app.main:app --reload")
else:
    print(f"💥 {failures} check(s) failed. Fix errors before starting the server.")
    sys.exit(1)
