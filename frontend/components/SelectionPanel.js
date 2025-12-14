// D:\mock_interview\frontend\components\SelectionPanel.js
import { useState } from "react";
import { motion } from "framer-motion";
import { ChevronRight, ChevronsRight, Award, Type, Mic } from 'lucide-react';

const FIELDS = ["Data Science", "Machine Learning", "Web Development", "DevOps", "Product"];
const LEVELS = ["Junior", "Mid", "Senior"];
const MODES = ["Typing", "Voice"]; // Add modes

export default function SelectionPanel({ onStart }) {
  const [field, setField] = useState(FIELDS[0]);
  const [level, setLevel] = useState(LEVELS[0]);
  const [questionCount, setQuestionCount] = useState(2);
  const [mode, setMode] = useState(MODES[0]); // Add mode state

  const buttonClass = (isSelected) =>
    `flex-1 py-4 px-4 rounded-xl flex items-center justify-center gap-2 transition-all duration-200 ease-in-out font-medium text-lg ${
      isSelected
        ? 'bg-blue-600 text-white shadow-lg'
        : 'bg-gray-700 text-gray-400 hover:bg-gray-600'
    }`;
  
  const iconMap = {
    Typing: <Type size={18} />,
    Voice: <Mic size={18} />,
  };

  const handleStartClick = () => {
    // Pass all options, including the new mode
    onStart({ field, level, questionCount, mode });
  };

  return (
    <motion.div
      className="w-full max-w-2xl mx-auto space-y-8"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      {/* Field Selection */}
      <div>
        <label className="block text-lg text-gray-300 font-semibold mb-3 text-center">1. Select Field</label>
        <select
          className="w-full py-4 px-4 rounded-xl bg-gray-700 border border-gray-600 text-gray-200 text-lg appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all cursor-pointer text-center"
          value={field}
          onChange={(e) => setField(e.target.value)}
        >
          {FIELDS.map((f) => <option key={f} value={f}>{f}</option>)}
        </select>
      </div>

      {/* Difficulty Level */}
      <div>
        <label className="block text-lg text-gray-300 font-semibold mb-3 text-center">2. Select Difficulty</label>
        <div className="flex gap-4">
          {LEVELS.map((l) => (
            <motion.button key={l} onClick={() => setLevel(l)} className={buttonClass(level === l)} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              {l === 'Junior' ? <ChevronRight size={18} /> : l === 'Mid' ? <ChevronsRight size={18} /> : <Award size={18} />} {l}
            </motion.button>
          ))}
        </div>
      </div>
      
      {/* --- NEW: Mode Selection --- */}
      <div>
        <label className="block text-lg text-gray-300 font-semibold mb-3 text-center">3. Interview Mode</label>
        <div className="flex gap-4">
            {MODES.map((m) => (
                <motion.button key={m} onClick={() => setMode(m)} className={buttonClass(mode === m)} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    {iconMap[m]} {m}
                </motion.button>
            ))}
        </div>
      </div>

      {/* Number of Questions Slider */}
      <div>
        <label className="block text-lg text-gray-300 font-semibold mb-3 text-center">4. Number of Questions</label>
        <div className="w-full mx-auto">
          <input type="range" min="2" max="15" value={questionCount} onChange={(e) => setQuestionCount(parseInt(e.target.value))} className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:bg-blue-500" />
          <div className="text-center text-md text-gray-400 mt-2 font-bold">{questionCount} Questions</div>
        </div>
      </div>

      {/* Start Button */}
      <div className="pt-6">
        <motion.button onClick={handleStartClick} className="w-full py-4 px-6 rounded-xl text-xl font-bold bg-gradient-to-r from-blue-500 to-green-500 text-white shadow-xl hover:scale-105 transition-transform duration-200" whileTap={{ scale: 0.98 }}>
          Start Interview
        </motion.button>
      </div>
    </motion.div>
  );
}
