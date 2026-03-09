import pytest
from app.models.schemas import Document, DocumentMetadata, DocumentStatus, ALLOWED_TYPES


def test_valid_document():
    
    doc = Document(
        user_id="user123",
        file_size=1024,
        file_name="example.pdf"
    )
    
    assert doc.file_extension == "pdf"
    assert doc.status == "pending"

def test_invalid_extension():
    
    with pytest.raises(ValueError) as exc_info:
        Document(
            user_id="user123",
            file_size=1024,
            file_name="example.exe"
        )
        
    assert "Unsupported file type" in str(exc_info.value)

def test_empty_filename():
    
    with pytest.raises(ValueError) as exc_info:
        Document(
            user_id="user123",
            file_size=1024,
            file_name=""
        )
    assert "File name cannot be empty" in str(exc_info.value)


def test_status_default():
    
    doc = Document(
        user_id="user123",
        file_size=1024,
        file_name="example.pdf"
    )
    
    assert doc.status == DocumentStatus.PENDING
