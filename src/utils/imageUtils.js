// Convert real coordinates to screen coordinates
export const toScreenCoordinates = (x, y, scale, position, viewerSize) => {
    return {
      x: (x * scale) + position.x + viewerSize.width / 2,
      y: (y * scale) + position.y + viewerSize.height / 2
    };
  };
  
  // Convert screen coordinates to real coordinates
  export const toWorldCoordinates = (x, y, scale, position, viewerSize) => {
    return {
      x: (x - position.x - viewerSize.width / 2) / scale,
      y: (y - position.y - viewerSize.height / 2) / scale
    };
  };
  
  // Calculate view box in hub view
  export const calculateViewBox = (scale, position, viewerSize, imageSize, hubSize) => {
    // Calculate image dimensions in hub view
    const hubImageWidth = hubSize.width;
    const hubImageHeight = hubSize.height;
    
    // Calculate the scale ratio between hub view and original image
    const hubScale = Math.min(hubImageWidth / imageSize.width, hubImageHeight / imageSize.height);
    
    // Calculate visible area dimensions at current zoom level
    const visibleWidth = viewerSize.width / scale;
    const visibleHeight = viewerSize.height / scale;
    
    // Calculate center position in world coordinates
    const centerX = -position.x / scale;
    const centerY = -position.y / scale;
    
    // Calculate top-left corner of the visible area
    const visibleLeft = centerX - visibleWidth / 2;
    const visibleTop = centerY - visibleHeight / 2;
    
    // Convert to hub coordinates
    return {
      x: visibleLeft * hubScale,
      y: visibleTop * hubScale,
      width: visibleWidth * hubScale,
      height: visibleHeight * hubScale
    };
  };