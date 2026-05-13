"""
Recommendation routes – /recommendations/
Returns personalised health recommendations by disease and risk level.
"""

from fastapi import APIRouter, Depends
from app.core.dependencies import get_current_user
from app.models.user import User
from app.services.recommendation_service import get_recommendations
from app.schemas.prediction_schema import RecommendationRequest, RecommendationResponse

router = APIRouter(prefix="/recommendations", tags=["Recommendations"])


@router.post(
    "/",
    response_model=RecommendationResponse,
    summary="Get personalised health recommendations",
)
def recommend(
    payload: RecommendationRequest,
    current_user: User = Depends(get_current_user),
):
    recs = get_recommendations(payload.disease, payload.risk_level)
    return RecommendationResponse(
        disease=payload.disease,
        risk_level=payload.risk_level,
        recommendations=recs,
    )


@router.get(
    "/{disease}/{risk_level}",
    response_model=RecommendationResponse,
    summary="Get recommendations via URL params (for quick lookup)",
)
def recommend_by_params(
    disease: str,
    risk_level: str,
    current_user: User = Depends(get_current_user),
):
    recs = get_recommendations(disease, risk_level)
    return RecommendationResponse(
        disease=disease,
        risk_level=risk_level,
        recommendations=recs,
    )
