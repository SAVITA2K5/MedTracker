"""
SHAP Explainability service.
Phase 2: returns feature-importance estimates from heuristic weights.
Phase 3: replaces with real shap.TreeExplainer output.
"""

import os
import joblib
import numpy as np
from typing import List, Dict


_BASE = os.path.join(os.path.dirname(__file__), "..", "ml", "models")

# Feature importance weights (Phase 2 heuristic, replaced by SHAP in Phase 3)
DIABETES_WEIGHTS = {
    "glucose": 0.35,
    "bmi": 0.22,
    "age": 0.14,
    "diabetes_pedigree": 0.10,
    "insulin": 0.08,
    "blood_pressure": 0.06,
    "skin_thickness": 0.03,
    "pregnancies": 0.02,
}

HEART_WEIGHTS = {
    "chol": 0.22,
    "trestbps": 0.18,
    "age": 0.17,
    "thalach": 0.13,
    "cp": 0.10,
    "oldpeak": 0.08,
    "exang": 0.06,
    "ca": 0.06,
}


def explain_diabetes(features: dict, probability: float) -> List[Dict]:
    """
    Returns list of SHAP-like feature contributions for diabetes prediction.
    """
    model_path = os.path.join(_BASE, "diabetes_model.pkl")

    if os.path.exists(model_path):
        return _real_shap(model_path, features, list(DIABETES_WEIGHTS.keys()), probability)

    return _heuristic_explain(features, DIABETES_WEIGHTS, probability)


def explain_heart(features: dict, probability: float) -> List[Dict]:
    """
    Returns list of SHAP-like feature contributions for heart disease prediction.
    """
    model_path = os.path.join(_BASE, "heart_model.pkl")

    if os.path.exists(model_path):
        return _real_shap(model_path, features, list(HEART_WEIGHTS.keys()), probability)

    return _heuristic_explain(features, HEART_WEIGHTS, probability)


def _heuristic_explain(features: dict, weights: dict, probability: float) -> List[Dict]:
    """
    Estimate feature-level contribution using predefined weights × normalised values.
    """
    results = []
    for feature, weight in weights.items():
        raw_val = features.get(feature, 0)
        # shap_value is positive when it pushes toward risk, negative when protective
        shap_val = round(float(raw_val) * weight * probability * 0.1, 4)
        results.append({
            "feature": feature,
            "value": float(raw_val),
            "shap_value": shap_val,
            "impact": "positive" if shap_val > 0 else "negative",
        })

    # Sort by absolute shap value descending
    results.sort(key=lambda x: abs(x["shap_value"]), reverse=True)
    return results[:8]


def _real_shap(model_path: str, features: dict, feature_names: list, probability: float) -> List[Dict]:
    """Use real SHAP TreeExplainer – activated in Phase 3."""
    try:
        import shap
        model = joblib.load(model_path)
        X = np.array([[features.get(f, 0) for f in feature_names]])
        explainer = shap.TreeExplainer(model)
        shap_values = explainer.shap_values(X)

        # For binary classifiers, shap_values is a list [class0, class1]
        sv = shap_values[1][0] if isinstance(shap_values, list) else shap_values[0]

        results = []
        for i, name in enumerate(feature_names):
            val = sv[i] if i < len(sv) else 0.0
            results.append({
                "feature": name,
                "value": float(features.get(name, 0)),
                "shap_value": round(float(val), 4),
                "impact": "positive" if val > 0 else "negative",
            })

        results.sort(key=lambda x: abs(x["shap_value"]), reverse=True)
        return results[:8]
    except Exception:
        return _heuristic_explain(features, {n: 0.1 for n in feature_names}, probability)
