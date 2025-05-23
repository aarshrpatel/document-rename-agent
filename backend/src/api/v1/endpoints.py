from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.responses import JSONResponse
from src.utils.file_utils import read_pdf
from src.services.classifier import classify_document
from src.services.llm_rename import suggest_filenames
from src.services.renamer import rename_file
from dotenv import load_dotenv
import os
import shutil

load_dotenv()

app = FastAPI()

UPLOAD_FOLDER = os.environ.get("UPLOAD_FOLDER")

@app.post("/upload")
async def upload_file(file: UploadFile = File(...)):
    if not UPLOAD_FOLDER:
        raise HTTPException(status_code=500, detail="UPLOAD_FOLDER environment variable is not set.")
    file_location = os.path.join(UPLOAD_FOLDER, file.filename)
    with open(file_location, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    return {"filename": file.filename}

@app.post("/classify")
async def classify(filename: str):
    try:
        pdf_text = read_pdf(filename)
        classification = classify_document(pdf_text)
        return {"classification": classification}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.post("/suggest-filenames")
async def suggest_filenames_endpoint(filename: str):
    try:
        pdf_text = read_pdf(filename)
        classification = classify_document(pdf_text)
        suggestions = suggest_filenames(pdf_text, classification)
        return {"suggestions": suggestions}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
    
@app.post("/rename")
async def rename(current_name: str, new_name: str):
    try:
        rename_file(current_name, new_name)
        return {"message": f"File renamed to {new_name}"}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))