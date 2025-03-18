import React from 'react';
import { useViewer } from '../contexts/ViewerContext';

const Controls = () => {
  const { scale, setScale, isDarkMode } = useViewer();
  
  const handleZoomIn = () => {
    setScale(prev => Math.min(prev * 1.2, 10));
  };
  
  const handleZoomOut = () => {
    setScale(prev => Math.max(prev / 1.2, 0.5));
  };
  
  const handleResetZoom = () => {
    setScale(1);
  };
  
  return (
    <div className={`fixed bottom-6 right-6 flex flex-col gap-2 ${isDarkMode ? 'text-white' : 'text-gray-700'}`}>
      <button
        onClick={handleZoomIn}
        className={`w-10 h-10 rounded-full ${
          isDarkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-white hover:bg-gray-100'
        } shadow-lg flex items-center justify-center`}
        aria-label="Zoom in"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
      </button>
      
      <button
        onClick={handleZoomOut}
        className={`w-10 h-10 rounded-full ${
          isDarkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-white hover:bg-gray-100'
        } shadow-lg flex items-center justify-center`}
        aria-label="Zoom out"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
        </svg>
      </button>
      
      <button
        onClick={handleResetZoom}
        className={`w-10 h-10 rounded-full ${
          isDarkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-white hover:bg-gray-100'
        } shadow-lg flex items-center justify-center`}
        aria-label="Reset zoom"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
      </button>
      
      <div className="w-10 h-10 rounded-full bg-white dark:bg-gray-700 shadow-lg flex items-center justify-center text-xs font-medium">
        {Math.round(scale * 100)}%
      </div>
    </div>
  );
};

export default Controls;