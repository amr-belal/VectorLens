import os 
import uuid
from fastapi import UploadFile
from app.models.schemas import ALLOWED_TYPES
from sqlalchemy.orm import Session
from app.models.document import Document
from app.models.chunk import ChunkTable
from app.services.storage.minio_service import MinIoService

minio = MinIoService()


BASE_DIR =  os.path.dirname(os.path.abspath(__file__))
ROOT_DIR =  os.path.dirname(os.path.dirname(os.path.dirname(BASE_DIR)))
UPLOAD_DIR = os.path.join(ROOT_DIR, "data", "documents")



class DocumentService:
    

    
    def make_uniqe_filename(self , filename:str)->str:
        filename, ext = os.path.splitext(filename)
        filename = filename.replace(" ", "_")
        extension = ext.lower().strip(".")
              
        
        unique_id = uuid.uuid4().hex[:8]
        unique_filename = f"{filename}_{unique_id}"
        return unique_filename
    
    async def save_file(self, file:UploadFile , unique_name:str)->str:
        
        # temp = f"/tmp/{unique_name}"
        temp = f"{UPLOAD_DIR}/{unique_name}"
        content = await file.read()
        
        with open(temp, "wb") as f:
            file_size = len(content)
            f.write(content)
            
        save_path = minio.upload_file(unique_name, temp)
        
        # os.makedirs(UPLOAD_DIR, exist_ok=True)
        # save_path = os.path.join(UPLOAD_DIR, unique_name)

    
        # with open(save_path, "wb") as f:
        #     content = await file.read()
        #     file_size = len(content)
        #     f.write(content)
            
        return temp  , file_size



    def validate_extinsion(self, filename:str)->bool:
        extension = os.path.splitext(filename)[1].lower().strip(".")
        if extension not in ALLOWED_TYPES:
            return False
        return True
    

    def save_metadata(self,db:Session , document:Document):
        db.add(document)
        db.commit()
        db.refresh(document)
        return document



    def save_chunks(self, db:Session ,file_id:str ,chunks:list[str]):
        
        for index, chunk in enumerate(chunks):
            chunk = ChunkTable(
                file_id=file_id,
                content=chunk,
                chunk_size=len(chunk),
                chunk_index=index
            )
            db.add(chunk)
        db.commit()
        
    


if "__main__" == __name__:
    service = DocumentService()
    unique_name = service.make_uniqe_filename("example.pdf")
    print(unique_name)
    print(UPLOAD_DIR)
    