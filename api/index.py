import os
import sys

# Add the backend directory to sys.path so we can import from app
sys.path.append(os.path.join(os.path.dirname(__file__), '../backend'))

from app.main import app
