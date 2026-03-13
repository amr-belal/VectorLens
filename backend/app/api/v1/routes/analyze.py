from fastapi import APIRouter
from app.models.schemas import AnalyzeRequest
from app.services.embedding.factory import EmbeddingFactory
from app.services.Vectordb.factory import VectorDBFactory
from app.services.llm.ollama_llm import OllamaLM
from app.services.llm.prompts import PromptsLLM




router = APIRouter()
llm = OllamaLM()



@router.post("/benchmark/analyze")
async def analyze(request:AnalyzeRequest):
    
    prompt = PromptsLLM.benchmark_analysis(
        summary=request.summary,
        use_case=request.use_case
    )
    
    analyze = llm.generate(prompt)
    
    return {"analyze": analyze}