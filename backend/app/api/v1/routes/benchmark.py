from fastapi import APIRouter
from app.services.Vectordb.factory import VectorDBFactory
from app.models.schemas import BenchmarkRequest
from app.services.embedding.factory import EmbeddingFactory
import time

embedder = EmbeddingFactory.create("ollama")
router = APIRouter()


@router.post("/benchmark")
async def benchmark(request:BenchmarkRequest):
    
    dbs = request.dbs
    collection_id = request.collection_id
    queries = request.queries
    
    # embedder.embed(queries)
    
    results = {}
    for  db_name in request.dbs:
        store = VectorDBFactory.create(db_name)
        db_results = []
        
        for query in request.queries:
            query_vector = embedder.embed([query])[0]
            
            start = time.time()
            search_results = store.search(
                collection = f"vectorlens_{db_name}",
                # collection=collection,
                query_vector=query_vector,
                limit=5
            )
            
            latency = (time.time() - start)
            db_results.append({
                                "query": query,
                                "latency_ms": round(latency, 2),
                                "results": search_results
                            })
        results[db_name] = db_results
    
    
    summary  = {}
    
    for  db_name ,db_results in results.items():
        avg = sum(r["latency_ms"] for r in db_results) / len(db_results)
        summary[db_name] = round(avg, 3)
        
    fastest = min(summary, key=lambda x: summary[x])
    slowest = max(summary, key=lambda x: summary[x])
    
    summary["fastest"] = fastest
    summary["slowest"] = slowest
    
    
    return {"benchmarks": results, "summary": summary}