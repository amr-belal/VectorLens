from qdrant_client import QdrantClient
from qdrant_client.models import Distance, VectorParams, PointStruct

from .base import BaseVectorStore

class QdrantStore(BaseVectorStore):
    
    def __init__ (self ):
        self.client =  QdrantClient(url="http://localhost:6333")
        
    
    def upsert(self, collection:str , ids:list[str],
               vectors:list[list[float]],
               payloads:list[dict])->None:
        
        if not self.client.collection_exists(collection_name=collection):    
            self.client.create_collection(
                collection_name=collection,
                vectors_config=VectorParams(size=1024, distance=Distance.COSINE),
            )
        
        self.client.upsert(
                collection_name=collection,
                points=[
                    PointStruct(id=ids[i], vector=vectors[i], payload=payloads[i])
                    for i in range(len(ids))
                ]
            )
    def search(self, collection, query_vector, limit = 5):
        
        results = self.client.query_points(
            collection_name=collection,
            query=query_vector,
            limit=limit
        )
        
                
        return [
            {
                "id": str(point.id),
                "score": point.score,
                "payload": point.payload
            }
            for point in results.points  
        ]
        
    def delete_collection(self, collection:str )->None:
        
        self.client.delete_collection(collection_name=collection)
        
        