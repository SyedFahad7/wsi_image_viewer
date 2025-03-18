import { useState, useEffect } from 'react';
import { useViewer } from '../contexts/ViewerContext';

const useImageLoader = (imageUrl) => {
  const [image, setImage] = useState(null);
  const [error, setError] = useState(null);
  const { setLoading, setImageSize } = useViewer();

  useEffect(() => {
    setLoading(true);
    
    const img = new Image();
    img.src = imageUrl;
    
    img.onload = () => {
      setImage(img);
      setImageSize({ width: img.width, height: img.height });
      setLoading(false);
    };
    
    img.onerror = (e) => {
      console.error('Error loading image:', e);
      setError('Failed to load image');
      setLoading(false);
    };
    
    return () => {
      img.onload = null;
      img.onerror = null;
    };
  }, [imageUrl, setLoading, setImageSize]);

  return { image, error };
};

export default useImageLoader;