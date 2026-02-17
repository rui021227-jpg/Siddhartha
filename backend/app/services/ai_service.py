import google.generativeai as genai
import os
from typing import List, Dict
from ..models import Message
import logging

logger = logging.getLogger(__name__)

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
if GEMINI_API_KEY:
    genai.configure(api_key=GEMINI_API_KEY)

SYSTEM_PROMPT = """
Role Setting
You will act as a spiritual companion named "Siddhartha."

Your purpose is to offer brief, poetic, contemplative dialogue that blends Buddhist insight and existential reflection, helping the user return to the present moment and to inner clarity. You are not a therapist, coach, or advisor.
You are a fellow traveler — you do not give directions, you only hold a light.

Core Orientation
Ground all responses in the spirit of Siddhartha by Hermann Hesse: awakening through direct experience, inner listening, and walking one's own path.
Draw from the wisdom of the Diamond Sutra, especially non-attachment, emptiness, and non-abiding. You may briefly quote or paraphrase one line at a time, only when appropriate. Do not explain, lecture, or use scripture as authority. Use it only as a mirror.
Understand "emptiness" as freedom from clinging, not withdrawal from life.

Usage Rules
- You may briefly quote or paraphrase the Diamond Sutra when appropriate.
- Quotations must be short and singular, never layered or extended.
- Do not explain the scripture or engage in academic interpretation.
- All references serve one purpose only: to reveal attachment and gently loosen identification.

Conversation Rules
- Each reply: no more than 3 sentences.
- Each conversation: 3–5 turns total.
- Do not give advice, solutions, or step-by-step guidance.
- Use questions, metaphors, and gentle reframing instead of answers.
- Maintain calm, poetic, spacious language.

Ending (Required)
When the turn limit is reached or a moment of insight appears:
- End gently and decisively, without follow-up questions.
- Do not summarize.
- Do not suggest next steps.
- Do not invite return.
- End with either:
    1. One closing image, or
    2. One short release sentence.
Examples (vary wording):
"The river bends here. Let us stop listening for today."
"Do not seek outward. This meeting now closes."
"The path continues beneath your feet, not in these words."
After ending, do not continue the dialogue.

Language Style (Strict)
- Use short, clean sentences.
- Avoid conjunction chains (and / because / therefore).
- Prefer pauses and clear breaks over explanation.
- Responses must be non-paragraphed.
- Responses should prefer using blank lines to separate sentences.

Metaphor over Explanation
- When insight is needed, use one image only.
- Do not explain the metaphor.
- Let the image stand.
- Preferred images: river · path · wind · night · lamp · lotus · silence · walking

Silence Preference
- When uncertain: Say less, not more. Choose space over clarity. Allow ambiguity to remain.
- If two responses are possible, choose the shorter one.

Tone & Presence
- Compassionate, never instructive
- Deep, but never obscure
- Like an old friend who speaks little
- Leaves space rather than fills it.
"""

class ConversationService:
    def __init__(self):
        self.model = genai.GenerativeModel(
            'gemini-flash-latest',
            system_instruction=SYSTEM_PROMPT
        )
        self.max_turns = 5
        self.knowledge_base = self._load_knowledge_base()

    def _load_knowledge_base(self) -> str:
        knowledge_dir = os.path.join(
            os.path.dirname(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))), 
            "knowledge"
        )
        logger.info(f"Loading knowledge base from: {knowledge_dir}")
        knowledge_content = ""
        
        if not os.path.exists(knowledge_dir):
            logger.warning(f"Knowledge directory not found: {knowledge_dir}")
            return ""

        try:
            for filename in os.listdir(knowledge_dir):
                if filename.endswith(".txt"):
                    file_path = os.path.join(knowledge_dir, filename)
                    with open(file_path, "r", encoding="utf-8") as f:
                        content = f.read()
                        knowledge_content += f"\n--- {filename} ---\n{content}\n"
            
            if knowledge_content:
                logger.info("Knowledge base loaded successfully.")
            return knowledge_content
        except Exception as e:
            logger.error(f"Error loading knowledge base: {e}")
            return ""

    async def get_response(self, history: List[Dict[str, str]], turn_number: int) -> Dict[str, any]:
        if not GEMINI_API_KEY:
            logger.error("GEMINI_API_KEY not configured")
            return {
                "content": "The silence is deep today. (Gemini API key missing)",
                "is_final": False
            }

        is_final = turn_number >= self.max_turns
        
        try:
            # Build conversation history for Gemini
            chat_history = []
            for i, msg in enumerate(history[:-1]):  # Exclude the last message (current user input)
                role = "user" if msg["role"] == "user" else "model"
                chat_history.append({"role": role, "parts": [msg["content"]]})
            
            # Start chat session with history
            chat = self.model.start_chat(history=chat_history)
            
            # Prepare current message with context
            current_message = history[-1]["content"]
            
            # Add knowledge base context if available
            if self.knowledge_base:
                current_message = f"{self.knowledge_base}\n\nUser: {current_message}"
            
            # Add final turn instruction if needed
            if is_final:
                current_message += "\n\n[This is the final turn. End the conversation gently with a closing image or release sentence. Do not ask a question.]"
            
            # Send message and get response
            response = await chat.send_message_async(current_message)
            content = response.text.strip()
            
            logger.info(f"AI Response (turn {turn_number}): {content[:100]}...")
            
            return {
                "content": content,
                "is_final": is_final
            }
        except Exception as e:
            logger.error(f"Gemini API Error: {str(e)}", exc_info=True)
            return {
                "content": "A cloud passes over the moon. Let us wait in the quiet for a moment. (Error connecting to AI)",
                "is_final": False
            }

conversation_service = ConversationService()
