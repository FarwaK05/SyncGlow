# main.py (Final Version for Face++ v1 - Corrected Attributes)

import os
import httpx
import certifi
from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

load_dotenv()
app = FastAPI()
origins = ["http://localhost:3000", "http://localhost:5173"]
app.add_middleware(CORSMiddleware, allow_origins=origins, allow_credentials=True, allow_methods=["*"], allow_headers=["*"])

@app.post("/analyze-skin/")
async def analyze_skin(file: UploadFile = File(...)):
    API_KEY = os.getenv("FACEPLUSPLUS_API_KEY")
    API_SECRET = os.getenv("FACEPLUSPLUS_API_SECRET")
    API_URL = "https://api-us.faceplusplus.com/facepp/v1/skinanalyze"

    if not all([API_KEY, API_SECRET]):
        raise HTTPException(status_code=500, detail="Server configuration is incomplete.")

    image_bytes = await file.read()

    # --- THIS IS THE CRITICAL CHANGE ---
    # We are now using only the attributes supported by the v1 API.
    data_payload = {
        'api_key': API_KEY,
        'api_secret': API_SECRET,
        'return_attributes': 'acne,dark_circle,skin_spot,mole,blackhead,skin_type'
    }
    # --- END OF CHANGE ---
    
    files_payload = {'image_file': (file.filename, image_bytes, file.content_type)}

    try:
        async with httpx.AsyncClient(verify=certifi.where()) as client:
            response = await client.post(API_URL, data=data_payload, files=files_payload, timeout=30.0)
        response.raise_for_status() 
        response_json = response.json()
        if 'error_message' in response_json:
            raise HTTPException(status_code=400, detail=f"Face++ API Error: {response_json['error_message']}")
        return response_json
    except httpx.RequestError as e:
        raise HTTPException(status_code=502, detail="Failed to connect to the analysis provider (httpx).")