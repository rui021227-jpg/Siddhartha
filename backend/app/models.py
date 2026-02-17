from sqlalchemy import Column, Integer, String, Boolean, ForeignKey, DateTime, Text, JSON
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from .database import Base
import uuid

def generate_uuid():
    return str(uuid.uuid4())

class User(Base):
    __tablename__ = "users"

    id = Column(String, primary_key=True, default=generate_uuid)
    email = Column(String, unique=True, index=True, nullable=True)
    hashed_password = Column(String, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    is_anonymous = Column(Boolean, default=False)
    preferences = Column(JSON, default={})

    conversations = relationship("Conversation", back_populates="user")
    reflection_metadata = relationship("ReflectionMetadata", back_populates="user")

class Conversation(Base):
    __tablename__ = "conversations"

    id = Column(String, primary_key=True, default=generate_uuid)
    user_id = Column(String, ForeignKey("users.id"))
    title = Column(String, nullable=True)
    topic = Column(String, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    ended_at = Column(DateTime(timezone=True), nullable=True)
    is_completed = Column(Boolean, default=False)

    user = relationship("User", back_populates="conversations")
    messages = relationship("Message", back_populates="conversation")
    reflection_metadata = relationship("ReflectionMetadata", back_populates="conversation", uselist=False)

class Message(Base):
    __tablename__ = "messages"

    id = Column(String, primary_key=True, default=generate_uuid)
    conversation_id = Column(String, ForeignKey("conversations.id"))
    role = Column(String, nullable=False)  # 'user' or 'assistant'
    content = Column(Text, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    turn_number = Column(Integer, nullable=True)

    conversation = relationship("Conversation", back_populates="messages")

class ReflectionMetadata(Base):
    __tablename__ = "reflection_metadata"

    id = Column(String, primary_key=True, default=generate_uuid)
    conversation_id = Column(String, ForeignKey("conversations.id"))
    user_id = Column(String, ForeignKey("users.id"))
    is_favorited = Column(Boolean, default=False)
    tags = Column(JSON, default=[]) 
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    conversation = relationship("Conversation", back_populates="reflection_metadata")
    user = relationship("User", back_populates="reflection_metadata")
