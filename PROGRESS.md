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


## Sprint 3 :

- Upload flow : 
1. validate
2. save file
3. extract text
4. chunk text
5. save chunks في DB  
6. save document metadata
7. return response