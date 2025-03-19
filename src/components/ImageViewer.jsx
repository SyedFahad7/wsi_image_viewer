import React, { useEffect, useRef, useState } from "react";
import OpenSeadragon from "openseadragon";
import { ZoomIn, ZoomOut, Filter, Grid, X, Move, Maximize, Minimize, PlusCircle } from "lucide-react";

const ImageViewer = ({ imageUrl }) => {
  const viewerRef = useRef(null);
  const osdViewer = useRef(null);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [filtersVisible, setFiltersVisible] = useState(false);
  const [brightness, setBrightness] = useState(100);
  const [contrast, setContrast] = useState(100);
  const [saturation, setSaturation] = useState(100);
  const [gamma, setGamma] = useState(100);
  const [gridSize, setGridSize] = useState(null);
  const [activeElement, setActiveElement] = useState(null);
  const [elementSize, setElementSize] = useState(50);
  const [dragging, setDragging] = useState(false);
  const [elementPosition, setElementPosition] = useState({ x: "50%", y: "50%" });
  const [elementOptionsVisible, setElementOptionsVisible] = useState(false);

  useEffect(() => {
    if (!imageUrl) {
      console.error("Image URL is missing!");
      return;
    }

    if (!osdViewer.current) {
      osdViewer.current = OpenSeadragon({
        id: "openseadragon-viewer",
        tileSources: imageUrl,
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
    } else {
      osdViewer.current.open(imageUrl);
    }
  }, [imageUrl]);

  useEffect(() => {
    const viewerCanvas = document.querySelector("#openseadragon-viewer canvas");
    if (viewerCanvas) {
      viewerCanvas.style.filter = `brightness(${brightness}%) contrast(${contrast}%) saturate(${saturation}%) 
                                   opacity(${gamma / 100})`;
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

    const step = 500 / size; 
    for (let i = 0; i < size; i++) {

      const vLine = document.createElement("div");
      vLine.style.position = "absolute";
      vLine.style.left = `${i * step}%`;
      vLine.style.top = "0";
      vLine.style.width = "1px";
      vLine.style.height = "100%";
      vLine.style.backgroundColor = "black";
      grid.appendChild(vLine);

      // Horizontal lines
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

  const handleElementClick = (type) => {
    setActiveElement(activeElement === type ? null : type);
  };

  const handleElementDragStart = (e) => {
    setDragging(true);
  };

  const handleElementDragEnd = (e) => {
    setDragging(false);
  };

  const handleElementDrag = (e) => {
    if (dragging) {
      const element = document.getElementById("active-element");
      if (element) {
        const rect = element.getBoundingClientRect();
        setElementPosition({
          x: e.clientX - rect.width / 2,
          y: e.clientY - rect.height / 2,
        });
      }
    }
  };

  const handleElementResize = (e) => {
    setElementSize(e.target.value);
  };

  return (
    <div className="relative w-full h-full bg-gray-900 text-white" onMouseMove={handleElementDrag} onMouseUp={handleElementDragEnd}>
      {/* Image Viewer */}
      <div id="openseadragon-viewer" className="w-full h-full"></div>

      {/* Zoom Display */}
      <div className="absolute top-5 right-5 bg-black bg-opacity-50 text-white p-2 rounded">
        Zoom: {zoomLevel.toFixed(2)}x | Scale: {Math.max(5 - zoomLevel * 1.5, 0.1)} mm
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
          Reset
        </button>
        <button className="p-2 bg-blue-600 text-white rounded" onClick={() => setFiltersVisible(!filtersVisible)}>
          <Filter size={20} />
        </button>
        <button className="p-2 bg-green-600 text-white rounded" onClick={() => setGridSize(gridSize ? null : 10)}>
          <Grid size={20} />
        </button>
        <button className="p-2 bg-purple-600 text-white rounded" onClick={() => setElementOptionsVisible(!elementOptionsVisible)}>
          <PlusCircle size={20} />
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
          <input type="range" min="50" max="200" value={brightness} onChange={(e) => setBrightness(e.target.value)} />
          <label>Contrast</label>
          <input type="range" min="50" max="200" value={contrast} onChange={(e) => setContrast(e.target.value)} />
          <label>Saturation</label>
          <input type="range" min="50" max="200" value={saturation} onChange={(e) => setSaturation(e.target.value)} />
          <label>Gamma</label>
          <input type="range" min="50" max="200" value={gamma} onChange={(e) => setGamma(e.target.value)} />
        </div>
      )}

      {/* Element Options */}
      {elementOptionsVisible && (
        <div className="absolute bottom-20 right-5 bg-black bg-opacity-50 p-4 rounded">
          <button className="absolute top-1 right-1 text-red-500" onClick={() => setElementOptionsVisible(false)}>
            <X size={18} />
          </button>
          <button className="p-2 bg-gray-800 text-white rounded" onClick={() => handleElementClick("line")}>
            <Move size={20} />
          </button>
          <button className="p-2 bg-gray-800 text-white rounded" onClick={() => handleElementClick("cross")}>
            <X size={20} />
          </button>
          <input
            type="range"
            min="20"
            max="100"
            value={elementSize}
            onChange={handleElementResize}
            className="p-2 bg-gray-800 text-white rounded"
          />
        </div>
      )}

      {/* Active Element */}
      {activeElement && (
        <div
          id="active-element"
          className="absolute"
          style={{
            width: `${elementSize}px`,
            height: `${elementSize}px`,
            left: elementPosition.x,
            top: elementPosition.y,
            cursor: "move",
          }}
          onMouseDown={handleElementDragStart}
          onMouseUp={handleElementDragEnd}
        >
          {activeElement === "line" && <div className="w-full h-1 bg-red-500"></div>}
          {activeElement === "cross" && (
            <div className="relative w-full h-full">
              <div className="absolute w-1 h-full bg-red-500 left-1/2 transform -translate-x-1/2"></div>
              <div className="absolute h-1 w-full bg-red-500 top-1/2 transform -translate-y-1/2"></div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ImageViewer;