"""Pydantic schemas – SOS / Emergency (Phase 2 final)"""

from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime


class EmergencyContactCreate(BaseModel):
    name: str = Field(..., min_length=2, max_length=100)
    relationship: Optional[str] = Field(None, max_length=50)
    phone: str = Field(..., min_length=7, max_length=20)
    email: Optional[str] = None

    class Config:
        json_schema_extra = {
            "example": {
                "name": "Jane Doe",
                "relationship": "Spouse",
                "phone": "+91-9876543210",
                "email": "jane@example.com",
            }
        }


class EmergencyContactOut(EmergencyContactCreate):
    id: int
    user_id: int
    created_at: datetime

    class Config:
        from_attributes = True


class SOSTrigger(BaseModel):
    latitude: Optional[float] = Field(None, ge=-90, le=90)
    longitude: Optional[float] = Field(None, ge=-180, le=180)
    custom_message: Optional[str] = Field(None, max_length=500)


class SOSResponse(BaseModel):
    success: bool
    contacts_notified: int
    total_contacts: int
    errors: List[str] = []
    message: str
