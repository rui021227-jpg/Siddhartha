from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from ..database import get_db
from ..models import Conversation, User
from ..schemas import Conversation as ConversationSchema, ConversationCreate
from ..deps import get_current_user

router = APIRouter(prefix="/conversations", tags=["conversations"])

@router.post("/", response_model=ConversationSchema)
async def create_conversation(
    conv: ConversationCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    new_conv = Conversation(
        user_id=current_user.id,
        title=conv.title,
        topic=conv.topic
    )
    db.add(new_conv)
    db.commit()
    db.refresh(new_conv)
    return new_conv

@router.get("/", response_model=List[ConversationSchema])
async def list_conversations(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    conversations = db.query(Conversation).filter(
        Conversation.user_id == current_user.id
    ).order_by(Conversation.created_at.desc()).all()
    return conversations

@router.get("/{conversation_id}", response_model=ConversationSchema)
async def get_conversation(
    conversation_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    conv = db.query(Conversation).filter(
        Conversation.id == conversation_id,
        Conversation.user_id == current_user.id
    ).first()
    if not conv:
        raise HTTPException(status_code=404, detail="Conversation not found")
    return conv
