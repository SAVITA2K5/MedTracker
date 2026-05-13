"""
Health data service – save prediction results and fetch history.
"""

from typing import List, Optional
from sqlalchemy.orm import Session

from app.models.health_data import HealthData


def save_health_record(db: Session, user_id: int, data: dict) -> HealthData:
    """Persist a prediction result as a health data record."""
    record = HealthData(user_id=user_id, **data)
    db.add(record)
    db.commit()
    db.refresh(record)
    return record


def get_user_health_history(
    db: Session, user_id: int, limit: int = 10
) -> List[HealthData]:
    return (
        db.query(HealthData)
        .filter(HealthData.user_id == user_id)
        .order_by(HealthData.recorded_at.desc())
        .limit(limit)
        .all()
    )


def get_latest_record(db: Session, user_id: int) -> Optional[HealthData]:
    return (
        db.query(HealthData)
        .filter(HealthData.user_id == user_id)
        .order_by(HealthData.recorded_at.desc())
        .first()
    )
