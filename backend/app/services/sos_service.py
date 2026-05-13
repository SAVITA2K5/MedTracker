"""
SOS service – emergency alert dispatch via Twilio SMS.
"""

from typing import List, Optional
from sqlalchemy.orm import Session
from fastapi import HTTPException

from app.models.emergency_contact import EmergencyContact
from app.core.config import settings


def send_sos_alerts(
    db: Session,
    user_id: int,
    user_name: str,
    latitude: Optional[float],
    longitude: Optional[float],
    custom_message: Optional[str] = None,
) -> dict:
    """
    1. Fetch all emergency contacts for user_id.
    2. Build SMS message (with GPS link if coords available).
    3. Send via Twilio (skips gracefully if creds not configured).
    4. Return summary.
    """
    contacts: List[EmergencyContact] = (
        db.query(EmergencyContact)
        .filter(EmergencyContact.user_id == user_id)
        .all()
    )

    if not contacts:
        raise HTTPException(
            status_code=400,
            detail="No emergency contacts found. Add contacts in the SOS screen first.",
        )

    # Build message body
    maps_link = ""
    if latitude and longitude:
        maps_link = f"\n📍 Location: https://maps.google.com/?q={latitude},{longitude}"

    body = (
        custom_message
        or f"🚨 EMERGENCY ALERT from MEDTRACK\n"
           f"Patient: {user_name} needs immediate assistance.{maps_link}\n"
           f"Please contact them or call emergency services (112) immediately."
    )

    notified = 0
    errors = []

    for contact in contacts:
        success, error = _send_sms(contact.phone, body)
        if success:
            notified += 1
        else:
            errors.append(f"{contact.name}: {error}")

    return {
        "success": notified > 0,
        "contacts_notified": notified,
        "total_contacts": len(contacts),
        "errors": errors,
        "message": (
            f"SOS alert sent to {notified}/{len(contacts)} contact(s)."
            if notified > 0
            else "Failed to notify any contacts."
        ),
    }


def _send_sms(to_number: str, body: str):
    """
    Attempt Twilio SMS. Returns (success: bool, error_msg: str).
    Gracefully no-ops if Twilio credentials are not configured.
    """
    sid = settings.TWILIO_ACCOUNT_SID
    token = settings.TWILIO_AUTH_TOKEN
    from_number = settings.TWILIO_FROM_NUMBER

    if not sid or not token or not from_number:
        # Dev mode – log and pretend success
        print(f"[SOS-DEV] Would SMS {to_number}: {body[:80]}...")
        return True, None

    try:
        from twilio.rest import Client

        client = Client(sid, token)
        client.messages.create(body=body, from_=from_number, to=to_number)
        return True, None
    except Exception as exc:
        return False, str(exc)


# ── Emergency contact CRUD ────────────────────────────────────

def add_contact(db: Session, user_id: int, name: str, phone: str,
                relationship: Optional[str] = None, email: Optional[str] = None) -> EmergencyContact:
    contact = EmergencyContact(
        user_id=user_id, name=name, phone=phone,
        relationship=relationship, email=email,
    )
    db.add(contact)
    db.commit()
    db.refresh(contact)
    return contact


def list_contacts(db: Session, user_id: int) -> List[EmergencyContact]:
    return db.query(EmergencyContact).filter(EmergencyContact.user_id == user_id).all()


def delete_contact(db: Session, contact_id: int, user_id: int) -> bool:
    contact = db.query(EmergencyContact).filter(
        EmergencyContact.id == contact_id,
        EmergencyContact.user_id == user_id,
    ).first()
    if not contact:
        raise HTTPException(status_code=404, detail="Contact not found.")
    db.delete(contact)
    db.commit()
    return True
