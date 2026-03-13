from .base import BaseEmbedder
from .bge_embedder import BGEEmbedder
from .ollama_embedder import OllamaEmbedder


class EmbeddingFactory:
    
    @staticmethod
    def create (model_name:str)->BaseEmbedder:
        
        if model_name == "bge":
            return BGEEmbedder()
        
        elif model_name == "ollama":
            return OllamaEmbedder()
        
        else:
            raise ValueError(f"Unknown model name: {model_name}")