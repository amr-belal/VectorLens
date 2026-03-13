import chromadb

from .base import BaseVectorStore


class ChromaStore(BaseVectorStore):
    
    def __init__(self):
        self.chroma_client = chromadb.HttpClient(host="localhost", port=8080)
        
    def upsert(self, collection:str , ids:list[str],
                vectors:list[list[float]],
                payloads:list[dict])->None:
        
        collection = self.chroma_client.get_or_create_collection(name=collection)
        collection.add(
            ids=ids,
            embeddings=vectors,
            metadatas=payloads
        )
        
    
    def search(self, collection: str, query_vector: list[float], limit: int = 5) -> list[dict]:
        
        col = self.chroma_client.get_collection(name=collection)
        results = col.query(
            query_embeddings=query_vector,
            n_results=limit,
            include=["metadatas", "distances"]
        )
        
        return [
                {
                    "id": results["ids"][0][i],
                    "metadata": results["metadatas"][0][i],
                    "distance": results["distances"][0][i]
                }
                for i in range(len(results["ids"][0]))
            ]
        
    def delete_collection(self, collection:str)->None:
        self.chroma_client.delete_collection(name=collection)
        