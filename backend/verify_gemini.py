import asyncio
import os
import sys

# Ensure backend directory is in path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from dotenv import load_dotenv
load_dotenv()

from app.services.ai_service import conversation_service

async def main():
    print("Testing Gemini Connection...")
    print(f"API Key present: {bool(os.getenv('GEMINI_API_KEY'))}")
    
    # Simulate a history
    history = [
        {"role": "user", "content": "Hello, who are you?"}
    ]
    
    print("Requesting response from AI service...")
    try:
        response = await conversation_service.get_response(history, turn_number=1)
        print("\nResponse Received:")
        print("-" * 20)
        print(response.get("content", "NO CONTENT"))
        print("-" * 20)
        print(f"Is Final: {response.get('is_final', 'UNKNOWN')}")
    except Exception as e:
        print(f"\nCaught Exception in verify script: {e}")
        import traceback
        traceback.print_exc()
    print("Verification script finished.")

if __name__ == "__main__":
    try:
        asyncio.run(main())
    except Exception as e:
        print(f"Main Loop Exception: {e}")
