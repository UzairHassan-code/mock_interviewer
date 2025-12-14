# D:\mock_interview\backend\app\main.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .schemas import (
    StartInterviewRequest, StartInterviewResponse,
    NextQuestionRequest, NextQuestionResponse,
    ReportRequest, ReportResponse
)
from .interview import get_question, get_final_report

app = FastAPI()

# Ensure this matches your frontend's URL
origins = ["http://localhost:3000"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/api/start", response_model=StartInterviewResponse)
async def start_interview(req: StartInterviewRequest):
    print("--- LOG: /api/start endpoint hit.")
    question = await get_question(req.field, req.level)
    print("--- LOG: /api/start endpoint finished. Sending response.")
    return StartInterviewResponse(question=question)

@app.post("/api/next", response_model=NextQuestionResponse)
async def next_question(req: NextQuestionRequest):
    print(f"--- LOG: /api/next endpoint hit with answer: '{req.previous_answer[:30]}...'")
    next_q = await get_question(
        field=req.field,
        level=req.level,
        previous_answer=req.previous_answer
    )
    print("--- LOG: /api/next endpoint finished. Sending response.")
    return NextQuestionResponse(next_question=next_q)

@app.post("/api/report", response_model=ReportResponse)
async def generate_report(req: ReportRequest):
    print("--- LOG: /api/report endpoint hit.")
    final_report_data = await get_final_report(
        field=req.field,
        level=req.level,
        history=req.history
    )
    print("--- LOG: /api/report endpoint finished. Sending response.")
    return ReportResponse(report=final_report_data)
