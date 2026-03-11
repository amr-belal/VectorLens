from fastapi import FastAPI 
from app.api.v1.routes.upload import router as upload_router
from app.core.database import create_tables
from app.models import document , chunk
from contextlib import asynccontextmanager


@asynccontextmanager
async def lifespan(app: FastAPI):
    from app.core.database import create_tables
    create_tables()
    yield

app = FastAPI(lifespan=lifespan)
app.include_router(upload_router , prefix="/api/v1")


