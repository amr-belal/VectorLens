from abc import ABC, abstractmethod

class BaseLM(ABC):
    
    @abstractmethod
    def generate(self , prompt:str)->str:
        pass