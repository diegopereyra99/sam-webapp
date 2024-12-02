
# SAM WebApp

A simple web application integrating the Segment Anything Model (SAM) for efficient image segmentation. This project includes a Python-based backend and a React-powered frontend.


![Demo](path/to/demo.gif)


## Prerequisites

- **Backend**: Python >= 3.10
- **Frontend**: Node.js >= 14.x and npm or yarn

Ensure you have these installed on your system before proceeding.

---

## Installation and Setup

### 1. Backend Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/diegopereyra99/sam-webapp.git
   cd sam-webapp/backend
   ```

2. Create a virtual environment and activate it:
   ```bash
   python -m venv venv
   source venv/bin/activate  # Linux/macOS
   venv\Scripts\activate   # Windows
   ```

3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Run the backend API:
   ```bash
   uvicorn main:app --port 8000
   ```

The backend should now be running at `http://localhost:8000`.

---

### 2. Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd ../frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```

The frontend should be accessible at `http://localhost:3000`.

---

## Running the Application

1. Start the backend as described in the **Backend Setup** section.
   - If running in a more powerful instance, forward the backend to `localhost:8000` using SSH or port forwarding (the frontend hits the API there).

2. Start the frontend as described in the **Frontend Setup** section.

4. Access the web app at `http://localhost:3000`.



---

## Usage

Upload an image through the frontend interface, and for each click the SAM mask will be generated connecting to the backend and displayed in the webapp. Each mask can be hold to combine and overlap them, once finished it can be saved.

---

## Acknowledgements

- Segment Anything Model ([SAM](https://segment-anything.com))  
- Built using [React](https://reactjs.org/) and [FastAPI](https://fastapi.tiangolo.com/).
