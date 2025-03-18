import React from 'react';
import { toScreenCoordinates } from '../utils/imageUtils';
import { useViewer } from '../contexts/ViewerContext';

const BoundingBox = ({ box }) => {
  const { scale, position, viewerSize } = useViewer();
  
  // Convert bounding box coordinates to screen coordinates
  const topLeft = toScreenCoordinates(box.x, box.y, scale, position, viewerSize);
  
  const width = box.width * scale;
  const height = box.height * scale;
  
  return (
    <div 
      className="absolute border-2 border-red-500 bg-red-500/20 pointer-events-none z-10"
      style={{
        left: `${topLeft.x}px`,
        top: `${topLeft.y}px`,
        width: `${width}px`,
        height: `${height}px`,
      }}
    >
      {box.label && (
        <div className="absolute -top-6 left-0 bg-red-500 text-white text-xs px-1 py-0.5 rounded">
          {box.label}
        </div>
      )}
    </div>
  );
};

export default BoundingBox;