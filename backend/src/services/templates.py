TEMPLATES = {
    "invoice": {
        "template": "{vendor}_{date}_{invoice_number}.pdf",
        "instructions": "Extract the vendor name, invoice date, and invoice number from the document."
    },
    "contract": {
        "template": "{party1}_and_{party2}_{date}_contract.pdf",
        "instructions": "Extract the names of both parties and the contract date."
    },
    "correspondence": {
        "template": "{date}_{sender}_{recipient}_{purpose_of_letter}.pdf",
        "instructions": "Extract the sender's name, recipient's name, and date of correspondence."
    },
    "report": {
        "template": "{title}_{date}.pdf",
        "instructions": "Extract the title and date of the report."
    },
    "presentation": {
        "template": "{topic}_{date}.pdf",
        "instructions": "Extract the topic and date of the presentation."
    },
    "resume": {
        "template": "{name}_{date}.pdf",
        "instructions": "Extract the name and date of the resume."
    },
    "statement": {
        "template": "{start_date}_to_{end_date}_{name}_Acct#{account_number}_${amount}.pdf",
        "instructions": "Extract the account holder's name and date of the statement start and end and account numer and amount on statement."
    },
}