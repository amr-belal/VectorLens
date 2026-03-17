# VectorLens 🔍

> An AI-powered platform that benchmarks and compares Vector Databases on your own data — with RAG chat, semantic search, and LLM-driven recommendations.

![Python](https://img.shields.io/badge/Python-3.12-blue)
![FastAPI](https://img.shields.io/badge/FastAPI-0.135-green)
![React](https://img.shields.io/badge/React-18-61DAFB)
![License](https://img.shields.io/badge/License-MIT-yellow)

---

## What is VectorLens?

Most developers pick a Vector Database based on blog posts or hype. VectorLens lets you **benchmark them on your actual data** — upload your PDFs, run queries, and get AI-powered analysis of which database performs best for your specific use case.

```
Upload your data
      ↓
Automatically stored in Qdrant + Chroma (simultaneously)
      ↓
Run the same queries on both
      ↓
Get latency scores, similarity scores, and AI analysis
      ↓
"For your data, Qdrant is 4x faster. Here's why."
```

---

## Features

- **Document Processing Pipeline** — Upload PDFs, extract text, chunk, embed, and store across multiple Vector DBs automatically
- **Semantic Search** — Query your documents using natural language across Qdrant or Chroma
- **Live Benchmark** — Run the same queries on multiple Vector DBs and compare latency in real time
- **RAG Chat** — Streaming chat interface grounded in your documents
- **AI Analysis** — LLM-powered explanation of benchmark results and DB recommendations
- **Batch Upload** — Upload hundreds of files simultaneously via Kafka message queue
- **Async Processing** — Instant response on upload; processing happens in background via Celery
- **Redis Caching** — Repeated queries served from cache instantly
- **Object Storage** — Files stored in MinIO (S3-compatible)

---

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        Frontend (React)                      │
│         Upload │ Search │ Benchmark │ Chat                   │
└────────────────────────┬────────────────────────────────────┘
                         │ HTTP / SSE
┌────────────────────────▼────────────────────────────────────┐
│                    FastAPI Backend                           │
│  /documents  /search  /benchmark  /chat  /benchmark/analyze  │
└──────┬──────────┬──────────┬────────────┬───────────────────┘
       │          │          │            │
  ┌────▼───┐ ┌───▼────┐ ┌──▼──────┐ ┌──▼──────────┐
  │ MinIO  │ │ Redis  │ │ Qdrant  │ │   Chroma    │
  │(files) │ │(cache) │ │(vectors)│ │  (vectors)  │
  └────────┘ └────────┘ └─────────┘ └─────────────┘
       │
  ┌────▼──────────────────────────────────────────┐
  │              Celery Workers                    │
  │  extract → chunk → embed → upsert             │
  └────┬──────────────────────────────────────────┘
       │
  ┌────▼──────┐    ┌──────────────┐
  │   Kafka   │    │  PostgreSQL  │
  │  (queue)  │    │  (metadata)  │
  └───────────┘    └──────────────┘
       │
  ┌────▼───────────┐
  │  Ollama (local)│
  │  all-minilm    │
  │  llama3.2      │
  └────────────────┘
```

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| **API** | FastAPI, Python 3.12 |
| **Frontend** | React, TypeScript, Tailwind CSS |
| **Vector DBs** | Qdrant, Chroma |
| **Embeddings** | Ollama (all-minilm, bge-m3), sentence-transformers |
| **LLM** | Ollama (llama3.2) |
| **Queue** | Celery + Redis, Apache Kafka |
| **Storage** | MinIO (object), PostgreSQL (metadata) |
| **Chunking** | LangChain RecursiveCharacterTextSplitter |
| **PDF Parsing** | PyMuPDF (fitz) |
| **Caching** | Redis |
| **Containers** | Docker + Docker Compose |
| **CI/CD** | GitHub Actions |

---

## Getting Started

### Prerequisites

- Docker & Docker Compose
- Python 3.12+
- Node.js 18+
- Ollama installed locally

### 1. Clone the repo

```bash
git clone https://github.com/amr-belal/VectorLens.git
cd VectorLens
```

### 2. Start all services

```bash
docker compose up -d
```

This starts: PostgreSQL, Qdrant, Chroma, Redis, MinIO, Kafka, Zookeeper.

### 3. Pull Ollama models

```bash
ollama pull all-minilm    # embedding model (45MB)
ollama pull llama3.2      # chat model (2GB)
```

### 4. Set up backend

```bash
cd backend
python -m venv .venv
source .venv/bin/activate  # Windows: .venv\Scripts\activate
pip install -r requirements.txt
```

### 5. Start the backend

```bash
uvicorn app.main:app --reload
```

### 6. Start Celery worker

```bash
celery -A app.core.celery_app worker --loglevel=info
```

### 7. Start Kafka worker (for batch uploads)

```bash
python -m app.services.kafka.worker
```

### 8. Start frontend

```bash
cd frontend
npm install
npm start
```

Visit `http://localhost:3000`

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/v1/documents` | Upload single document |
| `POST` | `/api/v1/documents/batch` | Upload multiple documents |
| `GET` | `/api/v1/jobs/{job_id}` | Check processing status |
| `POST` | `/api/v1/search` | Semantic search |
| `POST` | `/api/v1/benchmark` | Benchmark Vector DBs |
| `POST` | `/api/v1/benchmark/analyze` | AI analysis of results |
| `POST` | `/api/v1/chat` | RAG chat (streaming) |

---

## Usage

### Upload a document

```bash
curl -X POST http://localhost:8000/api/v1/documents \
  -F "file=@your_document.pdf"
```

Response:
```json
{
  "filename": "your_document_a3f2b1c4",
  "status": "processing",
  "task_id": "550e8400-e29b-41d4-a716-446655440000"
}
```

### Check job status

```bash
curl http://localhost:8000/api/v1/jobs/550e8400-e29b-41d4-a716-446655440000
```

### Run a benchmark

```bash
curl -X POST http://localhost:8000/api/v1/benchmark \
  -H "Content-Type: application/json" \
  -d '{
    "dbs": ["qdrant", "chroma"],
    "collection_id": "vectorlens_qdrant",
    "queries": ["what is the main topic?", "what are the key findings?"]
  }'
```

---

## Project Structure

```
VectorLens/
├── backend/
│   ├── app/
│   │   ├── api/v1/routes/
│   │   │   ├── upload.py       # document upload
│   │   │   ├── batch.py        # batch upload via Kafka
│   │   │   ├── search.py       # semantic search
│   │   │   ├── benchmark.py    # DB benchmarking
│   │   │   ├── analyze.py      # LLM analysis
│   │   │   └── chat.py         # RAG streaming chat
│   │   ├── core/
│   │   │   ├── database.py     # PostgreSQL connection
│   │   │   ├── cache.py        # Redis cache
│   │   │   ├── celery_app.py   # Celery configuration
│   │   │   └── logging.py      # structured logging
│   │   ├── models/
│   │   │   ├── document.py     # SQLAlchemy model
│   │   │   ├── chunk.py        # chunk model
│   │   │   └── schemas.py      # Pydantic schemas
│   │   ├── services/
│   │   │   ├── document_service.py
│   │   │   ├── text_extractor.py
│   │   │   ├── chunker.py
│   │   │   ├── embedding/      # Factory Pattern
│   │   │   │   ├── base.py
│   │   │   │   ├── ollama_embedder.py
│   │   │   │   ├── bge_embedder.py
│   │   │   │   ├── minilm_embedder.py
│   │   │   │   └── factory.py
│   │   │   ├── Vectordb/       # Factory Pattern
│   │   │   │   ├── base.py
│   │   │   │   ├── qdrant_store.py
│   │   │   │   ├── chroma_store.py
│   │   │   │   └── factory.py
│   │   │   ├── llm/
│   │   │   │   ├── base.py
│   │   │   │   ├── ollama_llm.py
│   │   │   │   └── prompts.py
│   │   │   ├── kafka/
│   │   │   │   ├── producer.py
│   │   │   │   ├── consumer.py
│   │   │   │   └── worker.py
│   │   │   └── storage/
│   │   │       └── minio_service.py
│   │   └── tasks/
│   │       └── document_tasks.py  # Celery tasks
│   └── pyproject.toml
├── frontend/
│   └── src/
│       └── App.tsx              # React SPA
├── docker-compose.yml
├── .github/workflows/ci.yml
└── README.md
```

---

## Design Patterns Used

- **Factory Pattern** — Interchangeable embedding models and Vector DBs
- **Service Layer Pattern** — Clean separation between routes, business logic, and data
- **Repository Pattern** — Database operations isolated in service classes
- **Abstract Base Classes** — Consistent interfaces across implementations
- **Async Processing** — Upload returns instantly; processing is backgrounded

---

## Roadmap

- [ ] PGVector integration (3rd Vector DB for comparison)
- [ ] JWT Authentication
- [ ] Prometheus + Grafana monitoring dashboard
- [ ] Reranking with cross-encoders
- [ ] Hybrid search (dense + sparse)
- [ ] Multi-user support with isolated collections
- [ ] Evaluation framework (RAGAS integration)
- [ ] Support for DOCX and TXT files in processing pipeline

---

## Contributing

Pull requests welcome. For major changes, open an issue first.

---

## License

MIT

---

Built by [Amr Belal](https://github.com/amr-belal) 🚀
