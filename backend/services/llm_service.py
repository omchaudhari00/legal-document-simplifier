import os
from langchain_openai import ChatOpenAI
from pydantic import BaseModel, Field
from typing import List

def get_llm():
    api_key = os.getenv("HUGGINGFACE_API_KEY")
    if not api_key or api_key == "your_huggingface_api_key_here":
        raise ValueError("Valid HUGGINGFACE_API_KEY is not set.")
        
    # Hugging Face provides an OpenAI-compatible API for their Serverless Inference!
    # This automatically uses the correct 'conversational' task endpoints.
    return ChatOpenAI(
        api_key=api_key,
        base_url="https://api-inference.huggingface.co/models/meta-llama/Llama-3.1-8B-Instruct/v1/",
        model="meta-llama/Llama-3.1-8B-Instruct",
        temperature=0.2,
        max_tokens=4096
    )

class ProcessedDocument(BaseModel):
    summary: str = Field(description="A concise overview summary (1-2 paragraphs).")
    simplified_text: str = Field(description="A simplified, plain-English version of the main points.")
    key_points: List[str] = Field(description="Key bullet points highlighting important risks, obligations, and unusual clauses.")

def process_legal_document(text: str) -> dict:
    llm = get_llm()
    
    # Cap text to roughly 100k characters to stay safe within limits
    capped_text = text[:300000] 
    
    prompt = f"""You are an expert legal assistant. Read the following legal document and analyze it.
Provide a concise summary, a simplified plain-English version, and key bullet points highlighting risks and obligations.

Document Text:
{capped_text}

Respond in JSON format with the following structure:
{{
    "summary": "A concise overview summary (1-2 paragraphs).",
    "simplified_text": "A simplified, plain-English version of the main points.",
    "key_points": ["Key bullet point 1", "Key bullet point 2", "Key bullet point 3"]
}}
"""
    response = llm.invoke(prompt)
    import json
    import re
    
    # Extract JSON from response
    json_match = re.search(r'\{[\s\S]*\}', response.content)
    if json_match:
        return json.loads(json_match.group())
    return {"summary": response.content, "simplified_text": "", "key_points": []}

def chat_with_document(text: str, question: str, history: List[dict] = None) -> str:
    llm = get_llm()
    
    history_str = ""
    if history:
        for msg in history:
            role = "User" if msg.get("role") == "user" else "Assistant"
            history_str += f"{role}: {msg.get('content', '')}\n"
            
    capped_text = text[:300000]
            
    prompt = f"""You are an expert legal assistant answering questions about a document.
    
Document Context:
{capped_text}

Conversation History:
{history_str}

User Question: {question}

Answer the question clearly and accurately based ONLY on the Document Context provided. If the answer is not in the document, state that you don't know based on the document.
"""
    response = llm.invoke(prompt)
    return response.content if hasattr(response, 'content') else str(response)
