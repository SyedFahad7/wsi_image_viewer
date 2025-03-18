import React from 'react';
import { useViewer } from '../contexts/ViewerContext';

const FindingsPanel = () => {
  const { boundingBoxes, isDarkMode } = useViewer();

  // Sample findings data
  const slideInfo = {
    title: "Sickle Cell Anemia",
    sampleId: "SCA-2023-0142",
    collectionDate: "2023-06-15",
    magnification: "100x",
    stain: "Wright-Giemsa",
    findings: [
      {
        title: "Sickle-shaped Erythrocytes",
        description: "Numerous erythrocytes with characteristic sickle or crescent shape morphology indicating hemoglobin S polymerization.",
        count: boundingBoxes.length || 23
      },
      {
        title: "Howell-Jolly Bodies",
        description: "Nuclear remnants visible in several erythrocytes, commonly seen in patients with functional asplenia.",
        count: 8
      },
      {
        title: "Target Cells",
        description: "Increased number of target cells (codocytes) with central hemoglobinization.",
        count: 15
      },
      {
        title: "Polychromasia",
        description: "Presence of polychromatophilic erythrocytes indicating increased reticulocytosis in response to hemolytic anemia.",
        count: 12
      }
    ]
  };

  return (
    <div className={`h-full overflow-y-auto scrollbar-thin p-4 ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <h2 className="text-xl font-bold text-primary mb-4">{slideInfo.title}</h2>
      
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2">Slide Information</h3>
        <div className={`rounded-lg p-3 ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow-sm`}>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="text-gray-500 dark:text-gray-400">Sample ID:</div>
            <div className="font-medium">{slideInfo.sampleId}</div>
            
            <div className="text-gray-500 dark:text-gray-400">Collection Date:</div>
            <div className="font-medium">{slideInfo.collectionDate}</div>
            
            <div className="text-gray-500 dark:text-gray-400">Magnification:</div>
            <div className="font-medium">{slideInfo.magnification}</div>
            
            <div className="text-gray-500 dark:text-gray-400">Stain:</div>
            <div className="font-medium">{slideInfo.stain}</div>
          </div>
        </div>
      </div>
      
      <div>
        <h3 className="text-lg font-semibold mb-2">Clinical Findings</h3>
        {slideInfo.findings.map((finding, index) => (
          <div key={index} className={`mb-4 p-3 rounded-lg ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow-sm`}>
            <div className="flex items-center justify-between">
              <h4 className="font-medium">{finding.title}</h4>
              <span className={`px-2 py-1 rounded-full text-xs ${isDarkMode ? 'bg-blue-900 text-blue-200' : 'bg-blue-100 text-blue-800'}`}>
                Count: {finding.count}
              </span>
            </div>
            <p className="text-sm mt-2 text-gray-600 dark:text-gray-300">{finding.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FindingsPanel;