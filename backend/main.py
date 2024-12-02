from fastapi import FastAPI, File, UploadFile, Body
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from io import BytesIO
from PIL import Image, ImageDraw
import base64
from typing import List, Dict
import numpy as np
import torch
from sam2.sam2_image_predictor import SAM2ImagePredictor

hf_model_id = "facebook/sam2-hiera-small"

device = "cuda" if torch.cuda.is_available() else "cpu"

predictor = SAM2ImagePredictor.from_pretrained(hf_model_id, device=device)

app = FastAPI()

# Add CORS middleware to allow frontend to access backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Adjust this to your frontend URL
    allow_credentials=True,
    allow_methods=["*"],  # Allow all methods (GET, POST, etc.)
    allow_headers=["*"],  # Allow all headers
)

# Store the uploaded image temporarily
uploaded_image = None

@app.post("/upload")
async def upload_image(image: UploadFile = File(...)):
    """
    Accepts an image file, prints some details about it, and stores it for future processing.
    """
    global uploaded_image
    
    # Read the image content
    content = await image.read()
    
    # Store it temporarily (you can process this as needed later)
    uploaded_image = content  # Store raw content
    
    # Print image details
    print(f"Received image: {image.filename}")
    print(f"Content type: {image.content_type}")
    print(f"Image size: {len(content)} bytes")

    # Optionally, you can load the image into a PIL object for further processing
    img = Image.open(BytesIO(content))  # Convert the raw content to a PIL image
    
    # Print image size (in pixels)
    print(f"Image dimensions: {img.size} (width x height)")
    
    img = np.array(img.convert("RGB"))
    predictor.set_image(img)

    return {"message": "Image uploaded successfully, ready for further processing."}

@app.post("/mask")
async def get_mask(clicks: List[Dict[str, float]] = Body(...)):
    """
    Receives a list of clicks (coordinates and labels), prints them to the console,
    and returns a mask with a simple square in the center of the image's size.
    """
    if uploaded_image is None:
        return JSONResponse(content={"error": "No image uploaded yet!"}, status_code=400)
    
    # Log the clicks to the console for verification
    print("Received Clicks:")
    for click in clicks:
        print(click)
    
    # Simulating the image size; for simplicity, let's assume the image size is 500x500
    # img_width, img_height = Image.open(BytesIO(uploaded_image)).size
    
    input_points = np.array([[click["x"], click["y"]] for click in clicks])
    input_labels = np.array([click["label"] for click in clicks])
    
    masks, scores, _ = predictor.predict(
        point_coords=input_points,
        point_labels=input_labels,
        multimask_output=False,
    )

    # print(len(np.unique(masks[0])))
    
    mask = Image.fromarray((masks[0] * 255).astype(np.uint8))

    # Convert the mask to base64 to send it as a response (as an example)
    buffered = BytesIO()
    mask.save(buffered, format="PNG")
    mask_base64 = base64.b64encode(buffered.getvalue()).decode("utf-8")

    return {"mask": mask_base64}
