from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv
import os
import shutil

from src.utils.file_utils import read_pdf
from src.services.classifier import classify_document
from src.services.llm_rename import suggest_filenames
from src.services.renamer import rename_file

load_dotenv()

app = FastAPI()

# CORS setup
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

UPLOAD_FOLDER = os.environ.get("UPLOAD_FOLDER")

# -------------------------
# Pydantic Models
# -------------------------

class FilenameRequest(BaseModel):
    filename: str

class RenameRequest(BaseModel):
    current_name: str
    new_name: str

# -------------------------
# Routes
# -------------------------

@app.post("/upload")
async def upload_file(file: UploadFile = File(...)):
    if not UPLOAD_FOLDER:
        raise HTTPException(status_code=500, detail="UPLOAD_FOLDER environment variable is not set.")
    file_location = os.path.join(UPLOAD_FOLDER, file.filename)
    with open(file_location, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    return {"filename": file.filename}

@app.post("/classify")
async def classify(req: FilenameRequest):
    try:
        pdf_text = read_pdf(req.filename)
        classification = classify_document(pdf_text)
        return {"classification": classification}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.post("/suggest-filenames")
async def suggest_filenames_endpoint(req: FilenameRequest):
    try:
        pdf_text = read_pdf(req.filename)
        classification = classify_document(pdf_text)
        suggestions = suggest_filenames(pdf_text, classification)
        return {"suggestions": suggestions}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.post("/rename")
async def rename(req: RenameRequest):
    try:
        rename_file(req.current_name, req.new_name)
        return {"message": f"File renamed to {req.new_name}"}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
