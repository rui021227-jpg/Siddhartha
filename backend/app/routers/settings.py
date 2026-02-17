from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ..database import get_db
from ..models import User
from ..schemas import User as UserSchema
from ..deps import get_current_user
from typing import Dict, Any

router = APIRouter(prefix="/settings", tags=["settings"])

@router.get("/", response_model=Dict[str, Any])
async def get_settings(current_user: User = Depends(get_current_user)):
    return current_user.preferences or {}

@router.put("/", response_model=Dict[str, Any])
async def update_settings(
    settings: Dict[str, Any],
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    current_user.preferences = settings
    db.commit()
    db.refresh(current_user)
    return current_user.preferences
