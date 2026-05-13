"""ML stub – explain.py (Phase 3 adds real SHAP explainer)"""


def explain_prediction(model, features: dict, feature_names: list) -> list:
    """
    Placeholder: returns empty SHAP values.
    Phase 3 instantiates shap.TreeExplainer and computes real values.
    """
    return [
        {"feature": name, "shap_value": 0.0, "impact": "neutral"}
        for name in feature_names
    ]
