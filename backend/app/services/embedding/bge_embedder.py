from sentence_transformers import SentenceTransformer
from .base import BaseEmbedder


class BGEEmbedder(BaseEmbedder):
    def __init__(self, model = "BAAI/bge-m3"):
        
        self.model= SentenceTransformer(
                                model,
                                cache_folder="models/"
                                        )
    
    def embed(self, texts: list[str]) -> list[list[float]]:
        return self.model.encode(texts).tolist()
    