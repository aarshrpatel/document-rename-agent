import os
from anthropic import Anthropic
from src.services.templates import TEMPLATES

def suggest_filenames(text: str, classification: str, num_suggestions: int = 3) -> list:
    api_key = os.environ.get("ANTHROPIC_API_KEY")
    if not api_key:
        raise EnvironmentError("ANTHROPIC_API_KEY environment variable is not set.")

    client = Anthropic(api_key=api_key)
    template_info = TEMPLATES.get(classification)
    if not template_info:
        print(f'classification: {classification}')
        raise ValueError(f"No template found for classification '{classification}'.")

    prompt = (
        f"You are an assistant that helps rename files based on their content and classification.\n"
        f"Classification: {classification}\n"
        f"Template: {template_info['template']}\n"
        f"Instructions: {template_info['instructions']}\n"
        f"Document Text:\n{text[:4000]}\n\n"
        f"Based on the above, extract the required fields and generate {num_suggestions} possible file names using the template. "
        f"Return only a numbered list of file names."
    )

    response = client.messages.create(
        model="claude-3-haiku-20240307",
        max_tokens=256,
        messages=[{"role": "user", "content": prompt}]
    )
    # Parse the response into a list
    suggestions = [line.split('. ', 1)[-1] for line in response.content[0].text.strip().split('\n') if line.strip()]
    return suggestions