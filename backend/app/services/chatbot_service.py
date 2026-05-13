"""
Chatbot service – intent-driven health assistant.
Phase 2: rule-based NLP with contextual templates.
Phase 6: replaced by LLM (OpenAI GPT-4 / Gemini).
"""

import re
from typing import Optional

# ── Intent → keyword patterns ─────────────────────────────────
INTENTS = [
    {
        "name": "greeting",
        "patterns": [r"\bhello\b", r"\bhi\b", r"\bhey\b", r"\bgreetings\b"],
        "response": (
            "Hello! 👋 I'm **MedAI**, your personal health assistant powered by AI.\n\n"
            "I can help you understand:\n"
            "• 🩸 Diabetes risk and prevention\n"
            "• ❤️ Heart disease risk factors\n"
            "• 📊 Your health score\n"
            "• 🚨 Emergency SOS usage\n\n"
            "What would you like to know today?"
        ),
    },
    {
        "name": "diabetes",
        "patterns": [r"\bdiabetes\b", r"\bblood sugar\b", r"\bglucose\b", r"\binsulin\b"],
        "response": (
            "🩸 **Diabetes Risk Factors:**\n\n"
            "Key risk factors include:\n"
            "• High fasting glucose (>126 mg/dL)\n"
            "• BMI over 30 (obesity)\n"
            "• Family history of diabetes\n"
            "• Age over 45\n"
            "• Sedentary lifestyle\n\n"
            "💡 **Tip:** Use the **Predict** tab to run your personalised AI diabetes risk assessment!"
        ),
    },
    {
        "name": "heart_disease",
        "patterns": [r"\bheart\b", r"\bcardiac\b", r"\bcholesterol\b", r"\bblood pressure\b", r"\bchest pain\b"],
        "response": (
            "❤️ **Heart Disease Risk Factors:**\n\n"
            "• High cholesterol (>240 mg/dL)\n"
            "• High blood pressure (>140/90 mmHg)\n"
            "• Smoking and alcohol use\n"
            "• Physical inactivity\n"
            "• Stress and poor sleep\n\n"
            "💡 **Tip:** Go to **Predict → Heart Disease** for a full AI risk evaluation with explainable results."
        ),
    },
    {
        "name": "health_score",
        "patterns": [r"\bhealth score\b", r"\bwellness\b", r"\bscore\b"],
        "response": (
            "📊 **Your Health Score (0–100):**\n\n"
            "Your score is calculated from:\n"
            "• Predicted diabetes risk (30% weight)\n"
            "• Predicted heart disease risk (30% weight)\n"
            "• BMI status (10% weight)\n\n"
            "**Score guide:**\n"
            "• 80–100 → 🟢 Excellent\n"
            "• 60–79 → 🟡 Good\n"
            "• 40–59 → 🟠 Fair\n"
            "• 0–39 → 🔴 Poor – take action!\n\n"
            "Run predictions regularly to keep your score updated."
        ),
    },
    {
        "name": "sos",
        "patterns": [r"\bsos\b", r"\bemergency\b", r"\bhelp\b", r"\bcall\b", r"\bcontact\b"],
        "response": (
            "🚨 **Emergency SOS:**\n\n"
            "MEDTRACK's SOS feature:\n"
            "1. Go to the **SOS** tab\n"
            "2. Add emergency contacts (name + phone)\n"
            "3. Press the red **SOS** button to instantly alert them\n\n"
            "Your GPS location is automatically sent.\n\n"
            "⚠️ **For life-threatening emergencies, always call 112 (emergency services) first!**"
        ),
    },
    {
        "name": "bmi",
        "patterns": [r"\bbmi\b", r"\bweight\b", r"\bobese\b", r"\boverweight\b"],
        "response": (
            "⚖️ **BMI (Body Mass Index) Guide:**\n\n"
            "• < 18.5 → Underweight\n"
            "• 18.5 – 24.9 → ✅ Normal\n"
            "• 25 – 29.9 → ⚠️ Overweight\n"
            "• ≥ 30 → 🔴 Obese\n\n"
            "**Formula:** BMI = weight(kg) / height(m)²\n\n"
            "A healthy BMI significantly reduces risk of both diabetes and heart disease."
        ),
    },
    {
        "name": "symptoms",
        "patterns": [r"\bsymptom\b", r"\bfeel\b", r"\bpain\b", r"\btired\b", r"\bfatigue\b", r"\bdizzy\b"],
        "response": (
            "🩺 **Common Warning Signs to Watch:**\n\n"
            "**Diabetes:**\n"
            "• Frequent urination, excessive thirst\n"
            "• Blurred vision, unexplained fatigue\n"
            "• Slow-healing wounds\n\n"
            "**Heart Disease:**\n"
            "• Chest tightness or pain\n"
            "• Shortness of breath\n"
            "• Pain radiating to arm or jaw\n\n"
            "⚠️ If experiencing chest pain, call emergency services immediately!"
        ),
    },
    {
        "name": "diet",
        "patterns": [r"\bdiet\b", r"\beat\b", r"\bfood\b", r"\bnutrition\b", r"\bmeal\b"],
        "response": (
            "🥗 **Heart & Diabetes-Friendly Diet Tips:**\n\n"
            "✅ **Eat more:**\n"
            "• Leafy greens (spinach, kale)\n"
            "• Whole grains (oats, quinoa, brown rice)\n"
            "• Lean protein (fish, chicken, legumes)\n"
            "• Healthy fats (avocado, nuts, olive oil)\n\n"
            "❌ **Reduce:**\n"
            "• Refined sugars and white bread\n"
            "• Processed/packaged foods\n"
            "• Excess sodium and saturated fats\n"
            "• Sugary drinks and alcohol"
        ),
    },
    {
        "name": "exercise",
        "patterns": [r"\bexercise\b", r"\bworkout\b", r"\bactive\b", r"\bwalk\b", r"\brun\b", r"\bfitness\b"],
        "response": (
            "🏃 **Exercise Recommendations:**\n\n"
            "**WHO Guidelines:**\n"
            "• 150 min/week moderate activity (brisk walking)\n"
            "• OR 75 min/week vigorous (jogging, cycling)\n"
            "• Strength training 2× per week\n\n"
            "**Benefits:**\n"
            "• Lowers blood glucose by 20–30%\n"
            "• Reduces LDL cholesterol\n"
            "• Lowers resting blood pressure\n"
            "• Improves insulin sensitivity\n\n"
            "Start small – even a 10-min walk after meals helps!"
        ),
    },
    {
        "name": "prediction",
        "patterns": [r"\bpredict\b", r"\brisk\b", r"\bassess\b", r"\btest\b", r"\bcheck\b"],
        "response": (
            "🔬 **How AI Predictions Work:**\n\n"
            "MEDTRACK uses machine learning models trained on:\n"
            "• 📊 Pima Indians Diabetes Dataset\n"
            "• 🫀 UCI Heart Disease Dataset\n\n"
            "**Steps:**\n"
            "1. Enter your health metrics in the **Predict** tab\n"
            "2. Our AI analyses your data in seconds\n"
            "3. You get a risk score + SHAP explanation\n"
            "4. Personalised recommendations are generated\n\n"
            "Results are **not a medical diagnosis** – always consult a doctor."
        ),
    },
]

FALLBACK = (
    "🤔 I didn't quite understand that. I can help you with:\n\n"
    "• **Diabetes** – risk factors and prevention\n"
    "• **Heart disease** – symptoms and lifestyle tips\n"
    "• **Health score** – what it means\n"
    "• **Diet & exercise** – healthy habits\n"
    "• **SOS** – emergency features\n"
    "• **Predictions** – how AI assessments work\n\n"
    "Try asking: *'What is diabetes?'* or *'How do I improve my health score?'*"
)


def process_message(message: str, user_name: Optional[str] = None) -> str:
    """
    Match user message to the best intent and return a contextual response.
    """
    text = message.lower().strip()

    for intent in INTENTS:
        for pattern in intent["patterns"]:
            if re.search(pattern, text):
                response = intent["response"]
                # Personalise greeting
                if intent["name"] == "greeting" and user_name:
                    response = response.replace("Hello! 👋", f"Hello, {user_name.split()[0]}! 👋")
                return response

    return FALLBACK
