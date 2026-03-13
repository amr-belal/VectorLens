from .base import BaseVectorStore


class VectorDBFactory:
    
    @staticmethod
    def create (db_name:str)->BaseVectorStore:
        
        if db_name == "qdrant":
            from .qdrant_store import QdrantStore
            return QdrantStore()
        
        elif db_name == "chroma":
            from .chroma_store import ChromaStore
            return ChromaStore()
        
        else:
            raise ValueError(f"Unknown database name: {db_name}")