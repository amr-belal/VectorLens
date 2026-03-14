# VectorLens
an arena application like for determining best VectorDB for your use case 



python -m venv .venv

source .venv/bin/activate

uvicorn app.main:app --reload

celery -A app.core.celery_app worker --loglevel=info