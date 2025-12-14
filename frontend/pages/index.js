// D:\mock_interview\frontend\pages\index.js
"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import SelectionPanel from '../components/SelectionPanel';
import InterviewPage from '../components/InterviewPage';
import ReportPage from '../components/ReportPage';

export default function Home() {
  const [page, setPage] = useState("home"); // 'home', 'interview', or 'report'
  const [interviewOptions, setInterviewOptions] = useState(null);
  const [finalChatHistory, setFinalChatHistory] = useState([]);
  const [finalReport, setFinalReport] = useState(null);

  const handleStart = (options) => {
    setInterviewOptions(options);
    setPage("interview");
  };

  const handleComplete = (chatHistory, reportData) => {
    setFinalChatHistory(chatHistory);
    setFinalReport(reportData);
    setPage("report");
  };

  const handleRestart = () => {
    setInterviewOptions(null);
    setFinalChatHistory([]);
    setFinalReport(null);
    setPage("home");
  };

  if (page === "interview") {
    return <InterviewPage options={interviewOptions} onComplete={handleComplete} />;
  }

  if (page === "report") {
    return <ReportPage report={finalReport} history={finalChatHistory} options={interviewOptions} onRestart={handleRestart} />;
  }

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 flex flex-col items-center justify-center p-4">
      <div className="text-center mb-12">
        <motion.h1 className="text-6xl sm:text-8xl font-extrabold tracking-tighter mb-4" initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <span className="bg-gradient-to-r from-blue-500 to-green-400 bg-clip-text text-transparent">AI Interviewer</span>
        </motion.h1>
        <motion.p className="text-lg sm:text-xl text-gray-400" initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.6 }}>
          Hone your skills with a smart, conversational AI.
        </motion.p>
      </div>
      <div className="w-full max-w-2xl rounded-3xl bg-gray-800 shadow-2xl border border-gray-700 p-8 sm:p-12">
        <SelectionPanel onStart={handleStart} />
      </div>
    </div>
  );
}
