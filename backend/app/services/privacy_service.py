
import re

class PrivacyService:
    def __init__(self):
        # Regex patterns for common PII
        self.email_pattern = re.compile(r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b')
        self.phone_pattern = re.compile(r'\b(?:\+?1[-. ]?)?\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})\b')

    def anonymize(self, text: str) -> str:
        """
        Redacts PII from the input text.
        """
        if not text:
            return ""
        
        # Redact emails
        text = self.email_pattern.sub('[EMAIL_REDACTED]', text)
        
        # Redact phone numbers
        text = self.phone_pattern.sub('[PHONE_REDACTED]', text)
        
        return text

privacy_service = PrivacyService()
