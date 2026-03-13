from abc import ABC, abstractmethod


class BaseVectorStore(ABC):
    
    @abstractmethod
    def upsert(self, collection:str , ids:list[str],
               vectors:list[list[float]],
               payload:list[dict])->None:
        pass
    @abstractmethod
    def search (self , collection:str ,
                query_vector:list[list[float]],
                limit:int=5)->list[dict]:
        
        pass 
    
    @abstractmethod
    def delete_collection (self , collection:str , ids:list[str])->None:
        pass