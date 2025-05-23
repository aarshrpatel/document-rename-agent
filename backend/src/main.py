from utils.file_utils import read_pdf
from services.classifier import classify_document
from services.llm_rename import suggest_filenames
from services.renamer import rename_file
from dotenv import load_dotenv

load_dotenv()

FILENAME = "short_trip_amc.pdf"
pdf_text = read_pdf(FILENAME)
classification = classify_document(pdf_text)
suggestions = suggest_filenames(pdf_text, classification)
print(f"Classification: {classification}")
for s in suggestions:
    print(s)

rename_file(FILENAME, suggestions[0])