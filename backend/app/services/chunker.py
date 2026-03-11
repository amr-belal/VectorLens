
from langchain_text_splitters import RecursiveCharacterTextSplitter

class Chunker:
    
    def __init__(self , chunk_size:int = 1000 ,overlap:int = 200):
        self.splitter = RecursiveCharacterTextSplitter(
                    chunk_size=chunk_size,
                    chunk_overlap=overlap)
    def chunk_text(self , text :str) ->list[str]:
        
        chunks = self.splitter.create_documents([text])
        return [chunk.page_content for chunk in chunks]
    
    

if __name__ == "__main__":
    text ="chunk"*200
    chunker = Chunker(chunk_size=200, overlap=10)
    chunks = chunker.chunk_text(text)
    for i, chunk in enumerate(chunks):
        print(f"Chunk {i+1}:\n{chunk}\n")