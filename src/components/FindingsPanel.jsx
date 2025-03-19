import React from 'react';
import { useViewer } from '../contexts/ViewerContext';

const FindingsPanel = () => {
  const { boundingBoxes, isDarkMode } = useViewer();

  const slideInfo = {
    title: "Histopathology Slide: Squamous Epithelium Biopsy",
    sampleId: "BIO-2025-0342",
    collectionDate: "2025-03-15",
    magnification: "40x",
    stain: "Hematoxylin & Eosin (H&E)",
    findings: [
      {
        title: "Epithelial Dysplasia",
        description: "Irregular epithelial growth with nuclear pleomorphism and increased mitotic activity.",
        count: boundingBoxes.length || 12
      },
      {
        title: "Inflammatory Infiltrate",
        description: "Lymphocytic and macrophage infiltration indicative of chronic inflammation.",
        count: 7
      },
      {
        title: "Fibrosis",
        description: "Excessive deposition of extracellular matrix proteins leading to tissue scarring.",
        count: 5
      }
    ]
  };

  return (
    <div className={`h-full overflow-y-auto scrollbar-thin p-4 ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <h2 className="text-2xl font-bold text-primary mb-4 text-white">{slideInfo.title}</h2>
      
      <div className="mb-6">
        <h3 className="text-lg text-white font-semibold mb-2">Slide Information</h3>
        <div className={`rounded-lg p-4 ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow-sm transition-transform transform hover:scale-105`}>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="text-gray-400 text-white">Sample ID:</div>
            <div className="font-medium text-white">{slideInfo.sampleId}</div>
            
            <div className="text-gray-400 text-white">Collection Date:</div>
            <div className="font-medium text-white">{slideInfo.collectionDate}</div>
            
            <div className="text-gray-400 text-white">Magnification:</div>
            <div className="font-medium text-white">{slideInfo.magnification}</div>
            
            <div className="text-gray-400 text-white">Stain:</div>
            <div className="font-medium text-white">{slideInfo.stain}</div>
          </div>
        </div>
      </div>
      
      <div>
        <h3 className="text-lg font-semibold mb-2 text-white">Clinical Findings</h3>
        {slideInfo.findings.map((finding, index) => (
          <div key={index} className={`mb-4 p-4 rounded-lg ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow-sm transition-transform transform hover:scale-105`}>
            <div className="flex items-center justify-between">
              <h4 className="font-medium text-white">{finding.title}</h4>
              <span className={`px-2 py-1 rounded-full text-xs ${isDarkMode ? 'bg-blue-900 text-blue-200' : 'bg-blue-100 text-blue-800'}`}>
                Count: {finding.count}
              </span>
            </div>
            <p className="text-sm mt-2 text-gray-300 text-white">{finding.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FindingsPanel;
