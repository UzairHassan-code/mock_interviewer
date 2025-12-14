# 🎤 MockInterview: The AI Voice Interviewer

**MockInterviewer** is an interactive, voice-enabled AI interviewer designed to help developers overcome interview anxiety. 

It combines **Google's Gemini 2.5 Flash** with real-time **Speech Recognition** to simulate a real interview environment. Unlike standard coding platforms, MockMate focuses on **communication, pronunciation, and confidence**.

## 🌟 Why this project?

For many new developers, the hardest part of an interview isn't the code, it's speaking clearly under pressure. MockMate provides a **judgment-free environment** where you can:
* Practice speaking technical concepts out loud
* Improve your pronunciation and reducing filler words.
* Get quantitative feedback on your confidence levels.

## 🚀 Key Features

* **🎙️ Full Voice Interaction:** Speak your answers directly to the AI. It listens, transcribes, and responds with its own voice.
* **🤖 Animated Avatar:** Features a reactive robot avatar (built with SVG & Framer Motion) that blinks, thinks, and talks to mimic human presence.
* **🧠 Adaptive Difficulty:** Choose between `Junior`, `Mid`, or `Senior` levels. The AI adjusts its tone and question complexity accordingly.
* **📊 Emotional Analytics:** At the end of the session, receive a structured report grading your:
    * **Confidence** (1-10)
    * **Nervousness** (1-10)
    * **Relevance** (1-10)
* **⚡ Gemini 2.5 Flash:** Powered by Google's latest model for near-instant conversational latency.



## 🛠️ Tech Stack

### Frontend
* **Framework:** Next.js 14
* **Styling:** Tailwind CSS
* **Animation:** Framer Motion (for the Robot Avatar)
* **Audio:** Web Speech API (SpeechRecognition & SpeechSynthesis)

### Backend
* **Framework:** FastAPI
* **AI Model:** Google Gemini 2.5 Flash (via `google-generativeai`)
* **Validation:** Pydantic

## ⚙️ Installation & Setup

### Prerequisites
* Node.js 18+
* Python 3.10+
* Google Gemini API Key

### 1. Backend Setup

```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
```

Create a .env file in backend/:

Code snippet
```
GEMINI_API_KEY=your_api_key_here
```
Run the server:
```

uvicorn app.main:app --reload
```

2. Frontend Setup
```Bash

cd frontend
npm install
npm run dev
```

Open http://localhost:3000 to start your interview.


🤝 Contributing
Contributions are welcome! If you want to add new interview fields or improve the voice detection logic, feel free to fork the repo.
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
