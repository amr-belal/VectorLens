from app.core.celery_app import celery_app
from app.services.text_extractor import TextExtractor
from app.services.chunker import Chunker
from app.services.document_service import DocumentService
from app.services.Vectordb.factory import VectorDBFactory
from app.services.embedding.factory import EmbeddingFactory
from app.core.database import SessionLocal
from uuid import uuid4

text_extractor = TextExtractor()
chunker = Chunker()
document_services = DocumentService()
embedder = EmbeddingFactory.create("ollama")

@celery_app.task
def process_document_task(save_path:str , unique_filename:str):
    

    
    db = SessionLocal()
    try:
        extracted_text = text_extractor.extract_from_pdf(save_path)
        chunks = chunker.chunk_text(extracted_text)
        document_services.save_chunks(db, unique_filename, chunks)
        vectors = embedder.embed(chunks)
        for db_name in ['qdrant', 'chroma']:
            store = VectorDBFactory.create(db_name)
            store.upsert(
                collection=f"vectorlens_{db_name}",
                ids=[str(uuid4()) for _ in range(len(chunks))],
                vectors=vectors,
                payloads=[{"text": chunk,
                           "file_id": unique_filename
                           
                           } for chunk in chunks]
            )
    finally:
        db.close()
