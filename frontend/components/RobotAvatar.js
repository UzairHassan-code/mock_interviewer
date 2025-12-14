// D:\mock_interview\frontend\components\RobotAvatar.js
import React, { useEffect } from "react";
import { motion, useAnimation } from "framer-motion";

const eyeVariants = {
  blink: {
    scaleY: [1, 0.1, 1],
    transition: {
      duration: 0.2,
      repeat: 1,
      repeatDelay: 4,
      ease: "easeInOut",
    },
  },
  thinking: {
    opacity: [1, 0.5, 1],
    transition: {
      duration: 1.2,
      repeat: Infinity,
      repeatType: "reverse",
      ease: "easeInOut",
    },
  },
  talking: {
    opacity: [1, 0.8, 1],
    transition: {
      duration: 0.3,
      repeat: Infinity,
      ease: "linear",
    },
  },
};

const mouthVariants = {
  neutral: { d: "M35 65 C40 70 60 70 65 65", pathLength: 1 },
  talking: {
    d: ["M35 65 C40 70 60 70 65 65", "M35 65 C40 75 60 75 65 65"],
    transition: {
      duration: 0.5,
      repeat: Infinity,
      repeatType: "reverse",
      ease: "easeInOut",
    },
  },
  thinking: {
    d: "M35 65 C40 68 60 68 65 65",
    pathLength: 1,
    transition: { duration: 0.5 },
  },
};

const RobotAvatar = ({ mood = "neutral", className = "" }) => {
  const eyeControls = useAnimation();
  const mouthControls = useAnimation();

  useEffect(() => {
    eyeControls.start("blink");
  }, [eyeControls]);

  useEffect(() => {
    if (mood === "talking") {
      mouthControls.start("talking");
      eyeControls.start("talking");
    } else if (mood === "thinking") {
      mouthControls.start("thinking");
      eyeControls.start("thinking");
    } else {
      mouthControls.start("neutral");
      eyeControls.stop();
      eyeControls.start("blink");
    }
  }, [mood, mouthControls, eyeControls]);

  return (
    <div className={`relative ${className} p-4`}>
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="relative z-10"
      >
        {/* Main Body */}
        <motion.path
          d="M25 25 Q25 15 35 15 H65 Q75 15 75 25 V75 C75 85 65 85 50 85 C35 85 25 85 25 75 V25 Z"
          fill="#f0f4f8"
          stroke="#e2e8f0"
          strokeWidth="2"
        />

        {/* Head */}
        <motion.path
          d="M20 20 Q20 5 35 5 H65 Q80 5 80 20 V35 Q80 45 70 45 H30 Q20 45 20 35 V20 Z"
          fill="#f0f4f8"
          stroke="#e2e8f0"
          strokeWidth="2"
        />

        {/* Head's Inner Screen */}
        <motion.path
          d="M25 25 Q25 15 35 15 H65 Q75 15 75 25 V35 Q75 40 65 40 H35 Q25 40 25 35 V25 Z"
          fill="#1f2937"
          stroke="#374151"
          strokeWidth="1"
        />

        {/* Antennae */}
        <motion.circle cx="35" cy="5" r="4" fill="#60a5fa" />
        <motion.circle cx="65" cy="5" r="4" fill="#60a5fa" />

        {/* Eyes */}
        <g>
          <motion.circle
            cx="40"
            cy="27"
            r="5"
            fill="white"
            className="drop-shadow-lg"
            variants={eyeVariants}
            animate={eyeControls}
          />
          <motion.circle
            cx="60"
            cy="27"
            r="5"
            fill="white"
            className="drop-shadow-lg"
            variants={eyeVariants}
            animate={eyeControls}
          />
        </g>

        {/* Mouth */}
        <motion.path
          stroke="#cbd5e1"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
          variants={mouthVariants}
          animate={mouthControls}
        />
        
        {/* Arms */}
        <motion.path
          d="M18 45 Q15 60 18 75"
          stroke="#94a3b8"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
        <motion.path
          d="M82 45 Q85 60 82 75"
          stroke="#94a3b8"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />

        {/* Hands/Claws */}
        <motion.path
          d="M10 80 L20 80 Q25 85 20 90 L10 90 Q5 85 10 80 Z"
          fill="#60a5fa"
          stroke="#3b82f6"
          strokeWidth="2"
        />
        <motion.path
          d="M80 80 L90 80 Q95 85 90 90 L80 90 Q75 85 80 80 Z"
          fill="#60a5fa"
          stroke="#3b82f6"
          strokeWidth="2"
        />
      </svg>
    </div>
  );
};

export default RobotAvatar;
