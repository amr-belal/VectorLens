from fastapi import APIRouter, UploadFile, File , HTTPException
from app.services.document_service import DocumentService


router= APIRouter()
document_services = DocumentService()


@router.post("/documents")
async def upload_document(file:UploadFile = File(...)):
    
    if not document_services.validate_extinsion(file.filename):
        raise HTTPException(status_code=422,
                            detail={"filename": "Unsupported file type"})
        
    unique_filename = document_services.make_uniqe_filename(file.filename)
    await document_services.save_file(file, unique_filename)
    return {"filename": unique_filename}