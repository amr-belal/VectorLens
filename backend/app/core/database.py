from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, DeclarativeBase

DATABASE_URL = "postgresql://vectorlens:vectorlens123@localhost:5433/vectorlens"

engine = create_engine(DATABASE_URL)

SessionLocal = sessionmaker( bind=engine)


class Base(DeclarativeBase):
    pass

def create_tables():
    Base.metadata.create_all(bind=engine)


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()