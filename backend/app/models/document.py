from datetime import datetime
from sqlalchemy import Column,String,Integer,DateTime,Text
from app.core.database import Base

class Document(Base):
    __tablename__ = "documents"

    file_id = Column(String , primary_key=True, index=True)
    user_id = Column(String, nullable=False)
    file_name = Column(String, nullable=False)
    file_extension = Column(String, nullable=False)
    file_size = Column(Integer, nullable=False)
    status = Column(String, nullable=False)
    created_at = Column(DateTime, default=lambda: datetime.utcnow())
    