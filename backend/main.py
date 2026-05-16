import cv2
import numpy as np
from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
import base64
import io
from PIL import Image

app = FastAPI()

# Enable CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def analyze_image(image_bytes):
    # Convert bytes to numpy array
    nparr = np.frombuffer(image_bytes, np.uint8)
    img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
    
    if img is None:
        return {"error": "Invalid image"}

    # 1. Check brightness
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    brightness = np.mean(gray)
    
    # 2. Check blur (Laplacian variance)
    blur_value = cv2.Laplacian(gray, cv2.CV_64F).var()
    
    # Thresholds (can be adjusted)
    is_dark = brightness < 50
    is_blurry = blur_value < 100
    
    # Placeholder for YOLO detection
    # In a real scenario, we would load a model: 
    # model = YOLO('path/to/model.pt')
    # results = model(img)
    
    feedback = []
    detections = []
    status = "pending"
    
    # 1. Image Quality Checks
    is_dark = brightness < 40
    is_blurry = blur_value < 50
    
    if is_dark:
        feedback.append("A iluminação está um pouco baixa, consegue clarear mais?")
    if is_blurry:
        feedback.append("A foto ficou tremida. Tente segurar o celular com mais firmeza.")

    # 2. YOLO Mock Logic
    if not is_dark and not is_blurry:
        detections = [
            {"class": 0, "label": "Caixa", "confidence": 0.95, "bbox": [100, 100, 200, 300]},
            {"class": 1, "label": "Cano", "confidence": 0.88, "bbox": [150, 400, 50, 200]},
            {"class": 2, "label": "Porta", "confidence": 0.92, "bbox": [110, 110, 180, 280]}
        ]
        status = "approved"
        feedback.append("Perfeito! Tudo certo para a vistoria.")
    else:
        status = "rejected"

    return {
        "status": status,
        "quality": {
            "brightness": float(brightness),
            "blur": float(blur_value),
            "is_dark": bool(is_dark),
            "is_blurry": bool(is_blurry)
        },
        "detections": detections,
        "feedback": feedback
    }

@app.get("/")
async def root():
    return {"message": "Saneago Tech API is running"}

@app.post("/analyze")
async def analyze(file: UploadFile = File(...)):
    contents = await file.read()
    result = analyze_image(contents)
    return result

@app.post("/analyze-frame")
async def analyze_frame(data: dict):
    # For real-time frames sent as base64
    image_data = data.get("image")
    if not image_data:
        return {"error": "No image data"}
    
    # Remove header if exists (e.g., "data:image/jpeg;base64,")
    if "," in image_data:
        image_data = image_data.split(",")[1]
        
    image_bytes = base64.b64decode(image_data)
    result = analyze_image(image_bytes)
    return result

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
