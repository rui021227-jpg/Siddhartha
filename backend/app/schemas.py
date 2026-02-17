from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import datetime

class UserBase(BaseModel):
    email: Optional[EmailStr] = None

class UserCreate(UserBase):
    password: Optional[str] = None
    is_anonymous: bool = False

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class User(UserBase):
    id: str
    is_anonymous: bool
    created_at: datetime
    
    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    user_id: Optional[str] = None

class MessageBase(BaseModel):
    content: str
    role: str

class MessageCreate(BaseModel):
    content: str

class Message(MessageBase):
    id: str
    conversation_id: str
    created_at: datetime
    turn_number: Optional[int] = None
    
    class Config:
        from_attributes = True

class ConversationBase(BaseModel):
    title: Optional[str] = None
    topic: Optional[str] = None

class ConversationCreate(ConversationBase):
    pass

class Conversation(ConversationBase):
    id: str
    user_id: str
    created_at: datetime
    ended_at: Optional[datetime] = None
    is_completed: bool
    
    class Config:
        from_attributes = True

class ConversationWithMessages(Conversation):
    messages: List[Message] = []

