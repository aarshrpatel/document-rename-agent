import os
from anthropic import Anthropic

def classify_document(text: str) -> str:
    """
    Sends the document text to Anthropic LLM for classification using the Messages API.

    Args:
        text (str): The extracted text from the document.
        prompt (str): The prompt to guide classification.

    Returns:
        str: The classification result from the LLM.
    """
    api_key = os.environ.get("ANTHROPIC_API_KEY")
    if not api_key:
        raise EnvironmentError("ANTHROPIC_API_KEY environment variable is not set.")

    client = Anthropic(api_key=api_key)

    prompt = (
        "You are a document classifier. Classify the document text into one of the following categories: "
        "Statement, Legal, Invoice, Contract, Report, or Other. "
        "Only return the category name, and nothing else."
    )
    message = f"{prompt}\n\n{text[:4000]}"  # Truncate to avoid token limits

    response = client.messages.create(
        model="claude-3-haiku-20240307",  # Or another Claude 3 model
        max_tokens=256,
        messages=[{"role": "user", "content": message}]
    )
    return response.content[0].text.strip().lower()