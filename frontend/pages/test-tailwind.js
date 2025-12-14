// pages/test-tailwind.js

import React from 'react';

export default function TailwindTestPage() {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full p-8 bg-white rounded-xl shadow-lg">
        <h1 className="text-4xl font-bold text-center text-blue-600 mb-4">
          Tailwind CSS is working!
        </h1>
        <p className="text-center text-gray-700 mb-6">
          If you can see a styled, centered card with a blue button below, your Tailwind configuration is correct.
        </p>
        <button className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition-colors duration-200 ease-in-out">
          Click Me
        </button>
      </div>
    </div>
  );
}
