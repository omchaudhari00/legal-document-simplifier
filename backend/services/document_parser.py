import io
import pdfplumber
import docx

def extract_text_from_file(file_content: bytes, filename: str) -> str:
    """Extracts text from a file (PDF, DOCX, TXT)"""
    ext = filename.split(".")[-1].lower()
    
    if ext == "txt":
        return file_content.decode("utf-8", errors="ignore")
    elif ext == "pdf":
        text = ""
        with pdfplumber.open(io.BytesIO(file_content)) as pdf:
            for page in pdf.pages:
                page_text = page.extract_text()
                if page_text:
                    text += page_text + "\n"
        return text
    elif ext == "docx":
        doc = docx.Document(io.BytesIO(file_content))
        return "\n".join([para.text for para in doc.paragraphs])
    else:
        raise ValueError(f"Unsupported file format: {ext}")
