from fastapi import APIRouter
from app.models.schemas import SearchVector
from app.services.Vectordb.qdrant_store import QdrantStore
from app.services.Vectordb.chroma_store import ChromaStore
from app.services.embedding.factory import EmbeddingFactory
from app.services.Vectordb.factory import VectorDBFactory

router = APIRouter()
# vectordb = VectorDBFactory()
embedder = EmbeddingFactory.create("ollama")
# qdrant_store = QdrantStore()
# chroma_store = ChromaStore()

@router.post("/search")
async def search_vector(request:SearchVector):
#     query: str = Field(..., description="The search query")
#     db:str= "qdrant"
#     limit: int = Field(5, gt=0, description="Number of top results to return")
#     collection:str 

    vectordb = VectorDBFactory.create(request.db)
    query_vector = embedder.embed([request.query])[0]
    results = vectordb.search(
        collection=request.collection,
        query_vector=query_vector,
        limit=request.limit
    )
    
    return {"results": results}