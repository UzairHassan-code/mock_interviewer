
from pydantic import BaseModel

class QuestionRequest(BaseModel):
    field: str

class EvaluationRequest(BaseModel):
    field: str
    answer: str
