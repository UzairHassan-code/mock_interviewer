// D:\mock_interview\frontend\components\InterviewPage.js
"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import { Send, Bot, User, Loader2, Mic, Square } from 'lucide-react';

// --- API MODE: Set to 'false' to use the live backend ---
const MOCK_API_MODE = false;
const BACKEND_API_URL = "http://localhost:8000";

const AUTO_SUBMIT_DELAY = 5000; // 5 seconds

// --- Helper Hooks & Utilities for Voice Functionality ---

const useSpeechRecognition = () => {
    const [transcript, setTranscript] = useState("");
    const [isListening, setIsListening] = useState(false);
    const recognitionRef = useRef(null);
    const isSupported = useRef(false);

    useEffect(() => {
        if (typeof window === 'undefined') return;
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (SpeechRecognition) {
            isSupported.current = true;
            const recognition = new SpeechRecognition();
            recognition.continuous = true;
            recognition.interimResults = true;
            recognition.lang = 'en-US';
            recognition.onresult = (event) => {
                let finalTranscript = '';
                for (let i = event.resultIndex; i < event.results.length; ++i) {
                    if (event.results[i].isFinal) {
                        finalTranscript += event.results[i][0].transcript;
                    }
                }
                if (finalTranscript) {
                    setTranscript(prev => prev + finalTranscript + ' ');
                }
            };
            recognition.onend = () => setIsListening(false);
            recognitionRef.current = recognition;
            return () => recognitionRef.current?.stop();
        } else {
            console.warn("Speech Recognition API not supported in this browser.");
        }
    }, []);

    const startListening = useCallback(() => {
        if (isSupported.current && recognitionRef.current && !isListening) {
            setTranscript("");
            recognitionRef.current.start();
            setIsListening(true);
        }
    }, [isListening]);

    const stopListening = useCallback(() => {
        if (isSupported.current && recognitionRef.current && isListening) {
            recognitionRef.current.stop();
            setIsListening(false);
        }
    }, [isListening]);

    return { transcript, isListening, startListening, stopListening, setTranscript, isSupported: isSupported.current };
};

const speak = (text, onEnd) => {
    if (typeof window === 'undefined' || !window.speechSynthesis) {
        if (onEnd) onEnd();
        return;
    };
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.onend = onEnd;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
};


export default function InterviewPage({ options, onComplete }) {
  const [chatHistory, setChatHistory] = useState([]);
  const [userInput, setUserInput] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [lastSpokenId, setLastSpokenId] = useState(null);
  const [error, setError] = useState(null);
  
  const chatEndRef = useRef(null);
  const autoSubmitTimer = useRef(null);
  
  const { transcript, isListening, startListening, stopListening, setTranscript, isSupported } = useSpeechRecognition();
  const userAnswersCount = chatHistory.filter(m => m.role === 'user').length;

  useEffect(() => {
    if(chatEndRef.current) {
        chatEndRef.current.scrollTop = chatEndRef.current.scrollHeight;
    }
  }, [chatHistory]);
  
  useEffect(() => {
      const lastMessage = chatHistory[chatHistory.length - 1];
      if (options.mode === 'Voice' && lastMessage && lastMessage.role === 'model' && lastMessage.id !== lastSpokenId) {
          setLastSpokenId(lastMessage.id);
          setIsSpeaking(true);
          speak(lastMessage.text, () => {
              setIsSpeaking(false);
              startListening();
          });
      }
  }, [chatHistory, options.mode, startListening, lastSpokenId]);

  useEffect(() => {
      if (options.mode === 'Voice' && transcript) {
          setUserInput(transcript);
      }
  }, [transcript, options.mode]);

  const submitAnswer = useCallback(async () => {
    if (!userInput.trim() || isLoading) return;
    if (isListening) stopListening();
    if (autoSubmitTimer.current) clearTimeout(autoSubmitTimer.current);

    const currentUserMessage = { id: Date.now(), role: "user", text: userInput };
    const newHistory = [...chatHistory, currentUserMessage];
    
    setChatHistory(newHistory);
    setUserInput("");
    setTranscript("");
    
    const newAnswersCount = newHistory.filter(m => m.role === 'user').length;

    if (newAnswersCount >= options.questionCount) {
      setIsGeneratingReport(true);
      setIsLoading(false);
      if (MOCK_API_MODE) {
        // Mock logic is now disabled
      } else {
        try {
          const reportResponse = await fetch(`${BACKEND_API_URL}/api/report`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ field: options.field, level: options.level.toLowerCase(), history: newHistory }),
          });
          if (!reportResponse.ok) throw new Error("Failed to generate report.");
          const reportData = await reportResponse.json();
          onComplete(newHistory, reportData.report);
        } catch (err) {
          setError("Could not generate the final report.");
        } finally {
          setIsGeneratingReport(false);
        }
      }
      return;
    }

    setIsLoading(true);
    if (MOCK_API_MODE) {
        // Mock logic is now disabled
    } else {
        try {
          const response = await fetch(`${BACKEND_API_URL}/api/next`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ field: options.field, level: options.level.toLowerCase(), previous_answer: currentUserMessage.text }),
          });
          if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
          const data = await response.json();
          setChatHistory(prev => [...prev, { id: Date.now(), role: "model", text: data.next_question }]);
        } catch (err) {
          setError("An error occurred getting the next question.");
        } finally {
          setIsLoading(false);
        }
    }
  }, [userInput, isLoading, isListening, chatHistory, options, onComplete, stopListening, setTranscript]);

  useEffect(() => {
    if (autoSubmitTimer.current) clearTimeout(autoSubmitTimer.current);
    if (options.mode === 'Voice' && userInput.trim() && !isListening && !isSpeaking) {
      autoSubmitTimer.current = setTimeout(() => {
        submitAnswer();
      }, AUTO_SUBMIT_DELAY);
    }
    return () => clearTimeout(autoSubmitTimer.current);
  }, [userInput, isListening, isSpeaking, options.mode, submitAnswer]);


  useEffect(() => {
    const getFirstQuestion = async () => {
      setIsLoading(true);
      setError(null);
      if (MOCK_API_MODE) {
        // Mock logic is now disabled
      } else {
        try {
          const response = await fetch(`${BACKEND_API_URL}/api/start`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ field: options.field, level: options.level.toLowerCase() }),
          });
          if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
          const data = await response.json();
          setChatHistory([{ id: Date.now(), role: "model", text: data.question }]);
        } catch (err) {
          setError("Failed to connect to the backend. Please ensure it's running.");
        } finally {
          setIsLoading(false);
        }
      }
    };
    getFirstQuestion();
  }, [options.field, options.level]);
  
  const handleFormSubmit = (e) => {
      e.preventDefault();
      submitAnswer();
  };

  return (
    <div className="flex flex-col h-screen bg-gray-900 text-white font-sans">
        <header className="flex-shrink-0 flex items-center justify-between p-6 bg-gray-800/50 backdrop-blur-sm border-b border-gray-700">
            <div className="w-1/4"></div>
            <div className="w-1/2 text-center">
                <h1 className="text-2xl font-bold text-gray-100">AI Interviewer</h1>
                <p className="text-sm text-gray-400">{options.field} / {options.level}</p>
            </div>
            <div className="w-1/4 text-right">
                <div className="text-lg font-medium text-gray-400">
                    Question <span className="font-bold text-white">{userAnswersCount + 1 > options.questionCount ? options.questionCount : userAnswersCount + 1}</span> / {options.questionCount}
                </div>
            </div>
        </header>

        <main ref={chatEndRef} className="flex-1 overflow-y-auto p-6 space-y-8">
            {chatHistory.map(message => (
                <motion.div key={message.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className={`flex items-start gap-4 ${message.role === 'user' ? 'flex-row-reverse' : ''}`}>
                    <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${message.role === 'user' ? 'bg-green-500' : 'bg-blue-500'}`}>
                        {message.role === 'user' ? <User size={22} /> : <Bot size={22} />}
                    </div>
                    <div className={`p-4 rounded-2xl max-w-xl text-lg leading-relaxed shadow-lg ${message.role === 'user' ? 'bg-gray-700 rounded-br-none' : 'bg-gray-800 rounded-bl-none'}`}>
                        <p>{message.text}</p>
                    </div>
                </motion.div>
            ))}
            {isLoading && (<motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-start gap-4"><div className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center"><Loader2 size={22} className="animate-spin" /></div><div className="p-4 rounded-2xl max-w-xl text-lg leading-relaxed bg-gray-800"><p className="text-gray-400">AI is thinking...</p></div></motion.div>)}
            {isGeneratingReport && (<motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-start gap-4"><div className="flex-shrink-0 w-10 h-10 rounded-full bg-purple-500 flex items-center justify-center"><Loader2 size={22} className="animate-spin" /></div><div className="p-4 rounded-2xl max-w-xl text-lg leading-relaxed bg-gray-800"><p className="text-gray-400">Generating Report...</p></div></motion.div>)}
            {error && (<div className="flex justify-center"><div className="p-4 rounded-lg bg-red-900 border border-red-700 text-red-300">{error}</div></div>)}
        </main>

        <footer className="flex-shrink-0 p-6 bg-gray-800/50 backdrop-blur-sm border-t border-gray-700 flex justify-center">
            <div className="w-full max-w-3xl">
                {options.mode === 'Typing' || !isSupported ? (
                    <form onSubmit={handleFormSubmit} className="flex items-center gap-4">
                        <input type="text" value={userInput} onChange={(e) => setUserInput(e.target.value)} className="flex-1 w-full bg-gray-700 border-2 border-transparent rounded-full py-4 px-6 text-lg placeholder-gray-400 focus:outline-none focus:border-blue-500 transition-colors" placeholder="Type your answer…" disabled={isLoading || isGeneratingReport} />
                        <motion.button type="submit" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="flex-shrink-0 flex items-center justify-center bg-gradient-to-tr from-blue-500 to-purple-500 rounded-full text-white w-16 h-16 disabled:opacity-50" disabled={isLoading || isGeneratingReport || !userInput.trim()}><Send size={28} /></motion.button>
                    </form>
                ) : (
                    <div className="flex flex-col items-center gap-4">
                        <div className="flex items-center gap-4">
                            <motion.button onClick={isListening ? stopListening : startListening} className={`p-5 rounded-full text-white transition-colors ${isListening ? 'bg-red-600' : 'bg-blue-600'}`} animate={{ scale: isListening ? 1.1 : 1 }} transition={{ type: "spring", stiffness: 300, damping: 10 }}>
                                {isListening ? <Square size={28} /> : <Mic size={28} />}
                            </motion.button>
                            <p className="text-gray-400 text-lg">{isListening ? "Listening..." : isSpeaking ? "AI is speaking..." : "Click mic to speak"}</p>
                        </div>
                        <form onSubmit={handleFormSubmit} className="w-full flex items-center gap-4">
                            <input type="text" value={userInput} onChange={(e) => setUserInput(e.target.value)} className="flex-1 w-full bg-gray-700 border-2 border-transparent rounded-full py-4 px-6 text-lg placeholder-gray-400 focus:outline-none focus:border-blue-500 transition-colors" placeholder="Your transcribed answer will appear here..." disabled={isLoading || isGeneratingReport} />
                            <motion.button type="submit" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="flex-shrink-0 flex items-center justify-center bg-gradient-to-tr from-blue-500 to-purple-500 rounded-full text-white w-16 h-16 disabled:opacity-50" disabled={isLoading || isGeneratingReport || !userInput.trim()}><Send size={28} /></motion.button>
                        </form>
                    </div>
                )}
            </div>
        </footer>
    </div>
  );
};
