import os
import tempfile
import shutil
import pytest
from unittest import mock
from PyPDF2 import PdfWriter
from .file_utils import read_pdf

@pytest.fixture
def temp_pdf_dir_and_file():
    # Create a temporary directory
    temp_dir = tempfile.mkdtemp()
    file_name = "test.pdf"
    file_path = os.path.join(temp_dir, file_name)

    # Create a simple PDF file with PyPDF2
    writer = PdfWriter()
    writer.add_blank_page(width=72, height=72)
    with open(file_path, "wb") as f:
        writer.write(f)

    yield temp_dir, file_name, file_path

    # Cleanup
    shutil.rmtree(temp_dir)

def test_read_pdf_success(temp_pdf_dir_and_file, monkeypatch):
    temp_dir, file_name, file_path = temp_pdf_dir_and_file

    # Patch UPLOAD_FOLDER environment variable
    monkeypatch.setenv("UPLOAD_FOLDER", temp_dir)

    # Patch PdfReader to return a mock with pages having extract_text
    with mock.patch("PyPDF2.PdfReader") as MockPdfReader:
        mock_reader = mock.Mock()
        mock_page = mock.Mock()
        mock_page.extract_text.return_value = "Hello, PDF!"
        mock_reader.pages = [mock_page]
        MockPdfReader.return_value = mock_reader

        result = read_pdf(file_name)
        assert "Hello, PDF!" in result

def test_read_pdf_env_not_set(temp_pdf_dir_and_file, monkeypatch):
    _, file_name, _ = temp_pdf_dir_and_file
    monkeypatch.delenv("UPLOAD_FOLDER", raising=False)
    with pytest.raises(EnvironmentError):
        read_pdf(file_name)

def test_read_pdf_file_not_found(temp_pdf_dir_and_file, monkeypatch):
    temp_dir, _, _ = temp_pdf_dir_and_file
    monkeypatch.setenv("UPLOAD_FOLDER", temp_dir)
    with pytest.raises(FileNotFoundError):
        read_pdf("nonexistent.pdf")

def test_read_pdf_empty_pdf(temp_pdf_dir_and_file, monkeypatch):
    temp_dir, file_name, file_path = temp_pdf_dir_and_file
    monkeypatch.setenv("UPLOAD_FOLDER", temp_dir)

    # Patch PdfReader to simulate empty PDF (no pages)
    with mock.patch("PyPDF2.PdfReader") as MockPdfReader:
        mock_reader = mock.Mock()
        mock_reader.pages = []
        MockPdfReader.return_value = mock_reader

        result = read_pdf(file_name)
        assert result == ""