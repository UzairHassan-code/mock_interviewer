// D:\mock_interview\frontend\components\ReportPage.js
"use client";
import { motion } from "framer-motion";
import { RefreshCcw, FileText, Star, Zap, ShieldCheck, MessageSquare, User, Bot } from 'lucide-react';

// A new, more visual component for displaying metrics
function ReportMetric({ icon, label, value }) {
    const MetricIcon = icon;
    const percentage = (value / 10) * 100;

    return (
        <div className="bg-gray-800/50 p-6 rounded-2xl border border-gray-700 text-center flex flex-col justify-between">
            <div className="flex items-center justify-center gap-3 mb-4">
                <MetricIcon size={24} className="text-blue-400" />
                <p className="text-xl font-semibold text-gray-200">{label}</p>
            </div>
            <div>
                <div className="w-full bg-gray-700 rounded-full h-2.5 mb-2">
                    <motion.div
                        className="bg-blue-500 h-2.5 rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${percentage}%` }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                    />
                </div>
                <p className="text-2xl font-bold text-white">{value}<span className="text-base text-gray-400">/10</span></p>
            </div>
        </div>
    );
}

export default function ReportPage({ report, history, options, onRestart }) {
  return (
    <div className="min-h-screen bg-gray-900 text-white font-sans p-4 sm:p-8 flex flex-col items-center">
      <div className="w-full max-w-5xl mx-auto relative">
        <motion.button 
            onClick={onRestart} 
            className="absolute top-0 right-0 flex items-center gap-2 px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 transition-colors text-white font-semibold" 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <RefreshCcw size={18} /> Try Another
        </motion.button>

        <motion.div 
            initial={{ opacity: 0, y: -30 }} 
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
          <div className="text-center mb-12 pt-12 sm:pt-0">
            <FileText size={48} className="mx-auto text-blue-400 mb-4" />
            <h1 className="text-5xl font-extrabold text-white tracking-tight">Interview Report</h1>
            <p className="text-xl text-gray-400 mt-2">{options.field} / {options.level}</p>
          </div>
        </motion.div>

        {/* Overall Assessment Section */}
        <motion.div 
            className="bg-gray-800 border border-gray-700 rounded-3xl p-8 mb-12"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
        >
            <h2 className="text-3xl font-bold text-center mb-8 text-white">Overall Assessment</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <ReportMetric icon={Zap} label="Confidence" value={report.confidence} />
                <ReportMetric icon={ShieldCheck} label="Clarity" value={report.relevance} />
                <ReportMetric icon={MessageSquare} label="Conciseness" value={report.nervousness} />
            </div>
            <div>
                <h3 className="text-xl font-semibold text-green-400 mb-3">Final Advice:</h3>
                <p className="bg-gray-900/50 p-5 rounded-xl text-gray-200 text-lg border border-gray-700">
                    {report.advice}
                </p>
            </div>
        </motion.div>

        {/* Full Transcript Section */}
        <h2 className="text-3xl font-bold text-center mb-8 text-white">Full Interview Transcript</h2>
        <div className="space-y-6 bg-gray-800 border border-gray-700 rounded-3xl p-8">
          {history.map((item) => (
            <div key={item.id} className={`flex items-start gap-4 ${item.role === 'user' ? 'flex-row-reverse' : ''}`}>
                <div className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center text-white ${item.role === 'user' ? 'bg-green-500' : 'bg-blue-500'}`}>
                    {item.role === 'user' ? <User size={24} /> : <Bot size={24} />}
                </div>
                <div className={`p-4 rounded-2xl text-lg w-full ${item.role === 'user' ? 'bg-gray-700' : 'bg-gray-900/50'}`}>
                    <p className="font-bold mb-1 text-gray-400">{item.role === 'model' ? 'Interviewer' : 'Your Answer'}</p>
                    <p className="text-gray-200 whitespace-pre-wrap">{item.text}</p>
                </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
