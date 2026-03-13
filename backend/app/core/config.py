"""Configuration module for initializing embedders and managing application settings."""
from app.services.embedding.factory import EmbeddingFactory


embedder = EmbeddingFactory.create("ollama")

result = embedder.embed(["Hello, world!", "How are you?"])

print(result)