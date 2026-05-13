"""
Chatbot routes – /chatbot/message
Intent-based health assistant. Auth-protected to personalise responses.
"""

from fastapi import APIRouter, Depends
from pydantic import BaseModel
from typing import Optional

from app.core.dependencies import get_current_user
from app.models.user import User
from app.services.chatbot_service import process_message

router = APIRouter(prefix="/chatbot", tags=["Chatbot"])


class ChatRequest(BaseModel):
    message: str

    class Config:
        json_schema_extra = {"example": {"message": "What is diabetes?"}}


class ChatResponse(BaseModel):
    reply: str
    intent_matched: bool


@router.post(
    "/message",
    response_model=ChatResponse,
    summary="Send a message to MedAI health chatbot",
)
def chat(
    payload: ChatRequest,
    current_user: User = Depends(get_current_user),
):
    reply = process_message(payload.message, user_name=current_user.full_name)
    intent_matched = reply != process_message("xyz_no_match_xyz")
    return ChatResponse(reply=reply, intent_matched=True)


@router.post(
    "/message/guest",
    response_model=ChatResponse,
    summary="Guest chatbot access (no auth required)",
)
def chat_guest(payload: ChatRequest):
    """Public endpoint for unauthenticated chatbot access."""
    reply = process_message(payload.message)
    return ChatResponse(reply=reply, intent_matched=True)
