"""General utility helpers (Phase 2 final)"""

from typing import Optional


def compute_health_score(
    diabetes_risk: float = 0.0,
    heart_risk: float = 0.0,
    bmi: Optional[float] = None,
) -> float:
    """
    Compute gamified health score (0-100). Higher = healthier.

    Weighting:
      - Diabetes risk: -30 points max
      - Heart risk:    -30 points max
      - BMI penalty:   -10 points if outside normal range
    """
    base = 100.0
    penalty = (diabetes_risk * 30.0) + (heart_risk * 30.0)

    if bmi is not None:
        if bmi < 18.5:
            penalty += 8.0     # Underweight
        elif bmi >= 35:
            penalty += 10.0    # Obese class II+
        elif bmi >= 30:
            penalty += 6.0     # Obese class I
        elif bmi >= 25:
            penalty += 3.0     # Overweight

    score = max(0.0, base - penalty)
    return round(score, 1)


def risk_label(probability: float) -> str:
    """Convert 0-1 probability to human-readable risk label."""
    if probability < 0.33:
        return "Low"
    elif probability < 0.66:
        return "Moderate"
    return "High"


def risk_color(label: str) -> str:
    """Hex color for a given risk label."""
    return {"Low": "#00C853", "Moderate": "#FFD740", "High": "#FF1744"}.get(label, "#1E90FF")


def format_phone(phone: str) -> str:
    """Normalise a phone number string for Twilio."""
    cleaned = "".join(c for c in phone if c.isdigit() or c == "+")
    if not cleaned.startswith("+"):
        cleaned = "+" + cleaned
    return cleaned
