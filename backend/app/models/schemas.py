from enum import Enum
from pydantic import BaseModel, Field , field_validator, model_validator
from typing import Optional
from datetime import datetime, timezone
from uuid import UUID , uuid4
import os 
class DocumentStatus(str,Enum):
    PENDING = "pending"
    PROCESSING = "processing"
    COMPLETED = "completed"
    FAILED = "failed"
    REJECTED = "rejected"

ALLOWED_TYPES = {'pdf', 'docx', 'txt'}
    
class DocumentMetadata(BaseModel):
    author: str | None = None
    page_count: int | None = None
    language: str | None = None
    
class Document(BaseModel):
    
    
    id : UUID = Field(default_factory=uuid4)
    user_id : str = Field(..., description="ID of the user who uploaded the document")
    file_size : int = Field(..., gt=0,description="Size of the document in bytes")
    metadata : DocumentMetadata = Field(default_factory=DocumentMetadata , description="Additional metadata about the document")
    status : DocumentStatus = Field(default=DocumentStatus.PENDING, description="Current processing status of the document")
    created_at : datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    file_name : str = Field(..., description="Original name of the uploaded file")
    file_extension  : Optional[str] = Field(default="", description="File extension extracted from the file name")

   
   
    @field_validator('file_name')
    @classmethod
    def validate_file_name(cls ,  value: str) -> str:
        
        if not value :
            raise ValueError("File name cannot be empty")
            
        if not os.path.splitext(value)[1]:
            raise ValueError("File name must have an extension")
        
        elif os.path.splitext(value)[1].lower().strip(".") not in ALLOWED_TYPES:
            raise ValueError(f"Unsupported file type in file name: {value}. Allowed types are: {', '.join(ALLOWED_TYPES)}")
        
        else:
            extension = os.path.splitext(value)[1].lower()
            file_name = os.path.splitext(value)[0]
            
        return value    
        
    @model_validator(mode="after")
    def set_extension(self) -> "Document":
        self.file_extension = os.path.splitext(self.file_name)[1].lower().strip(".")
        return self
    


if __name__ == "__main__":
    doc = Document(
        user_id="user123",
        file_size=1024,
    
        file_name="example.pdf"
    )
    print(doc)
    print(doc.file_extension)
    print(doc.metadata)
    print(doc.status)