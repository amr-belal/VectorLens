import io
import pytest
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from fastapi.testclient import TestClient
from app.core.database import Base, get_db
from app.models import document
from app.main import app


# engine = create_engine(
#     "sqlite:///:memory:",
#     connect_args={"check_same_thread": False}
# )
# TestSession = sessionmaker(bind=engine)

# @pytest.fixture(autouse=True)
# def setup_db():
#     Base.metadata.create_all(bind=engine)  # اعمل tables
#     yield
#     Base.metadata.drop_all(bind=engine)   # امسحهم بعد كل test

# def override_get_db():
#     db = TestSession()
#     try:
#         yield db
#     finally:
#         db.close()

# app.dependency_overrides[get_db] = override_get_db
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


# def test_upload_saves_metadata():

#     fake_file = io.BytesIO(b"Fake PDF content")
    
#     responce = client.post(
#         "/api/v1/documents",
#         files={"file": ("test.pdf", fake_file, "application/pdf")}
#     )
    
#     assert responce.status_code == 200
#     data = responce.json()
#     assert "filename" in data
#     unique_filename = data["filename"]  