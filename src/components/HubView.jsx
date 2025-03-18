import React, { useEffect, useRef, useState } from "react";
import OpenSeadragon from "openseadragon";
import { useViewer } from "../contexts/ViewerContext";

const HubView = ({ imageUrl }) => {
  const { scale, position, viewerSize, imageSize, isDarkMode } = useViewer();
  const viewerRef = useRef(null);
  const osdViewer = useRef(null);
  const [hubSize, setHubSize] = useState({ width: 0, height: 0 });

  // Get hub view size on mount and resize
  useEffect(() => {
    const updateSize = () => {
      if (viewerRef.current) {
        const { width, height } = viewerRef.current.getBoundingClientRect();
        setHubSize({ width, height });
      }
    };

    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  // Initialize OpenSeadragon for HubView
  useEffect(() => {
    if (!imageUrl || !hubSize.width || !hubSize.height) return;

    if (!osdViewer.current) {
      osdViewer.current = OpenSeadragon({
        id: "hub-openseadragon-viewer",
        tileSources: imageUrl,
        showNavigator: false,
        defaultZoomLevel: 1,
        minZoomLevel: 0.5,
        maxZoomLevel: 200,
        visibilityRatio: 1,
        constrainDuringPan: true,
      });
    } else {
      osdViewer.current.open(imageUrl);
    }
  }, [imageUrl, hubSize]);

  return (
    <div
      ref={viewerRef}
      className={`relative w-full h-full overflow-hidden border-2 border-primary rounded-lg ${
        isDarkMode ? "bg-gray-800" : "bg-white"
      }`}
    >
      <div id="hub-openseadragon-viewer" className="w-full h-full"></div>
    </div>
  );
};

export default HubView;
