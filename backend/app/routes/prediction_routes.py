"""
Prediction routes – /predict/diabetes and /predict/heart.
Phase 2: calls prediction_service + explain_service + recommendation_service,
         saves result to health_data table, returns full PredictionResult.
"""

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.dependencies import get_current_user
from app.models.user import User
from app.schemas.prediction_schema import (
    DiabetesInput, HeartInput, PredictionResult, ShapFeature,
    HealthRecordOut, RecommendationRequest, RecommendationResponse,
)
from app.services import prediction_service, explain_service, recommendation_service
from app.services.health_data_service import save_health_record, get_user_health_history
from app.utils.helpers import compute_health_score

router = APIRouter(prefix="/predict", tags=["Prediction"])


@router.post(
    "/diabetes",
    response_model=PredictionResult,
    summary="Predict diabetes risk with SHAP explanation",
)
def predict_diabetes(
    payload: DiabetesInput,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    features = payload.model_dump()

    # 1. Run prediction
    probability, label, risk_score = prediction_service.predict_diabetes(features)

    # 2. Generate SHAP (or heuristic) explanation
    raw_shap = explain_service.explain_diabetes(features, probability)
    shap_features = [ShapFeature(**s) for s in raw_shap]

    # 3. Get recommendations
    recs = recommendation_service.get_recommendations("diabetes", label)

    # 4. Compute gamified health score
    health_score = compute_health_score(
        diabetes_risk=probability, heart_risk=0.0, bmi=features.get("bmi")
    )

    # 5. Persist to DB
    save_health_record(db, current_user.id, {
        "age": features.get("age"),
        "bmi": features.get("bmi"),
        "glucose": features.get("glucose"),
        "insulin": features.get("insulin"),
        "skin_thickness": features.get("skin_thickness"),
        "diabetes_pedigree": features.get("diabetes_pedigree"),
        "pregnancies": features.get("pregnancies"),
        "blood_pressure_diastolic": features.get("blood_pressure"),
        "diabetes_risk": probability,
        "health_score": health_score,
    })

    return PredictionResult(
        disease="diabetes",
        risk_score=risk_score,
        risk_label=label,
        probability=probability,
        health_score=health_score,
        shap_features=shap_features,
        recommendations=recs,
    )


@router.post(
    "/heart",
    response_model=PredictionResult,
    summary="Predict heart disease risk with SHAP explanation",
)
def predict_heart(
    payload: HeartInput,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    features = payload.model_dump()

    # 1. Run prediction
    probability, label, risk_score = prediction_service.predict_heart(features)

    # 2. SHAP explanation
    raw_shap = explain_service.explain_heart(features, probability)
    shap_features = [ShapFeature(**s) for s in raw_shap]

    # 3. Recommendations
    recs = recommendation_service.get_recommendations("heart_disease", label)

    # 4. Health score
    health_score = compute_health_score(diabetes_risk=0.0, heart_risk=probability)

    # 5. Persist
    save_health_record(db, current_user.id, {
        "age": features.get("age"),
        "cholesterol": features.get("chol"),
        "blood_pressure_systolic": features.get("trestbps"),
        "max_heart_rate": features.get("thalach"),
        "chest_pain_type": features.get("cp"),
        "exercise_angina": features.get("exang"),
        "st_depression": features.get("oldpeak"),
        "fasting_blood_sugar": features.get("fbs"),
        "resting_ecg": features.get("restecg"),
        "slope": features.get("slope"),
        "ca": features.get("ca"),
        "thal": features.get("thal"),
        "heart_risk": probability,
        "health_score": health_score,
    })

    return PredictionResult(
        disease="heart_disease",
        risk_score=risk_score,
        risk_label=label,
        probability=probability,
        health_score=health_score,
        shap_features=shap_features,
        recommendations=recs,
    )


@router.get(
    "/history",
    response_model=list[HealthRecordOut],
    summary="Get current user's prediction history",
)
def get_history(
    limit: int = 10,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return get_user_health_history(db, current_user.id, limit=limit)
