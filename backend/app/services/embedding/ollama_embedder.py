import ollama
from .base import BaseEmbedder


class OllamaEmbedder(BaseEmbedder):
    
    def __init__(self , model:str = "bge-m3"): # bge-m3 , mini_lm ,another model available
        self.model = model
        
        
    def embed (self, texts: list[str]) -> list[list[float]]:
        
        response = ollama.embed(model=self.model, input=texts)
        
        return response.embeddings
    
    
    
