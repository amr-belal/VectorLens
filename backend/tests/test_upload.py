from fastapi.testclient import TestClient
from app.main import app
import io 


client = TestClient(app)


def test_upload_pdf ():
    
    # fake file to upload with BytesIO
    fake_file = io.BytesIO(b"Fake PDF content")
    
    responce = client.post(
        "/api/v1/documents",
        files={"file": ("test.pdf", fake_file, "application/pdf")}
    )
    
    assert responce.status_code == 200
    assert "filename" in responce.json()
    
    
def test_upload_invalid_extension():
    
    fake_file = io.BytesIO(b"Fake content")
    
    responce = client.post(
        "/api/v1/documents",
        files={"file": ("test.exe", fake_file, "application/octet-stream")}
    )
    
    assert responce.status_code == 422
    assert "detail" in responce.json()