import os

def rename_file(current_name: str, new_name: str) -> None:
    """
    Rename a file to a new name.
    
    Args:
        current_name (str): The current name of the document.
        new_name (str): The new name for the file.
    """

    # Get the directory where the file is located
    directory = os.environ.get("UPLOAD_FOLDER")

    # Check if the directory exists
    if not os.path.exists(directory):
        raise FileNotFoundError(f"The directory {directory} does not exist.")
    
    current_path = os.path.join(directory, current_name)
    new_path = os.path.join(directory, new_name)

    if not os.path.exists(current_path):
        raise FileNotFoundError(f"The file {current_name} does not exist in the directory {directory}.")
    
    os.rename(current_path, new_path)
    print(f"File renamed from {current_name} to {new_name}.")


