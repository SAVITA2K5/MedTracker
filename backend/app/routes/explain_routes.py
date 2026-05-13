"""
Explainability routes – /explain/diabetes and /explain/heart.
Returns SHAP-based (or heuristic) feature contributions.
"""

from fastapi import APIRouter, Depends
from pydantic import BaseModel
from typing import List, Dict

from app.core.dependencies import get_current_user
from app.models.user import User
from app.services import explain_service

router = APIRouter(prefix="/explain", tags=["Explainability"])


class ExplainRequest(BaseModel):
    disease: str   # "diabetes" | "heart_disease"
    features: Dict
    probability: float = 0.5

    class Config:
        json_schema_extra = {
            "example": {
                "disease": "diabetes",
                "features": {"glucose": 140, "bmi": 32.0, "age": 45},
                "probability": 0.68,
            }
        }


class ExplainResponse(BaseModel):
    disease: str
    top_features: List[Dict]
    classifier_name: str      # renamed from model_type (Pydantic v2 namespace conflict)
    summary: str


@router.post(
    "/",
    response_model=ExplainResponse,
    summary="Get feature-level explanation for a prediction",
)
def explain(
    payload: ExplainRequest,
    current_user: User = Depends(get_current_user),
):
    disease_clean = payload.disease.lower().replace(" ", "_")

    if disease_clean == "diabetes":
        features = explain_service.explain_diabetes(payload.features, payload.probability)
        classifier_name = "Diabetes Classifier"
    else:
        features = explain_service.explain_heart(payload.features, payload.probability)
        classifier_name = "Heart Disease Classifier"

    top = features[:5]

    summary = (
        f"The top contributing factor is **{top[0]['feature']}** "
        f"(impact: {top[0]['impact']})." if top else "No significant factors identified."
    )

    return ExplainResponse(
        disease=payload.disease,
        top_features=features,
        classifier_name=classifier_name,
        summary=summary,
    )
