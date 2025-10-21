from src.repositories.vector_store_repository import VectorStoreRepository
from src.providers.openai_provider import openai_provider
from typing import List

Embedding = List[int]
Chunk = List[str]

class EmbeddingService:
    def embed_chunks(chunks:List[Chunk], embedding_model:str) -> List[Embedding]:
        response = openai_provider.get_embeddings(embedding_model, chunks)
        chunks_embeds = [r.embedding for r in response.data]
        return chunks_embeds
