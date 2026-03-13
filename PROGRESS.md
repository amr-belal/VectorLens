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
>upload output :
```
{
    "filename": "marcus-sigmod2021_c0cbde1a.pdf",
    "status": "processing"
}
```

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


## Sprint 5: Benchmark Engine
- BenchmarkRequest schema (dbs, collection_id, queries)
- POST /api/v1/benchmark endpoint
- Runs same queries on multiple Vector DBs (Qdrant & Chroma)
- Measures latency per query per DB
- Summary: avg latency, fastest, slowest
- Registered benchmark router in main.py

> Benchmark endpoint :
```
{
    "benchmarks": {
        "qdrant": [
            {
                "query": "what is query optimization?",
                "latency_ms": 0.01,
                "results": [
                    {
                        "id": "be898849-5c92-432a-aa6d-843253dfbbec",
                        "score": 0.6639161,
                        "payload": {
                            "text": "Practical. In Proceedings of the 2021 International Conference on Management\nof Data (SIGMOD ’21), June 20–25, 2021, Virtual Event, China. ACM, New\nYork, NY, USA, 14 pages. https://doi.org/10.1145/3448016.3452838\n1\nINTRODUCTION\nQuery optimization is an important task for database management\nsystems. Despite decades of study [70], the most important elements\nof query optimization – cardinality estimation and cost modeling\n– have proven difficult to crack [45]. Several works have applied\nmachine learning techniques to these stubborn problems [37, 40, 44,\n51, 53, 59, 72, 73, 76]. While all of these new solutions demonstrate\nremarkable results, we argue that none of the techniques are yet\npractical, as they suffer from several fundamental problems:\nPermission to make digital or hard copies of part or all of this work for personal or\nclassroom use is granted without fee provided that copies are not made or distributed"
                        }
                    },
                 .....
                 .....
                    }
                ]
            }
        ],
        "chroma": [
            {
                "query": "what is query optimization?",
                "latency_ms": 0.03,
                "results": [
                    {
                        "id": "216f3a85-f215-4d1d-a057-b49cbc1f3902",
                        "metadata": {
                            "text": "Practical. In Proceedings of the 2021 International Conference on Management\nof Data (SIGMOD ’21), June 20–25, 2021, Virtual Event, China. ACM, New\nYork, NY, USA, 14 pages. https://doi.org/10.1145/3448016.3452838\n1\nINTRODUCTION\nQuery optimization is an important task for database management\nsystems. Despite decades of study [70], the most important elements\nof query optimization – cardinality estimation and cost modeling\n– have proven difficult to crack [45]. Several works have applied\nmachine learning techniques to these stubborn problems [37, 40, 44,\n51, 53, 59, 72, 73, 76]. While all of these new solutions demonstrate\nremarkable results, we argue that none of the techniques are yet\npractical, as they suffer from several fundamental problems:\nPermission to make digital or hard copies of part or all of this work for personal or\nclassroom use is granted without fee provided that copies are not made or distributed"
                        },
                    .....
                    .....
            }
        ]
    },
    "summary": {
        "qdrant": 0.01,
        "chroma": 0.02,
        "fastest": "qdrant",
        "slowest": "chroma"
    }
}
```

## Sprint 6: LLM Analysis
- BaseLLM abstract class
- OllamaLLM (llama3.2)
- PromptsLLM template (benchmark_analysis)
- POST /api/v1/benchmark/analyze
- LLM analyzes benchmark results and recommends best DB

> analysis output 
```
{
    "analyze": "**Performance Analysis**\n\nThe benchmark results show that:\n\n* QDrant has the highest latency (0.02 seconds) and is considered the slowest option.\n* Chroma has the lowest latency (0.015 seconds) and is considered the fastest option.\n\n**Recommendation**\n\nBased on the performance analysis, I recommend using **Chroma** for semantic search in research papers.\n\n**Why?**\n\nIn simple terms, Chroma's faster response time ensures that users can quickly find relevant research papers, which is critical in a field like research where time is of the essence. While QDrant may be more feature-rich and scalable, its slower performance makes it less suitable for this specific use case where speed is paramount.\n\nChroma's trade-offs (e.g., possibly limited features or scalability) are justified by its fast query times, making it an excellent choice for this particular application."
}
```

## Sprint 7: RAG Chat
- ChatRequest schema (message, collection, db)
- POST /api/v1/chat endpoint
- RAG pipeline: embed → search → context → LLM
- Streaming response (token by token)
- rag_chat prompt template

> Chat ouput 
```
curl -X POST http://127.0.0.1:8000/api/v1/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "what is Bao?", "collection": "marcus-sigmod2021_65ed285f.pdf", "db": "qdrant"}' \
  --no-buffer

---
Bao is a learned system for query optimization that is capable of learning how to apply query hints on a case-by-case basis. It combines modern tree convolutional neural networks with Thompson sampling, a well-studied reinforcement learning algorithm.(.venv) amrbelal@DE
```
---
>✅ PostgreSQL  → 5435
>✅ Redis       → 6379
>✅ Qdrant      → 6333
>✅ Chroma      → 8080

---



## Sprint 8: Redis Caching
- Redis (Docker, port 6379)
- CacheService (get, set, TTL=1hour)
- Search endpoint cached by (collection:query:db)
- from_cache flag in response



> cache output  :
```
{
    "results": [
        {
            "id": "be898849-5c92-432a-aa6d-843253dfbbec",
            "score": 0.6639161,
            "payload": {
                "text": "Practical. In Proceedings of the 2021 International Conference on Management\nof Data (SIGMOD ’21), June 20–25, 2021, Virtual Event, China. ACM, New\nYork, NY, USA, 14 pages. https://doi.org/10.1145/3448016.3452838\n1\nINTRODUCTION\nQuery optimization is an important task for database management\nsystems. Despite decades of study [70], the most important elements\nof query optimization – cardinality estimation and cost modeling\n– have proven difficult to crack [45]. Several works have applied\nmachine learning techniques to these stubborn problems [37, 40, 44,\n51, 53, 59, 72, 73, 76]. While all of these new solutions demonstrate\nremarkable results, we argue that none of the techniques are yet\npractical, as they suffer from several fundamental problems:\nPermission to make digital or hard copies of part or all of this work for personal or\nclassroom use is granted without fee provided that copies are not made or distributed"
            }
        },
       .....
       .....
    ],
    "from_cahce": true
}
```