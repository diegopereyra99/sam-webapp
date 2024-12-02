// Import Axios
import axios from "axios";

// Base URL for the API
const API_BASE_URL = "http://127.0.0.1:8000";

// Function to upload an image to the API
export async function uploadImage(file) {
    try {
        const formData = new FormData();
        formData.append("image", file);

        const response = await axios.post(`${API_BASE_URL}/upload`, formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });

        console.log("Upload response:", response.data);
        return response.data; // Return the response data
    } catch (error) {
        console.error("Error uploading image:", error.response || error.message);
        throw error;
    }
}

// Function to get the mask from the API based on clicks
export async function getMask(clicks) {
    try {
        const response = await axios.post(`${API_BASE_URL}/mask`, clicks, {
            headers: {
                "Content-Type": "application/json",
            },
        });
        
        if (response.data.mask) {
            // Return the mask as a base64 data URL
            return `data:image/png;base64,${response.data.mask}`;
        } else {
            throw new Error("No mask returned from the API.");
        }
    } catch (error) {
        console.error("Failed to get the mask:", error.response || error.message);
        throw error;
    }
}


