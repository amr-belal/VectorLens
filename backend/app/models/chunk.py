from sqlalchemy import Column, Integer, String, ForeignKey
from  app.core.database import Base
from uuid import uuid4
class ChunkTable(Base):
    __tablename__ = "chunks"
    
    chunk_id = Column(String, primary_key=True, default=lambda: str(uuid4().hex))
    file_id = Column(String, ForeignKey("documents.file_id"), nullable=False)
    content = Column(String, nullable=False)
    chunk_size = Column(Integer, nullable=False)
    chunk_index = Column(Integer, nullable=False)