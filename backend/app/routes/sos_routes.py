"""
SOS routes – emergency contact management and SOS trigger.
All endpoints require JWT authentication.
"""

from fastapi import APIRouter, Depends, status
from typing import List
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.dependencies import get_current_user
from app.models.user import User
from app.schemas.sos_schema import (
    EmergencyContactCreate, EmergencyContactOut,
    SOSTrigger, SOSResponse,
)
from app.services import sos_service
from app.schemas.user_schema import MessageResponse

router = APIRouter(prefix="/sos", tags=["SOS / Emergency"])


# ── Emergency Contacts ────────────────────────────────────────

@router.post(
    "/contacts",
    response_model=EmergencyContactOut,
    status_code=status.HTTP_201_CREATED,
    summary="Add an emergency contact",
)
def add_contact(
    payload: EmergencyContactCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    return sos_service.add_contact(
        db,
        user_id=current_user.id,
        name=payload.name,
        phone=payload.phone,
        relationship=payload.relationship,
        email=payload.email,
    )


@router.get(
    "/contacts",
    response_model=List[EmergencyContactOut],
    summary="List all emergency contacts for current user",
)
def list_contacts(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    return sos_service.list_contacts(db, current_user.id)


@router.delete(
    "/contacts/{contact_id}",
    response_model=MessageResponse,
    summary="Delete an emergency contact",
)
def delete_contact(
    contact_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    sos_service.delete_contact(db, contact_id, current_user.id)
    return MessageResponse(message="Contact deleted successfully.")


# ── SOS Trigger ───────────────────────────────────────────────

@router.post(
    "/trigger",
    response_model=SOSResponse,
    summary="🚨 Trigger SOS – send SMS alerts to all emergency contacts",
)
def trigger_sos(
    payload: SOSTrigger,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    result = sos_service.send_sos_alerts(
        db=db,
        user_id=current_user.id,
        user_name=current_user.full_name,
        latitude=payload.latitude,
        longitude=payload.longitude,
        custom_message=payload.custom_message,
    )
    return SOSResponse(**result)
