from fastapi import APIRouter, Depends, HTTPException, status, BackgroundTasks
from sqlalchemy.orm import Session
from ..database import get_db
from ..models import Message, Conversation, User
from ..schemas import Message as MessageSchema, MessageCreate
from ..deps import get_current_user
from ..services.ai_service import conversation_service
from ..services.supabase_service import supabase_service
from datetime import datetime

router = APIRouter(prefix="/conversations/{conversation_id}/messages", tags=["messages"])

@router.post("/", response_model=MessageSchema)
async def send_message(
    conversation_id: str,
    msg: MessageCreate,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # 1. Verify conversation exists and belongs to user
    conv = db.query(Conversation).filter(
        Conversation.id == conversation_id,
        Conversation.user_id == current_user.id
    ).first()
    
    if not conv:
        raise HTTPException(status_code=404, detail="Conversation not found")
    
    if conv.is_completed:
        raise HTTPException(status_code=400, detail="Conversation already ended")

    # 2. Count existing user messages to check turn limit
    user_turn_count = db.query(Message).filter(
        Message.conversation_id == conversation_id,
        Message.role == "user"
    ).count()
    
    # turn_number for the NEW user message
    new_turn_number = user_turn_count + 1

    try:
        # Create user message
        user_msg = Message(
            conversation_id=conversation_id,
            role="user",
            content=msg.content,
            turn_number=new_turn_number
        )
        db.add(user_msg)
        db.flush()
        
        # Get all messages for context
        all_msgs = db.query(Message).filter(
            Message.conversation_id == conversation_id
        ).order_by(Message.created_at).all()
        history = [{"role": m.role, "content": m.content} for m in all_msgs]
        history.append({"role": "user", "content": msg.content})

        # Get AI response
        ai_result = await conversation_service.get_response(history, new_turn_number)
        
        # Create assistant message
        ai_msg = Message(
            conversation_id=conversation_id,
            role="assistant",
            content=ai_result["content"],
            turn_number=new_turn_number
        )
        db.add(ai_msg)
        
        # Update conversation if final turn
        if ai_result["is_final"]:
            conv.is_completed = True
            conv.ended_at = datetime.utcnow()
        
        db.commit()
        db.refresh(ai_msg)
        
        # Log to Supabase in background
        background_tasks.add_task(
            supabase_service.log_chat_turn,
            conversation_id=conversation_id,
            user_message=msg.content,
            ai_response={"content": ai_result["content"]},
            user_email=current_user.email,
            user_id=current_user.id
        )
        
        return ai_msg
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=500,
            detail=f"Failed to process message: {str(e)}"
        )
