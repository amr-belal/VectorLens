from sentence_transformers import SentenceTransformer
from .base import BaseEmbedder



class MiniLMEmbedder(BaseEmbedder):
    def __init__(self,model = "sentence-transformers/paraphrase-multilingual-MiniLM-L12-v2"):
        
        
        self.model= SentenceTransformer(
                                model,
                                cache_folder="models/"
                                        )
    
        
    def embed(self, texts: list[str]) -> list[list[float]]:
        return self.model.encode(texts).tolist()
    
    