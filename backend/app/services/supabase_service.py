
import os
from supabase import create_client, Client
import logging
from .privacy_service import privacy_service
from typing import Optional, Dict, Any

logger = logging.getLogger(__name__)

class SupabaseService:
    def __init__(self):
        self.url: str = os.getenv("SUPABASE_URL")
        self.key: str = os.getenv("SUPABASE_KEY")
        self.client: Optional[Client] = None
        
        if self.url and self.key:
            try:
                self.client = create_client(self.url, self.key)
                logger.info("Supabase client initialized")
            except Exception as e:
                logger.error(f"Failed to initialize Supabase client: {e}")
        else:
            logger.warning("Supabase credentials not found in environment variables")

    async def log_chat_turn(self, conversation_id: str, user_message: str, ai_response: Dict[str, Any], user_email: Optional[str] = None, user_id: Optional[str] = None):
        """
        Logs a full chat turn (User + AI) to Supabase.
        """
        if not self.client:
            logger.warning("Supabase client not initialized, skipping log")
            return

        # Anonymize content
        sanitized_user_msg = privacy_service.anonymize(user_message)
        sanitized_ai_msg = privacy_service.anonymize(ai_response.get("content", ""))

        try:
            # 1. Ensure conversation exists (upsert)
            # We assume a 'conversations' table exists. 
            conv_data = {
                "id": conversation_id,
                "user_id": user_id,
                # "email": user_email # Maybe store email on conversation level too? Unclear schema.
            }
            # Remove None values
            conv_data = {k: v for k, v in conv_data.items() if v is not None}
            
            # Upsert conversation using on_conflict (assuming 'id' is unique constraint)
            self.client.table("conversations").upsert(conv_data).execute()

            # 2. Log User Message
            # We assume a 'messages' table exists with columns: conversation_id, role, content, user_id, email
            user_msg_data = {
                "conversation_id": conversation_id,
                "role": "user",
                "content": sanitized_user_msg,
                "user_id": user_id,
                "email": user_email 
            }
            user_msg_data = {k: v for k, v in user_msg_data.items() if v is not None}

            self.client.table("messages").insert(user_msg_data).execute()

            # 3. Log AI Message
            ai_msg_data = {
                "conversation_id": conversation_id,
                "role": "assistant",
                "content": sanitized_ai_msg,
                "user_id": user_id, # Linking AI response to user context
            }
            ai_msg_data = {k: v for k, v in ai_msg_data.items() if v is not None}
            
            self.client.table("messages").insert(ai_msg_data).execute()
            
            logger.info(f"Logged chat turn to Supabase for conversation {conversation_id}")

        except Exception as e:
            logger.error(f"Failed to log to Supabase: {e}")

supabase_service = SupabaseService()
