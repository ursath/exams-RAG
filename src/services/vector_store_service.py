from src.repositories.vector_store_repository import VectorStoreRepository
from src.constants.db import index_name
from typing import List
from langchain_core.documents import Document

class VectorStoreService:
    def __init__(self, index_name:str, vector_dim:int, sim_method:str="cosine"):
        self.repository = VectorStoreRepository(index_name, vector_dim, sim_method)

    def store(self, docs: List[Document]):
        self.repository.store(docs)

    def retrieve(self, query: str, query_metadata: dict, threshold:float = 0.25, top_k:int = 5): 
        response = self.repository.retrieve(query, query_metadata, top_k)
        return response

# there is no property in embedder to get vector dimension -> change manually
vector_store_service = VectorStoreService(index_name, 1536)