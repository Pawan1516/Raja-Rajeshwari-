/**
 * Dynamically generates a grayscale depth map from a 2D image source
 * using pixel luminance analysis and radial depth weighting.
 * 
 * Resizes the image to a standardized resolution (512px width)
 * to maintain excellent performance and smooth displacement maps.
 */
export function createLuminanceDepthMap(imageSrc) {
  return new Promise((resolve) => {
    const img = new Image();
    
    // Enable cross-origin resource sharing for external image domains (like Unsplash)
    img.crossOrigin = 'anonymous';
    
    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        canvas.width = Math.min(img.width, 512); // Standardize resolution for WebGL performance
        canvas.height = Math.round(canvas.width * (img.height / img.width));
        
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        
        const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imgData.data;
        
        const cx = canvas.width / 2;
        const cy = canvas.height / 2;
        const maxDist = Math.sqrt(cx * cx + cy * cy);
        
        for (let i = 0; i < data.length; i += 4) {
          const r = data[i];
          const g = data[i + 1];
          const b = data[i + 2];
          
          // Calculate brightness (luminance)
          const luminance = 0.299 * r + 0.587 * g + 0.114 * b;
          
          // Apply a radial distance factor to pull the center forward and keep edges further back
          const px = (i / 4) % canvas.width;
          const py = Math.floor((i / 4) / canvas.width);
          const dist = Math.sqrt((px - cx) * (px - cx) + (py - cy) * (py - cy));
          
          // centerFactor goes from 1.0 (center) down to 0.5 (edges)
          const centerFactor = 1.0 - (dist / maxDist) * 0.5;
          let depthVal = luminance * centerFactor;
          
          // Clamp and assign back as grayscale
          depthVal = Math.min(255, Math.max(0, depthVal));
          data[i] = depthVal;
          data[i + 1] = depthVal;
          data[i + 2] = depthVal;
        }
        
        ctx.putImageData(imgData, 0, 0);
        resolve(canvas.toDataURL('image/jpeg', 0.85));
      } catch (err) {
        console.error('Error generating depth map in canvas:', err);
        resolve(null); // Fallback gracefully if canvas reading is blocked by CORS
      }
    };
    
    img.onerror = (err) => {
      console.error('Failed to load image for depth map generation:', err);
      resolve(null); // Fallback gracefully
    };
    
    img.src = imageSrc;
  });
}
