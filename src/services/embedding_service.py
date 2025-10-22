from src.repositories.vector_store_repository import VectorStoreRepository
from src.providers.openai_provider import openai_provider
from openai.types.embedding import Embedding 
from typing import List

Chunk = str

class EmbeddingService:

    def __init__(self, embedding_model:str):
        self.embedding_model = embedding_model

    def embed_chunks(self, chunks:List[Chunk]) -> List[Embedding]:
        response = openai_provider.get_embeddings(self.embedding_model, chunks)
        chunks_embeds = [r.embedding for r in response.data]
        return chunks_embeds
