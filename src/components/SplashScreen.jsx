import React, { useEffect, useState } from 'react';

const SplashScreen = ({ onComplete }) => {
  const [fading, setFading] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setFading(true);
      const fadeTimer = setTimeout(onComplete, 1000);
      return () => clearTimeout(fadeTimer);
    }, 2000);

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div 
      className={`fixed inset-0 bg-primary flex flex-col items-center justify-center z-50 transition-opacity duration-1000 ${
        fading ? 'opacity-0' : 'opacity-100'
      }`}
    >
      <div className="animate-pulse-slow">
        <svg className="w-32 h-32" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="40" stroke="white" strokeWidth="3" fill="none" />
          <path 
            d="M 30 50 L 45 60 L 70 30" 
            stroke="white" 
            strokeWidth="5" 
            fill="none" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          />
        </svg>
      </div>
      <h1 className="text-white text-3xl font-bold mt-6">Whole Slide Viewer</h1>
      <p className="text-white text-lg mt-2">Loading high-resolution slide...</p>
      <div className="mt-8 relative w-64 h-2 bg-white/30 rounded-full overflow-hidden">
        <div className="absolute top-0 left-0 h-full bg-white rounded-full animate-pulse w-full"></div>
      </div>
    </div>
  );
};

export default SplashScreen;