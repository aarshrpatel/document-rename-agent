import os 
from PyPDF2 import PdfReader

def read_pdf(file_name: str) -> str:
    """
    Read the content of a PDF file and return it as a string.
    
    Args:
        file_name (str): The name of the PDF file to read.
        
    Returns:
        str: The content of the PDF file.
    """
    
    # Get the directory where the file is located
    directory = os.environ.get("UPLOAD_FOLDER")

    # Check if the directory existsif not directory:
    if not directory:
        raise EnvironmentError("UPLOAD_FOLDER environment variable is not set.")

    file_path = os.path.join(directory, file_name)
    if not os.path.exists(file_path):
        raise FileNotFoundError(f"The file {file_name} does not exist in the directory {directory}.")
    
    # Read the PDF file
    text = ""
    with open(file_path, "rb") as file:
        reader = PdfReader(file)
        for page in reader.pages:
            text += page.extract_text() + "\n" or ""
    return text
