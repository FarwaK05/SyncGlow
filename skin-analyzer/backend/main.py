# main.py (Final Polished Version)

import os
import httpx
import certifi
import logging
from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

load_dotenv()

app = FastAPI()

origins = [
    "http://localhost:3000",
    "http://localhost:5173",
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/analyze-skin/")
async def analyze_skin(file: UploadFile = File(...)):
    API_KEY = os.getenv("FACEPLUSPLUS_API_KEY")
    API_SECRET = os.getenv("FACEPLUSPLUS_API_SECRET")
    API_URL = "https://api-us.faceplusplus.com/facepp/v1/skinanalyze"

    if not all([API_KEY, API_SECRET]):
        logger.error("CRITICAL: API_KEY or API_SECRET is not loaded from .env file.")
        raise HTTPException(status_code=500, detail="Server configuration error: API keys are missing.")

    image_bytes = await file.read()

    data_payload = {
        'api_key': API_KEY,
        'api_secret': API_SECRET,
        'return_attributes': 'acne,dark_circle,skin_spot,mole,blackhead'
    }
    
    files_payload = {'image_file': (file.filename, image_bytes, file.content_type)}

    try:
        async with httpx.AsyncClient(verify=certifi.where()) as client:
            response = await client.post(API_URL, data=data_payload, files=files_payload, timeout=30.0)
        
        # This block now correctly handles API errors without being re-caught.
        if response.status_code != 200:
            logger.error(f"Face++ API returned a non-200 status: {response.status_code}")
            logger.error(f"Face++ API response body: {response.text}")
            
            try:
                error_details = response.json()
                error_message = error_details.get("error_message", "Unknown error from Face++ API.")
            except Exception:
                error_message = response.text
            
            # Raise an HTTPException with the status code from Face++
            raise HTTPException(
                status_code=response.status_code, # <-- Now correctly forwards 400, 403, etc.
                detail=f"Face++ API Error: {error_message}"
            )

        # If we reach here, the request was successful
        return response.json()

    except httpx.RequestError as e:
        logger.error(f"httpx.RequestError occurred: {e}", exc_info=True)
        raise HTTPException(status_code=502, detail=f"Failed to connect to the analysis provider: {str(e)}")
    
    # --- THIS IS THE KEY CHANGE ---
    # We removed the generic `except Exception as e:` because it was catching our
    # intended HTTPException. Now, only truly unexpected errors will result in a 500.
    # If you want to keep a generic catch-all, you must check for HTTPException specifically.
    # For now, removing it is cleaner.