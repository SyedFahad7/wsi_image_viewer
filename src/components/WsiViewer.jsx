import React, { useEffect, useRef, useState } from "react";
import OpenSeadragon from "openseadragon";
import { ZoomIn, ZoomOut, Filter, Grid, X, RefreshCw } from "lucide-react";
import outputData from "./output.json";

const WsiViewer = ({ wsiImage }) => {
  const viewerRef = useRef(null);
  const osdViewer = useRef(null);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [filtersVisible, setFiltersVisible] = useState(false);
  const [brightness, setBrightness] = useState(100);
  const [contrast, setContrast] = useState(100);
  const [saturation, setSaturation] = useState(100);
  const [gamma, setGamma] = useState(100);
  const [gridSize, setGridSize] = useState(null);

  useEffect(() => {
    if (!wsiImage) {
      console.error("Image URL is missing!");
      return;
    }

    if (!osdViewer.current) {
      osdViewer.current = OpenSeadragon({
        id: "openseadragon-viewer",
        tileSources: {
          type: 'image',
          url: wsiImage,
        },
        showNavigator: false,
        defaultZoomLevel: 1,
        minZoomLevel: 0.5,
        maxZoomLevel: 50,
        visibilityRatio: 1,
        constrainDuringPan: true,
        showFullPageControl: false,
        showHomeControl: false,
        showZoomControl: false,
      });

      osdViewer.current.addHandler("zoom", () => {
        const zoom = osdViewer.current.viewport.getZoom();
        setZoomLevel(zoom);
      });

      // Draw bounding boxes from output.json
      let parsedResults;
      try {
          let fixedJsonString = outputData.inference_results
              .replace(/'/g, '"') // Replace single quotes with double quotes
              .replace(/\bNone\b/g, 'null') // Replace None with null
              .replace(/,(\s*[}\]])/g, '$1'); // Remove trailing commas
          parsedResults = JSON.parse(fixedJsonString);
      } catch (error) {
          console.error("Error parsing JSON:", error, "Problematic JSON:", outputData.inference_results);
          return;
      }
      

      const detectionResults = parsedResults?.output?.detection_results || [];
      if (!detectionResults.length) {
        console.warn("⚠️ No bounding boxes found in outputData.");
      }
      console.log(outputData.inference_results); // Inspect structure




      const overlay = osdViewer.current.svgOverlay();
      detectionResults.forEach(([x1, y1, x2, y2, label]) => {
        const rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
        rect.setAttribute("x", x1);
        rect.setAttribute("y", y1);
        rect.setAttribute("width", x2 - x1);
        rect.setAttribute("height", y2 - y1);
        rect.setAttribute("fill", "transparent");
        rect.setAttribute("stroke", "red");
        rect.setAttribute("stroke-width", "2");
        overlay.node().appendChild(rect);
      });
    } else {
      osdViewer.current.open({
        type: 'image',
        url: wsiImage,
      });
    }
  }, [wsiImage]);

  useEffect(() => {
    const viewerCanvas = document.querySelector("#openseadragon-viewer canvas");
    if (viewerCanvas) {
      viewerCanvas.style.filter = `brightness(${brightness}%) contrast(${contrast}%) saturate(${saturation}%) opacity(${gamma / 100})`;
    }
  }, [brightness, contrast, saturation, gamma]);

  const applyGrid = (size) => {
    setGridSize(size);
    const gridOverlay = document.getElementById("grid-overlay");
    if (gridOverlay) {
      gridOverlay.innerHTML = ""; // Clear previous grid
    } else {
      const grid = document.createElement("div");
      grid.id = "grid-overlay";
      grid.style.position = "absolute";
      grid.style.top = "0";
      grid.style.left = "0";
      grid.style.width = "100%";
      grid.style.height = "100%";
      grid.style.pointerEvents = "none"; // So it doesn't interfere with interactions
      grid.style.zIndex = "10";
      document.getElementById("openseadragon-viewer").appendChild(grid);
    }

    drawGrid(size);
  };

  const drawGrid = (size) => {
    const grid = document.getElementById("grid-overlay");
    if (!grid) return;

    grid.innerHTML = "";

    const step = 100 / size; 
    for (let i = 0; i < size; i++) {
      const vLine = document.createElement("div");
      vLine.style.position = "absolute";
      vLine.style.left = `${i * step}%`;
      vLine.style.top = "0";
      vLine.style.width = "1px";
      vLine.style.height = "100%";
      vLine.style.backgroundColor = "black";
      grid.appendChild(vLine);

      const hLine = document.createElement("div");
      hLine.style.position = "absolute";
      hLine.style.top = `${i * step}%`;
      hLine.style.left = "0";
      hLine.style.width = "100%";
      hLine.style.height = "1px";
      hLine.style.backgroundColor = "black";
      grid.appendChild(hLine);
    }
  };

  return (
    <div className="relative w-full h-full bg-gray-900 text-white">
      {/* Image Viewer */}
      <div id="openseadragon-viewer" className="w-full h-full"></div>

      {/* Zoom Display */}
      <div className="absolute top-5 right-5 bg-black bg-opacity-50 text-white p-2 rounded">
        Zoom: {zoomLevel.toFixed(2)}x
      </div>

      {/* Toolbar */}
      <div className="absolute bottom-5 left-5 flex space-x-2">
        <button className="p-2 bg-gray-800 text-white rounded" onClick={() => osdViewer.current.viewport.zoomBy(1.2)}>
          <ZoomIn size={20} />
        </button>
        <button className="p-2 bg-gray-800 text-white rounded" onClick={() => osdViewer.current.viewport.zoomBy(0.8)}>
          <ZoomOut size={20} />
        </button>
        <button className="p-2 bg-red-600 text-white rounded" onClick={() => osdViewer.current.viewport.goHome()}>
          <RefreshCw size={20} />
        </button>
        <button className="p-2 bg-blue-600 text-white rounded" onClick={() => setFiltersVisible(!filtersVisible)}>
          <Filter size={20} />
        </button>
        <button className="p-2 bg-green-600 text-white rounded" onClick={() => setGridSize(gridSize ? null : 10)}>
          <Grid size={20} />
        </button>
      </div>

      {gridSize && (
        <div className="absolute bottom-5 right-5 bg-black bg-opacity-50 text-white p-2 rounded flex space-x-2">
          {[10, 20, 40, 60, 100].map((size) => (
            <button
              key={size}
              onClick={() => applyGrid(size)}
              className={`p-2 rounded ${gridSize === size ? "bg-yellow-500" : "bg-gray-700"}`}
            >
              {size}x
            </button>
          ))}
        </div>
      )}

      {/* Filters Panel */}
      {filtersVisible && (
        <div className="absolute bottom-20 left-5 bg-black bg-opacity-50 p-4 rounded">
          <button className="absolute top-1 right-1 text-red-500" onClick={() => setFiltersVisible(false)}>
            <X size={18} />
          </button>
          <label>Brightness</label>
          <input type="range" min="50" max="200" value={brightness} onChange={(e) => setBrightness(Number(e.target.value))} />
          <label>Contrast</label>
          <input type="range" min="50" max="200" value={contrast} onChange={(e) => setContrast(Number(e.target.value))} />
          <label>Saturation</label>
          <input type="range" min="50" max="200" value={saturation} onChange={(e) => setSaturation(Number(e.target.value))} />
          <label>Gamma</label>
          <input type="range" min="50" max="200" value={gamma} onChange={(e) => setGamma(Number(e.target.value))} />
        </div>
      )}
    </div>
  );
};

export default WsiViewer;