# D:\mock_interview\backend\app\schemas.py
from pydantic import BaseModel
from typing import List, Dict, Any, Optional

# FIX: Make the 'id' field optional to handle all message types
class ChatMessage(BaseModel):
    id: Optional[float | int] = None
    role: str
    text: str

# For the /api/start endpoint
class StartInterviewRequest(BaseModel):
    field: str
    level: str

class StartInterviewResponse(BaseModel):
    question: str

# For the /api/next endpoint
class NextQuestionRequest(BaseModel):
    field: str
    level: str
    previous_answer: str

class NextQuestionResponse(BaseModel):
    next_question: str

# For the new /api/report endpoint
class ReportRequest(BaseModel):
    field: str
    level: str
    history: List[ChatMessage] 

class FinalReport(BaseModel):
    confidence: int
    nervousness: int
    relevance: int
    advice: str

class ReportResponse(BaseModel):
    report: FinalReport
