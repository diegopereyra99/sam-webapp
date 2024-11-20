import axios from 'axios';

// Upload the image to the server (Backend)
export const uploadImage = async (file) => {
  const formData = new FormData();
  formData.append('image', file);

  try {
    const response = await axios.post('http://127.0.0.1:8000/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    console.log('Image uploaded:', response.data);
  } catch (error) {
    console.error('Error uploading image:', error);
  }
};

// Send the clicks to the server to get the mask
export const getMask = async (clicks) => {
  try {
    const response = await axios.post('http://127.0.0.1:8000/mask', { clicks });
    console.log('Mask generated:', response.data);
    return response.data.maskUrl;  // Ensure the backend returns the mask URL or data
  } catch (error) {
    console.error('Error generating mask:', error);
    return null;
  }
};
