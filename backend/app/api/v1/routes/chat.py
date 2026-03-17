from fastapi import APIRouter
from fastapi.responses import StreamingResponse
from app.services.llm.ollama_llm import OllamaLM
from app.services.llm.prompts import PromptsLLM
from app.services.llm.base import BaseLM
from app.services.embedding.factory import EmbeddingFactory
from app.services.Vectordb.factory import VectorDBFactory
from app.models.schemas import ChatRequest
import ollama


router = APIRouter()
embedder = EmbeddingFactory.create("ollama")
llm = OllamaLM()


@router.post("/chat")
async def root(request:ChatRequest):
    
    query_vector = embedder.embed([request.message])[0]
    
    #search 
    store =VectorDBFactory.create(request.db)
    
    results  = store.search(
        # collection=request.collection,
        collection=f"vectorlens_{request.db}",
        query_vector=query_vector,
        limit=5
    )
    # get_chunks 
    
    context = [result["payload"]["text"] for result in results]
    
    # llm
    prompt = PromptsLLM.chat_llm(question=request.message , context=context)
    
    # response = llm.generate(PromptsLLM.chat_llm(question=request.message , context=context))
    def generate():
        stream = ollama.chat(
            model = "llama3.2",
            messages = [{
                "role":"user",
                "content":prompt
            }],
            stream=True
        )
        for chunk in stream:
            yield chunk.message.content
    
    
    
    return StreamingResponse(generate(), media_type="text/event-stream")