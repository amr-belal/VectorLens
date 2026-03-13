# VectorLens — Progress Tracker

## Sprint 0: Foundation
- Pydantic schemas (Document, DocumentMetadata, DocumentStatus)
- Field validators
- 4 tests passing
- GitHub Actions CI/CD
- PR workflow

## Sprint 1: Upload Endpoint
- POST /api/v1/documents
- Service Layer (DocumentService)
- File validation (extension check)
- Unique filename (UUID)
- Local file storage
- 6 tests passing

## Sprint 2: Database Integration
- PostgreSQL setup (Docker)
- SQLAlchemy connection + engine
- Document table (file_id, user_id, file_name, 
  file_extension, file_size, status, created_at)
- Save metadata after upload
- get_db session management
- dependency injection (Depends)
- File size calculated from content (single read)
- Absolute path for file storage


## Sprint 3: Text Extraction & Chunking
- TextExtractor service (pymupdf/fitz)
- Mixed content handling (text + images per page)
- Chunker service (langchain RecursiveCharacterTextSplitter)
- chunk_size=1000, overlap=200
- Chunk table (chunk_id, file_id, content, chunk_size, chunk_index)
- save_chunks in DocumentService
- Full pipeline: upload → extract → chunk → save to DB

> Flow
```
User upload PDF
      ↓
validate extension
      ↓
save file locally
      ↓
extract text (pymupdf)
      ↓
chunk text (langchain)
      ↓
save chunks in DB
      ↓
save document metadata
      ↓
return response ✅

```

## Sprint 4: Embedding Pipeline & Async Processing

### Embedding
- Factory Pattern for embedding models (BaseEmbedder, BGEEmbedder, OllamaEmbedder)
- Ollama integration for local embedding (bge-m3, 1024 dimensions)
- Model loaded once at startup via lifespan (Load Once pattern)

### Vector Databases
- Factory Pattern for vector stores (BaseVectorStore, QdrantStore, ChromaStore)
- Qdrant integration (Docker, port 6333)
- Chroma integration (Docker, port 8080)
- Upsert chunks to both DBs on every upload

### Search Endpoint
- POST /api/v1/search
- Embed query → search in selected DB → return ranked results with scores

### Async Processing (Background Tasks)
- Upload endpoint returns response immediately
- Processing pipeline runs in background:
  extract → chunk → embed → upsert to Qdrant & Chroma
- Response time: 181s → 0.03s (6000x improvement)
