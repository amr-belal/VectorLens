from fastapi import APIRouter, UploadFile, File , HTTPException , Depends
from app.services.document_service import DocumentService
from app.core.database import  get_db
from sqlalchemy.orm import Session
from app.models.document import Document
from app.services.text_extractor import TextExtractor
from app.services.chunker import Chunker


router= APIRouter()
document_services = DocumentService()
text_extractor = TextExtractor()
chunker = Chunker()


@router.post("/documents")
async def upload_document(
                        file:UploadFile = File(...), 
                        db: Session = Depends(get_db)):
    
    if not document_services.validate_extinsion(file.filename):
        raise HTTPException(status_code=422,
                            detail={"filename": "Unsupported file type"})
    
    # Save the file and return the unique filename
    unique_filename = document_services.make_uniqe_filename(file.filename)

    # Save the file to the server : object storage or local storage 
    save_path, file_size =await document_services.save_file(file, unique_filename)
    # Save the file metadata to the database
    document = Document(
        file_id=unique_filename,
        user_id="user123",  # Replace with actual user ID from authentication
        file_name=file.filename,
        file_extension=file.filename.split(".")[-1],
        file_size=file_size,
        status="uploaded"
    )
    document_services.save_metadata(db, document)

    # Extract text from the file and return it
    extracted_text = text_extractor.extract_from_pdf(save_path)
    
    # Chunk the text and return it
    chunks = chunker.chunk_text(extracted_text)
    
    # Save the chunk to the database
    document_services.save_chunks(db, unique_filename, chunks)
    
    return {"filename": unique_filename,
            "extracted_text": extracted_text[:500]}  # Return a preview of the extracted text