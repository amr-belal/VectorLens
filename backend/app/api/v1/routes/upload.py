from fastapi import APIRouter, UploadFile, File , HTTPException , Depends ,Request,BackgroundTasks
from app.services.document_service import DocumentService
from app.core.database import  get_db
from sqlalchemy.orm import Session
from app.models.document import Document
from app.services.text_extractor import TextExtractor
from app.services.chunker import Chunker
from app.services.Vectordb.factory import VectorDBFactory
from app.services.embedding.factory import EmbeddingFactory
from app.core.database import SessionLocal
from uuid import uuid4
import time



router= APIRouter()
document_services = DocumentService()
text_extractor = TextExtractor()
chunker = Chunker()


def process_document(save_path, unique_filename, embedder): 
    db = SessionLocal()
    try:
        extracted_text = text_extractor.extract_from_pdf(save_path)
        chunks = chunker.chunk_text(extracted_text)
        document_services.save_chunks(db, unique_filename, chunks)
        vectors = embedder.embed(chunks)
        for db_name in ['qdrant', 'chroma']:
            store = VectorDBFactory.create(db_name)
            store.upsert(
                collection=unique_filename,
                ids=[str(uuid4()) for _ in range(len(chunks))],
                vectors=vectors,
                payloads=[{"text": chunk} for chunk in chunks]
            )
    finally:
        db.close()

@router.post("/documents")
# async def upload_document(
#                         file:UploadFile = File(...), 
#                         db: Session = Depends(get_db)):
async def upload_document(file: UploadFile, request: Request,
                          background_tasks: BackgroundTasks,db: Session = Depends(get_db)):
    
    start = time.time()
    
    embedder = request.app.state.embedder
    
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

    # # Extract text from the file and return it
    # extracted_text = text_extractor.extract_from_pdf(save_path)
    
    # # Chunk the text and return it
    # chunks = chunker.chunk_text(extracted_text)
    
    # # Save the chunk to the database
    # document_services.save_chunks(db, unique_filename, chunks)
    
    
    # # embed the chunks and save to vector database
    # # embedder = EmbeddingFactory.create("ollama")
    
    
    
    # vectors =embedder.embed(chunks)
    
    # for db_name in ['qdrant' , 'chroma']:
    #     store = VectorDBFactory.create(db_name)
    #     store.upsert(
    #         collection=unique_filename,
    #         ids=[str(uuid4()) for i in range(len(chunks))],
    #         vectors=vectors,
    #         payloads=[{"text": chunk} for chunk in chunks]
    #     )
    
    embedder = request.app.state.embedder
     
    background_tasks.add_task(process_document, save_path, unique_filename, embedder)

    
    # return {"filename": unique_filename,
    #         "extracted_text": extracted_text[:500]}  # Return a preview of the extracted text
    end = time.time()
    
    
    print(f"Response time: {end - start:.2f}s")
    
    return {"filename": unique_filename, "status": "processing"}