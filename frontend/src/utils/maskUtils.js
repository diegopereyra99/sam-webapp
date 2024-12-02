// src/utils/maskUtils.js

export const combineMasks = async (mask1Base64, mask2Base64) => {
  if (!mask1Base64) return mask2Base64;
  if (!mask2Base64) return mask1Base64;
  
  try {
    const img1 = new Image();
    const img2 = new Image();
    
    // Set image source from base64
    img1.src = mask1Base64;
    img2.src = mask2Base64;
    
    // Wait for both images to load
    await new Promise((resolve, reject) => {
      img1.onload = img2.onload = resolve;
      img1.onerror = img2.onerror = reject;
    });
    
    // Ensure images are the same size (resize to the smallest dimensions if necessary)
    const width = Math.min(img1.width, img2.width);
    const height = Math.min(img1.height, img2.height);
    
    // Create a canvas to draw and combine images
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = width;
    canvas.height = height;

    // Draw both images onto the canvas
    ctx.drawImage(img1, 0, 0, width, height);
    const imageData1 = ctx.getImageData(0, 0, width, height);
    
    ctx.clearRect(0, 0, width, height); // Clear the canvas for second image
    ctx.drawImage(img2, 0, 0, width, height);
    const imageData2 = ctx.getImageData(0, 0, width, height);
    
    // Perform bitwise OR on each pixel (grayscale - one channel)
    const resultImageData = ctx.createImageData(width, height);
    const data1 = imageData1.data;
    const data2 = imageData2.data;
    const resultData = resultImageData.data;

    for (let i = 0; i < data1.length; i++) {
      // Grayscale images: Take the grayscale channel and apply bitwise OR
      resultData[i] = data1[i] | data2[i];
    }

    // Put the result back onto the canvas
    ctx.putImageData(resultImageData, 0, 0);
    
    // Convert the canvas back to base64 PNG
    const resultBase64 = canvas.toDataURL('image/png');
    
    return resultBase64;
  } catch (error) {
    console.error('Error combining masks:', error);
    return null;
  }
};
  