
import asyncio
import os
import sys
from unittest.mock import MagicMock, patch

# Ensure backend directory is in path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

# Need to import SupabaseService from correct path
# But we need to patch os.environ BEFORE create_client is imported inside the module if it's top level?
# No, create_client is imported, but called in __init__.
# However, os.getenv is called in __init__.

# Let's import the class first.
from app.services.supabase_service import SupabaseService
from app.services.privacy_service import privacy_service

async def test_supabase_logging():
    print("Testing Supabase Logging Logic...")
    
    # Mock environment variables
    # We use patch.dict on os.environ
    with patch.dict(os.environ, {"SUPABASE_URL": "http://test", "SUPABASE_KEY": "test"}, clear=True):
        
        # Also mock create_client to return our mock client
        with patch('app.services.supabase_service.create_client') as mock_create_client:
            mock_client = MagicMock()
            mock_create_client.return_value = mock_client
            
            # Initialize service
            print("Initializing Service...")
            service = SupabaseService()
            
            print(f"Service Client: {service.client}")
            
            # Verify client was set (because env vars were present, so create_client was called)
            if service.client is None:
                print("Client is None! Mocking failed.")
            else:
                print("Client initialized successfully.")
                
            # Test Data
            conversation_id = "test-conv-123"
            user_message = "My email is test@example.com and phone is 123-456-7890"
            ai_response = {"content": "I understand."}
            user_email = "user@test.com"
            user_id = "user-123"
            
            # Run the logging method
            print("Logging chat turn...")
            await service.log_chat_turn(conversation_id, user_message, ai_response, user_email, user_id)
            
            # Verify Conversations Upsert
            # The client.table("conversations").upsert(...) was called
            # We can verify the call chain
            mock_client.table.assert_any_call("conversations")
            mock_client.table("conversations").upsert.assert_called()
            print("✅ Conversation upsert called.")
            
            # Verify Messages Insert
            mock_client.table.assert_any_call("messages")
            assert mock_client.table("messages").insert.call_count == 2
            print("✅ Message inserts called (User + AI).")
            
            # Verify Privacy Filtering works in isolation
            sanitized = privacy_service.anonymize(user_message)
            print(f"Original: {user_message}")
            print(f"Sanitized: {sanitized}")
            
            if "[EMAIL_REDACTED]" in sanitized and "[PHONE_REDACTED]" in sanitized:
                print("✅ Privacy filtering working correctly.")
            else:
                print("❌ Privacy filtering failed.")

if __name__ == "__main__":
    asyncio.run(test_supabase_logging())
