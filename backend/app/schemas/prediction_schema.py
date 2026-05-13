"""Pydantic schemas – Prediction (Phase 2 final)"""

from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime


# ── Input schemas ─────────────────────────────────────────────
class DiabetesInput(BaseModel):
    pregnancies: int = Field(default=0, ge=0, le=20)
    glucose: float = Field(..., ge=0, le=500, description="Plasma glucose (mg/dL)")
    blood_pressure: float = Field(..., ge=0, le=200, description="Diastolic BP (mmHg)")
    skin_thickness: float = Field(default=0.0, ge=0, le=100)
    insulin: float = Field(default=0.0, ge=0, le=900)
    bmi: float = Field(..., ge=0, le=100, description="Body Mass Index")
    diabetes_pedigree: float = Field(default=0.5, ge=0, le=3.0)
    age: int = Field(..., ge=1, le=120)

    class Config:
        json_schema_extra = {
            "example": {
                "pregnancies": 2,
                "glucose": 138,
                "blood_pressure": 80,
                "skin_thickness": 28,
                "insulin": 0,
                "bmi": 32.5,
                "diabetes_pedigree": 0.627,
                "age": 45,
            }
        }


class HeartInput(BaseModel):
    age: int = Field(..., ge=1, le=120)
    sex: int = Field(..., ge=0, le=1, description="0=Female, 1=Male")
    cp: int = Field(..., ge=0, le=3, description="Chest pain type (0-3)")
    trestbps: float = Field(..., ge=0, le=250, description="Resting BP (mmHg)")
    chol: float = Field(..., ge=0, le=600, description="Cholesterol (mg/dL)")
    fbs: int = Field(..., ge=0, le=1, description="Fasting blood sugar >120? (0/1)")
    restecg: int = Field(..., ge=0, le=2, description="Resting ECG (0-2)")
    thalach: float = Field(..., ge=0, le=250, description="Max heart rate achieved")
    exang: int = Field(..., ge=0, le=1, description="Exercise-induced angina (0/1)")
    oldpeak: float = Field(default=0.0, ge=0, le=10, description="ST depression")
    slope: int = Field(..., ge=0, le=2, description="Slope of peak ST (0-2)")
    ca: int = Field(..., ge=0, le=4, description="# major vessels (0-4)")
    thal: int = Field(..., ge=0, le=3, description="Thalassemia type (0-3)")

    class Config:
        json_schema_extra = {
            "example": {
                "age": 52, "sex": 1, "cp": 0, "trestbps": 140,
                "chol": 245, "fbs": 0, "restecg": 0, "thalach": 150,
                "exang": 0, "oldpeak": 2.3, "slope": 1, "ca": 0, "thal": 2,
            }
        }


# ── Output schemas ────────────────────────────────────────────
class ShapFeature(BaseModel):
    feature: str
    value: float
    shap_value: float
    impact: str  # "positive" | "negative"


class PredictionResult(BaseModel):
    disease: str
    risk_score: float       # probability 0.0 – 1.0
    risk_label: str         # "Low" | "Moderate" | "High"
    probability: float
    health_score: float     # 0 – 100
    shap_features: List[ShapFeature]
    recommendations: List[str]


# ── Health history ────────────────────────────────────────────
class HealthRecordOut(BaseModel):
    id: int
    user_id: int
    age: Optional[int] = None
    bmi: Optional[float] = None
    diabetes_risk: Optional[float] = None
    heart_risk: Optional[float] = None
    health_score: Optional[float] = None
    recorded_at: datetime

    class Config:
        from_attributes = True


# ── Recommendation request ────────────────────────────────────
class RecommendationRequest(BaseModel):
    disease: str
    risk_level: str

    class Config:
        json_schema_extra = {
            "example": {"disease": "diabetes", "risk_level": "Moderate"}
        }


class RecommendationResponse(BaseModel):
    disease: str
    risk_level: str
    recommendations: List[str]
