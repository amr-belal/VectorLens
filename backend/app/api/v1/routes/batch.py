from fastapi import APIRouter, UploadFile, File, Request, Depends
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.services.document_service import DocumentService
from app.models.document import Document
from app.services.kafka.producer import DocumentProducer
from  typing import List


router = APIRouter()

document_service = DocumentService()
producer = DocumentProducer()


@router.post("/documents/batch")
async def batch_upload(
    files:List[UploadFile] = File(...),
    request :Request = None,
    db:Session = Depends(get_db)
                                    ):
    results = []
    
    for file in  files:
        
        if not document_service.validate_extinsion(file.filename):
            continue
        unique_filename = document_service.make_uniqe_filename(file.filename)
        save_path, file_size =await document_service.save_file(file, unique_filename)
        document = Document(
            file_id = unique_filename,
            user_id = "user123",
            file_name = file.filename,
            file_extension = file.filename.split(".")[-1],
            file_size = file_size,
            status = "uploaded"
        )
        
        document_service.save_metadata(db,document)
        producer.send_document(save_path , unique_filename)
        results.append({
            "filename": file.filename,
            "status": "processing"
        })
        
    
    return {
        "uploaded_files": len(results),
        "files": results
    }