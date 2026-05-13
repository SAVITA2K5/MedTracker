"""
User routes – register, login, profile, password change.
Phase 2: fully wired to user_service + JWT dependency.
"""

from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.dependencies import get_current_user
from app.core.security import create_access_token
from app.models.user import User
from app.services import user_service
from app.schemas.user_schema import (
    UserCreate, UserLogin, UserOut, UserUpdate,
    PasswordChange, Token, MessageResponse,
)

router = APIRouter(prefix="/users", tags=["Users"])


@router.post(
    "/register",
    response_model=Token,
    status_code=status.HTTP_201_CREATED,
    summary="Register a new user",
)
def register(payload: UserCreate, db: Session = Depends(get_db)):
    user = user_service.create_user(db, payload)
    token = create_access_token({"sub": str(user.id)})
    return Token(access_token=token, user=UserOut.model_validate(user))


@router.post(
    "/login",
    response_model=Token,
    summary="Login and receive JWT",
)
def login(payload: UserLogin, db: Session = Depends(get_db)):
    user = user_service.authenticate_user(db, payload.email, payload.password)
    token = create_access_token({"sub": str(user.id)})
    return Token(access_token=token, user=UserOut.model_validate(user))


@router.get(
    "/me",
    response_model=UserOut,
    summary="Get current user profile",
)
def get_me(current_user: User = Depends(get_current_user)):
    return current_user


@router.put(
    "/me",
    response_model=UserOut,
    summary="Update current user profile",
)
def update_profile(
    payload: UserUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    return user_service.update_user_profile(db, current_user, payload)


@router.post(
    "/me/change-password",
    response_model=MessageResponse,
    summary="Change current user password",
)
def change_password(
    payload: PasswordChange,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    user_service.change_password(db, current_user, payload.old_password, payload.new_password)
    return MessageResponse(message="Password updated successfully.")


@router.get(
    "/{user_id}",
    response_model=UserOut,
    summary="Get user by ID",
)
def get_user(user_id: int, db: Session = Depends(get_db)):
    return user_service.get_user_by_id(db, user_id)
