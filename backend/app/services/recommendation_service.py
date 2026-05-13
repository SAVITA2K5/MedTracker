"""
Recommendation service – evidence-based, risk-level-driven health recommendations.
Supports both Diabetes and Heart Disease across Low / Moderate / High risk levels.
"""

from typing import List


RECOMMENDATIONS = {
    "diabetes": {
        "Low": [
            "✅ Maintain a diet low in refined sugars and processed carbohydrates.",
            "🏃 Exercise at least 30 minutes, 5 days per week (walking, cycling, swimming).",
            "💧 Stay well-hydrated – aim for 8 glasses of water daily.",
            "🩺 Schedule an annual blood sugar check even if you feel healthy.",
            "😴 Prioritise 7–8 hours of sleep to regulate insulin sensitivity.",
        ],
        "Moderate": [
            "⚠️ Reduce carbohydrate intake and increase dietary fiber (vegetables, whole grains).",
            "🥗 Consult a registered dietitian for a personalised meal plan.",
            "📊 Monitor fasting blood sugar at home every 2 weeks.",
            "🏋️ Add resistance training (weights/bands) 2× per week.",
            "⚖️ Aim to reduce body weight by 5–7% if you are overweight.",
            "🧘 Manage stress with mindfulness – cortisol raises blood glucose.",
        ],
        "High": [
            "🚨 See your doctor immediately for a formal diabetes assessment (HbA1c test).",
            "💊 Discuss medication or insulin therapy with your healthcare provider.",
            "🥦 Adopt the Diabetes Plate Method – ½ non-starchy veg, ¼ lean protein, ¼ complex carbs.",
            "📱 Self-monitor blood glucose at least twice daily as directed.",
            "🚭 Quit smoking – it significantly worsens insulin resistance.",
            "👣 Check your feet daily for sores or numbness (peripheral neuropathy risk).",
            "❤️ Get your blood pressure and cholesterol checked – diabetes raises cardiovascular risk.",
        ],
    },
    "heart_disease": {
        "Low": [
            "✅ Follow a heart-healthy diet (Mediterranean or DASH diet).",
            "🚭 Avoid tobacco and limit alcohol to ≤1 drink/day.",
            "🏃 Get 150 minutes of moderate aerobic activity weekly.",
            "🩺 Annual cholesterol and blood-pressure checks.",
            "😴 Prioritise quality sleep – poor sleep raises cardiovascular risk.",
        ],
        "Moderate": [
            "⚠️ Monitor blood pressure at home every week – target below 130/80 mmHg.",
            "🥗 Limit saturated fats (<7% of daily calories), trans fats, and sodium (<2,300 mg/day).",
            "🏊 Start a supervised cardio fitness programme (walking, swimming).",
            "💊 Discuss statin therapy with your doctor if cholesterol >200 mg/dL.",
            "🧘 Practice stress-reduction techniques – chronic stress raises cortisol and BP.",
            "⚖️ Maintain a healthy BMI (18.5–24.9) to reduce cardiac workload.",
        ],
        "High": [
            "🚨 Seek an immediate cardiac evaluation – stress test, ECG, or echocardiogram.",
            "💊 Take all prescribed medications (antihypertensives, statins, aspirin) consistently.",
            "🏥 Enrol in a supervised cardiac rehabilitation programme.",
            "🥒 Adopt a strict low-sodium, low-fat diet; avoid processed and fast foods.",
            "🚫 Avoid strenuous activity until cleared by a cardiologist.",
            "📱 Keep emergency contacts and our SOS feature activated.",
            "🩺 Schedule follow-up appointments at least once every 3 months.",
        ],
    },
}


def get_recommendations(disease: str, risk_level: str) -> List[str]:
    """
    Return a list of actionable health recommendations.

    Args:
        disease:    "diabetes" | "heart_disease"
        risk_level: "Low" | "Moderate" | "High"

    Returns:
        List of recommendation strings.
    """
    disease_key = disease.lower().replace(" ", "_")
    tips = RECOMMENDATIONS.get(disease_key, {}).get(risk_level, [])
    if not tips:
        return [
            "Consult your healthcare provider for personalised advice.",
            "Maintain a balanced diet and regular physical activity.",
            "Schedule routine health check-ups.",
        ]
    return tips
