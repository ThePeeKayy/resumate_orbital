'use client'
import React, { useEffect, useState } from 'react';

export default function Hero () {
  const [rotation, setRotation] = useState(0);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setRotation(prev => (prev + 0.5) % 360);
    }, 50);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex bg-gray-700 pt-8 h-screen items-center justify-center w-full">
      <div className="relative flex justify-center mx-4">
        
        <div 
          className="relative w-64 h-80 bg-gray-100 rounded-lg"
          style={{ transform: `perspective(1000px) rotateY(${rotation}deg)` }}
        >
          <div className={`absolute inset-0 p-6`}>
            <div className="w-24 h-24 rounded-full bg-gray-200 mx-auto mb-4"></div>
            <div className="h-4 bg-gray-300 rounded w-3/4 mx-auto mb-3"></div>
            <div className="h-3 bg-gray-200 rounded w-full mb-2"></div>
            <div className="h-3 bg-gray-300 rounded w-full mb-2"></div>
            <div className="h-3 bg-gray-200 rounded w-5/6 mb-2"></div>
            <div className="h-3 bg-gray-300 rounded w-full mb-4"></div>
          </div>
          
          
        </div>
        
        <div className="m-8 text-center">
          <h1 className="text-2xl font-bold text-gray-200">Interview and Job AI Assistant</h1>
          <p className="text-gray-400 mt-2">AI Powered Interview Prep and Application Manager</p>
        </div>
      </div>
    </div>
  );
};

