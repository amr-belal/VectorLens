import ollama
from .base import BaseEmbedder


class OllamaEmbedder(BaseEmbedder):
    
    def __init__(self , model:str = "all-minilm"): # bge-m3 ,another model available
        self.model = model
        
        
    def embed (self, texts: list[str]) -> list[list[float]]:
        
        response = ollama.embed(model=self.model, input=texts)
        
        return response.embeddings
    
    
    
