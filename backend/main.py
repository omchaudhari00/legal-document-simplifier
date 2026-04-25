from fastapi import FastAPI, UploadFile, File, HTTPException, Body
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import os
from dotenv import load_dotenv

from services.document_parser import extract_text_from_file
from services.llm_service import process_legal_document, chat_with_document

load_dotenv()

app = FastAPI(title="Legal Document Simplifier API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ChatRequest(BaseModel):
    document_text: str
    question: str
    history: Optional[List[dict]] = None

@app.post("/api/upload")
async def upload_document(file: UploadFile = File(...)):
    if not file.filename:
        raise HTTPException(status_code=400, detail="No file uploaded.")
        
    try:
        content = await file.read()
        text = extract_text_from_file(content, file.filename)
        
        if not text.strip():
            raise HTTPException(status_code=400, detail="Could not extract text from the document. It might be empty or an image.")
            
        result = process_legal_document(text)
        
        return {
            "success": True,
            "filename": file.filename,
            "extracted_text": text,
            "analysis": result
        }
    except ValueError as e:
        if "HUGGINGFACE_API_KEY" in str(e):
             raise HTTPException(status_code=500, detail="HuggingFace API key is missing or invalid. Please check backend config.")
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"An error occurred: {str(e)}")

@app.post("/api/chat")
async def chat_document(req: ChatRequest):
    try:
        if not req.document_text.strip():
            raise HTTPException(status_code=400, detail="Document text is missing.")
            
        answer = chat_with_document(req.document_text, req.question, req.history)
        return {
            "success": True,
            "answer": answer
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"An error occurred: {str(e)}")

@app.get("/")
def health_check():
    return {"status": "ok", "message": "Legal Document Simplifier API is running."}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
