import './App.css';
import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import ImageCanvas from './components/ImageCanvas';
import { uploadImage, getMask } from './api/samApi';

function App() {
  const [imageSrc, setImageSrc] = useState(null); // Uploaded image source
  const [maskSrc, setMaskSrc] = useState(null); // Mask data (base64 or URL)
  const [clicks, setClicks] = useState([]); // List of clicks

  const handleUpload = () => {
    setImageSrc(null);
    setMaskSrc(null);
    setClicks([]);
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = async (e) => {
      const file = e.target.files[0];
      if (file) {
        setImageSrc(URL.createObjectURL(file));
        await uploadImage(file); // Upload the image to the backend
      }
    };
    input.click();
  };

  const handleSave = () => {
    if (maskSrc) {
      const link = document.createElement('a');
      link.href = `data:image/png;base64,${maskSrc}`;
      link.download = 'mask.png';
      link.click();
    } else {
      alert('No mask to save!');
    }
  };

  const handleReset = () => {
    // setImageSrc(null);
    setMaskSrc(null);
    setClicks([]); // Clear clicks
  };

  const handleAddClick = async (newClick) => {
    const updatedClicks = [...clicks, newClick];
    setClicks(updatedClicks); // Update the clicks state

    try {
      const base64_mask = await getMask(updatedClicks); // Fetch the new mask from the API
      setMaskSrc(base64_mask);

    } catch (error) {
      console.error('Error generating mask:', error);
    }
  };

  return (
    <div className="app">
      <Sidebar onUpload={handleUpload} onSave={handleSave} onReset={handleReset} />
      <ImageCanvas
        imageSrc={imageSrc}
        maskSrc={maskSrc}
        clicks={clicks}
        onAddClick={handleAddClick} // Pass function to add new clicks
      />
    </div>
  );
}

export default App;
