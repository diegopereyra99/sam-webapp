import './App.css';
import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import ImageCanvas from './components/ImageCanvas';
import { uploadImage, getMask } from './api/samApi';
import { combineMasks } from './utils/maskUtils';

function App() {
  const [imageSrc, setImageSrc] = useState(null); // Uploaded image source
  const [baseMask, setBaseMask] = useState(null); // Base mask (base64 or URL)
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

  const handleSave = async () => {
    if (maskSrc) {
      try {
        const base64Data = maskSrc.replace(/^data:image\/png;base64,/, '');
        const blob = new Blob([Uint8Array.from(atob(base64Data), (c) => c.charCodeAt(0))], {
          type: 'image/png',
        });

        const handle = await window.showSaveFilePicker({
          suggestedName: 'mask.png',
          types: [
            {
              description: 'PNG image',
              accept: { 'image/png': ['.png'] },
            },
          ],
        });

        const writable = await handle.createWritable();
        await writable.write(blob);
        await writable.close();

        console.log('File saved successfully!');
      } catch (error) {
        console.error('Error saving file:', error);
      }
    } else {
      alert('No mask to save!');
    }
  };

  const handleAddClick = async (newClick) => {
    const updatedClicks = [...clicks, newClick];
    setClicks(updatedClicks); // Update the clicks state

    try {
      const mask_resp = await getMask(updatedClicks);
      const combinedMaskBase64 = await combineMasks(mask_resp, baseMask);
      console.log('Combined mask:', combinedMaskBase64);
      setMaskSrc(combinedMaskBase64);
    } catch (error) {
      console.error('Error generating mask:', error);
    }
  };

  const handleHoldMask = async () => {
    if (!maskSrc) {
      alert('No mask to hold!');
      return;
    }

    try {
      setClicks([]);
      if (!baseMask) {
        setBaseMask(maskSrc);
      } else {
        const combinedMaskBase64 = await combineMasks(maskSrc, baseMask);
        setBaseMask(combinedMaskBase64);
      }
      console.log('Mask held successfully!');
    } catch (error) {
      console.error('Error holding mask:', error);
    }
  };

  const handleReset = () => {
    setMaskSrc(null);
    setBaseMask(null); // Clear the base mask on reset
    setClicks([]);
  };

  return (
    <div className="app">
      <Sidebar onUpload={handleUpload} onHold={handleHoldMask} onSave={handleSave} onReset={handleReset} />
      <ImageCanvas
        imageSrc={imageSrc}
        maskSrc={maskSrc} // Use combined mask if available, else use maskSrc
        clicks={clicks}
        onAddClick={handleAddClick} // Pass function to add new clicks
      />
    </div>
  );
}

export default App;
