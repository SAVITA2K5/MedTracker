"""
Prediction service – loads ML models (lazy), runs inference, computes risk labels.
Falls back gracefully when model .pkl files are not yet trained (Phase 3).
"""

import os
import joblib
import numpy as np
from typing import Tuple

from app.utils.helpers import compute_health_score, risk_label

# ── Model paths ───────────────────────────────────────────────
_BASE = os.path.join(os.path.dirname(__file__), "..", "ml", "models")
_DIABETES_PATH = os.path.join(_BASE, "diabetes_model.pkl")
_HEART_PATH = os.path.join(_BASE, "heart_model.pkl")

# ── Lazy-loaded model cache ────────────────────────────────────
_diabetes_model = None
_heart_model = None


def _load_diabetes():
    global _diabetes_model
    if _diabetes_model is None and os.path.exists(_DIABETES_PATH):
        _diabetes_model = joblib.load(_DIABETES_PATH)
    return _diabetes_model


def _load_heart():
    global _heart_model
    if _heart_model is None and os.path.exists(_HEART_PATH):
        _heart_model = joblib.load(_HEART_PATH)
    return _heart_model


# ── Feature ordering (must match training order) ──────────────
DIABETES_FEATURES = [
    "pregnancies", "glucose", "blood_pressure", "skin_thickness",
    "insulin", "bmi", "diabetes_pedigree", "age",
]

HEART_FEATURES = [
    "age", "sex", "cp", "trestbps", "chol", "fbs",
    "restecg", "thalach", "exang", "oldpeak", "slope", "ca", "thal",
]


def predict_diabetes(features: dict) -> Tuple[float, str, float]:
    """
    Returns (probability, risk_label, risk_score).
    Falls back to a heuristic if model not yet trained.
    """
    model = _load_diabetes()

    if model is not None:
        X = np.array([[features.get(f, 0) for f in DIABETES_FEATURES]])
        prob = float(model.predict_proba(X)[0][1])
    else:
        # Heuristic fallback based on glucose + BMI
        glucose = features.get("glucose", 100)
        bmi = features.get("bmi", 22)
        age = features.get("age", 30)
        prob = _diabetes_heuristic(glucose, bmi, age)

    label = risk_label(prob)
    score = compute_health_score(diabetes_risk=prob, heart_risk=0.0, bmi=features.get("bmi"))
    return round(prob, 4), label, round(prob, 4)


def predict_heart(features: dict) -> Tuple[float, str, float]:
    """
    Returns (probability, risk_label, risk_score).
    Falls back to a heuristic if model not yet trained.
    """
    model = _load_heart()

    if model is not None:
        X = np.array([[features.get(f, 0) for f in HEART_FEATURES]])
        prob = float(model.predict_proba(X)[0][1])
    else:
        chol = features.get("chol", 200)
        trestbps = features.get("trestbps", 120)
        age = features.get("age", 40)
        prob = _heart_heuristic(chol, trestbps, age)

    label = risk_label(prob)
    score = compute_health_score(diabetes_risk=0.0, heart_risk=prob)
    return round(prob, 4), label, round(prob, 4)


# ── Heuristics (used before Phase 3 trains real models) ───────

def _diabetes_heuristic(glucose: float, bmi: float, age: int) -> float:
    """Simple evidence-based scoring for demonstration."""
    score = 0.0
    if glucose > 140: score += 0.35
    elif glucose > 110: score += 0.15
    if bmi > 30: score += 0.25
    elif bmi > 25: score += 0.10
    if age > 50: score += 0.15
    elif age > 35: score += 0.07
    return min(score, 0.99)


def _heart_heuristic(chol: float, bp: float, age: int) -> float:
    score = 0.0
    if chol > 240: score += 0.30
    elif chol > 200: score += 0.12
    if bp > 140: score += 0.25
    elif bp > 120: score += 0.10
    if age > 55: score += 0.20
    elif age > 40: score += 0.08
    return min(score, 0.99)
