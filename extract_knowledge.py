import os
from pypdf import PdfReader

knowledge_dir = "/Users/rui/Desktop/Siddhartha/knowledge"

def extract_text_from_pdf(pdf_path, txt_path):
    print(f"Extracting text from {pdf_path}...")
    try:
        reader = PdfReader(pdf_path)
        text = ""
        for page in reader.pages:
            text += page.extract_text() + "\n"
        
        with open(txt_path, "w", encoding="utf-8") as f:
            f.write(text)
        print(f"Saved text to {txt_path}")
    except Exception as e:
        print(f"Error extracting text from {pdf_path}: {e}")

if __name__ == "__main__":
    if not os.path.exists(knowledge_dir):
        print(f"Directory {knowledge_dir} not found.")
    else:
        for filename in os.listdir(knowledge_dir):
            if filename.lower().endswith(".pdf"):
                pdf_path = os.path.join(knowledge_dir, filename)
                txt_path = os.path.join(knowledge_dir, filename.replace(".pdf", ".txt").replace(".PDF", ".txt"))
                extract_text_from_pdf(pdf_path, txt_path)
