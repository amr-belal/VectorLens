from fastapi import FastAPI 
from app.api.v1.routes.upload import router as upload_router
from app.core.database import create_tables
from app.models import document , chunk
from contextlib import asynccontextmanager
from app.api.v1.routes.search import router as search_router
from app.services.embedding.factory import EmbeddingFactory
from app.api.v1.routes.benchmark import router as benchmark_router
from app.api.v1.routes.analyze import router as analyze_router
from app.api.v1.routes.chat import router as chat_router
@asynccontextmanager
async def lifespan(app: FastAPI):

    """ Lifespan context manager for FastAPI application.

    This context manager is responsible for creating the database tables
    and setting up the embedder for the application.

    It creates the database tables when entering the context and
    sets the embedder to the "ollama" embedder when entering the context.
    When exiting the context, it does nothing.

    """

    from app.core.database import create_tables
    create_tables()
    app.state.embedder = EmbeddingFactory.create("ollama")
    yield


app = FastAPI(lifespan=lifespan)
app.include_router(upload_router , prefix="/api/v1")
app.include_router(search_router , prefix="/api/v1")
app.include_router(benchmark_router , prefix="/api/v1")
app.include_router(analyze_router , prefix="/api/v1")
app.include_router(chat_router , prefix="/api/v1")