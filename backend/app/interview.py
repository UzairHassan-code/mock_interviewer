# D:\mock_interview\backend\app\interview.py
import google.generativeai as genai
import os
import json
from dotenv import load_dotenv

load_dotenv()

genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
json_model = genai.GenerativeModel(
    "gemini-2.5-flash",
    generation_config={"response_mime_type": "application/json"}
)
text_model = genai.GenerativeModel("gemini-2.5-flash")


async def get_question(field: str, level: str, previous_answer: str = None) -> str:
    """
    Generates a short interview question.
    """
    tone_map = {
        "junior": "Keep it friendly, simple, and encouraging. Avoid jargon.",
        "mid": "Ask clear but slightly challenging questions. Expect some detail.",
        "senior": "Ask concise, deep, technical questions assuming strong fundamentals."
    }
    tone = tone_map.get(level.lower(), tone_map["mid"])

    if previous_answer:
        prompt = f"You are a {level} level interviewer in {field}. The candidate's last answer was: '{previous_answer}'. Ask ONE short, relevant follow-up question. {tone}. Just ask the question."
    else:
        prompt = f"You are a {level} level interviewer in {field}. Start the interview with ONE crisp question. {tone}. Just ask the question."

    response = await text_model.generate_content_async(prompt)
    return response.text.strip()


async def get_final_report(field: str, level: str, history: list) -> dict:
    """
    Analyzes the candidate's answers and provides a final, holistic report.
    """
    candidate_answers = ""
    question_number = 1
    for message in history:
        # --- FIX: Access Pydantic model attributes directly ---
        if message.role == "user":
            candidate_answers += f"Answer to Q{question_number}: {message.text}\n\n"
            question_number += 1
        # ----------------------------------------------------

    prompt = f"""
    You are an expert hiring manager evaluating a candidate's interview for a {level}-level position in {field}.
    The candidate's answers to the questions are provided below.

    Candidate's Answers:
    ---
    {candidate_answers}
    ---

    Based on this set of answers, provide a final evaluation. Your analysis should be holistic.
    The JSON object must contain these keys and nothing else: "confidence", "nervousness", "relevance", "advice".
    - "confidence": An integer from 1 to 10.
    - "nervousness": An integer from 1 to 10.
    - "relevance": An integer from 1 to 10.
    - "advice": A single, constructive sentence of overall advice.
    """
    try:
        response = await json_model.generate_content_async(prompt)
        
        if response.text:
            return json.loads(response.text)
        else:
            print("!!! ERROR: Gemini API returned an empty response for the final report.")
            raise ValueError("Empty response from API")

    except Exception as e:
        print(f"!!! ERROR: An exception occurred in get_final_report: {e}")
        return {
            "confidence": 0, "nervousness": 0, "relevance": 0,
            "advice": "An error occurred while generating the report. The AI response was either empty or invalid."
        }
