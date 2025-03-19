import React, { useState } from 'react';
import SplashScreen from './components/SplashScreen';
import FindingsPanel from './components/FindingsPanel';
import WsiViewer from './components/WsiViewer';
import Header from './components/Header';

function App() {
  const [showSplash, setShowSplash] = useState(true);

  return (
    <>
      {showSplash && <SplashScreen onComplete={() => setShowSplash(false)} />}
      
      <div className="flex flex-col h-screen">
        <Header />
        
        <main className="flex flex-1 overflow-hidden">
          <div className="w-1/4 border-r border-gray-200 dark:border-gray-700">
            <FindingsPanel />
          </div>
          
          {/* Main Image Viewer */}
          <div className="w-full h-full">
            <WsiViewer wsiImage="/assets/sample_image.png" />
          </div>
        </main>
      </div>
    </>
  );
}

export default App;