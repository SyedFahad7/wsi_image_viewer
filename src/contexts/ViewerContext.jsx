import React, { createContext, useState, useContext, useEffect } from 'react';

const ViewerContext = createContext();

export const ViewerProvider = ({ children }) => {
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [viewerSize, setViewerSize] = useState({ width: 0, height: 0 });
  const [imageSize, setImageSize] = useState({ width: 0, height: 0 });
  const [boundingBoxes, setBoundingBoxes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    // Check for dark mode preference
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      document.documentElement.classList.add('dark');
      setIsDarkMode(true);
    }

    // Listen for changes in color scheme preference
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e) => {
      if (e.matches) {
        document.documentElement.classList.add('dark');
        setIsDarkMode(true);
      } else {
        document.documentElement.classList.remove('dark');
        setIsDarkMode(false);
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  // Load sample detection data
  useEffect(() => {
    const fetchDetectionData = async () => {
      try {
        const response = await fetch('/assets/detection.json');
        const data = await response.json();
        if (data.detection_results) {
          setBoundingBoxes(data.detection_results);
        }
      } catch (error) {
        console.error('Error loading detection data:', error);
        // Set sample data as fallback
        setBoundingBoxes([
          { x: 100, y: 100, width: 50, height: 50, label: "Sickle Cell" },
          { x: 200, y: 150, width: 60, height: 40, label: "Sickle Cell" },
          { x: 300, y: 200, width: 55, height: 45, label: "Sickle Cell" },
          { x: 400, y: 250, width: 45, height: 55, label: "Sickle Cell" },
          { x: 500, y: 300, width: 50, height: 50, label: "Sickle Cell" },
        ]);
      }
    };

    fetchDetectionData();
  }, []);

  const value = {
    scale,
    setScale,
    position,
    setPosition,
    viewerSize,
    setViewerSize,
    imageSize,
    setImageSize,
    boundingBoxes,
    loading,
    setLoading,
    isDarkMode,
  };

  return <ViewerContext.Provider value={value}>{children}</ViewerContext.Provider>;
};

export const useViewer = () => {
  const context = useContext(ViewerContext);
  if (!context) {
    throw new Error('useViewer must be used within a ViewerProvider');
  }
  return context;
};