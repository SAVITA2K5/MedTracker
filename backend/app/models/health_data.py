"""SQLAlchemy model – Health Data"""

from sqlalchemy import Column, Integer, Float, String, ForeignKey, DateTime
from sqlalchemy.sql import func
from app.core.database import Base


class HealthData(Base):
    __tablename__ = "health_data"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)

    # ── Shared vitals ──────────────────────────────────────────
    age = Column(Integer, nullable=False)
    gender = Column(String(10), nullable=True)
    bmi = Column(Float, nullable=True)
    blood_pressure_systolic = Column(Float, nullable=True)
    blood_pressure_diastolic = Column(Float, nullable=True)

    # ── Diabetes-specific ─────────────────────────────────────
    glucose = Column(Float, nullable=True)
    insulin = Column(Float, nullable=True)
    skin_thickness = Column(Float, nullable=True)
    diabetes_pedigree = Column(Float, nullable=True)
    pregnancies = Column(Integer, nullable=True)

    # ── Heart-disease-specific ────────────────────────────────
    cholesterol = Column(Float, nullable=True)
    chest_pain_type = Column(Integer, nullable=True)   # 0-3
    max_heart_rate = Column(Float, nullable=True)
    exercise_angina = Column(Integer, nullable=True)   # 0/1
    st_depression = Column(Float, nullable=True)
    fasting_blood_sugar = Column(Integer, nullable=True)  # 0/1
    resting_ecg = Column(Integer, nullable=True)       # 0-2
    slope = Column(Integer, nullable=True)             # 0-2
    ca = Column(Integer, nullable=True)                # 0-3
    thal = Column(Integer, nullable=True)              # 1-3

    # ── Prediction results ────────────────────────────────────
    diabetes_risk = Column(Float, nullable=True)
    heart_risk = Column(Float, nullable=True)
    health_score = Column(Float, nullable=True)

    recorded_at = Column(DateTime(timezone=True), server_default=func.now())

    def __repr__(self):
        return f"<HealthData id={self.id} user_id={self.user_id}>"
