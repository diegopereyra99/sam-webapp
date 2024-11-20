import './App.css';
import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import ImageCanvas from './components/ImageCanvas';
import { uploadImage, getMask } from './api/samApi';  // Make sure these functions are implemented in samApi.js

function App() {
  const [imageSrc, setImageSrc] = useState(null);
  const [maskSrc, setMaskSrc] = useState(null);
  const [clicks, setClicks] = useState([]);

  const handleUpload = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = async (e) => {
      const file = e.target.files[0];
      if (file) {
        setImageSrc(URL.createObjectURL(file));  // Set the image source for displaying
        await uploadImage(file);  // Upload the image to the backend
      }
    };
    input.click();
  };

  const handleSave = () => {
    if (maskSrc) {
      const link = document.createElement('a');
      link.href = `data:image/png;base64,${maskSrc}`;  // Convert base64 to a downloadable image URL
      link.download = 'mask.png';
      link.click();
    } else {
      alert('No mask to save!');
    }
  };const handleClick = async (e) => {
    const stage = e.target.getStage();
    const pointerPosition = stage.getPointerPosition();
  
    color = e.evt.button === 0 ? 'green' : 'red';
  
    if (pointerPosition) {
      // Check if the click is inside the image
      const { x, y } = pointerPosition;
      if (
        x >= imageX && x <= imageX + imageWidth &&
        y >= imageY && y <= imageY + imageHeight
      ) {
        if (e.evt.preventDefault) {
          e.evt.preventDefault();  // Prevent the right-click context menu
        }
  
        // Convert the click coordinates to the image coordinates
        const imageClickX = (x - imageX) * (image.width / imageWidth);
        const imageClickY = (y - imageY) * (image.height / imageHeight);
  
        const newClick = {
          x: imageClickX,
          y: imageClickY,
          color,  // Mark left or right click
        };
  
        setClicks((prevClicks) => [...prevClicks, newClick]);
  
        // Send the clicks to the backend to get the mask
        try {
          const response = await getMask([...clicks, newClick]);
          if (response.data && response.data.mask) {
            setMaskSrc(response.data.mask);  // Set the mask image in base64 in the state
          }
        } catch (error) {
          console.error("Error uploading clicks to API:", error);
        }
      }
    }
  };
  const handleReset = () => {
    setImageSrc(null);
    setMaskSrc(null);
    setClicks([]);  // Reset the clicks state
  };

  return (
    <div className="app">
      <Sidebar onUpload={handleUpload} onSave={handleSave} onReset={handleReset} />
      <ImageCanvas imageSrc={imageSrc} maskSrc={maskSrc} clicks={clicks} onClick={handleClick} />
    </div>
  );
}

export default App;

