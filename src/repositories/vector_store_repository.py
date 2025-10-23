from pinecone import ServerlessSpec, Pinecone as PineconeClient
from src.services.environment_service import environment_service
from src.types.services import Metadata
from typing import List, Dict, Any
from src.constants.db import index_name
from langchain_pinecone import Pinecone 
from src.providers.openai_provider import openai_provider


class VectorStoreRepository:
    def __init__(self, index_name:str, vector_dim:int, sim_method:str="cosine"):
        self.sim_method = sim_method
        self.index_name = index_name
        self.raw_pc = PineconeClient(environment_service.get_pinecone_api_key())
        self.embedder = openai_provider.get_embedding_model("text-embedding-3-small")
        self.vector_store = Pinecone(environment_service.get_pinecone_api_key(), embedding=self.embedder)
        self.init_repository(index_name, vector_dim, sim_method)

    def init_repository(self, index_name:str = "notes", vector_dimension:int = 1536, similarity_method = "cosine"):

        if index_name not in self.raw_pc.list_indexes().names():
            self.raw_pc.create_index(
                name=index_name,
                dimension=vector_dimension,
                metric=similarity_method,
                spec=ServerlessSpec(
                    cloud="aws",       
                    region="us-east-1" 
                )
            )

        self.vector_store = Pinecone.from_existing_index(index_name=index_name, embedding=self.embedder)

    def store(self, docs:List[Any]):
        self.vector_store.add_documents(docs)
       
    # query: topic
    # metadata: "subject" field
    def retrieve(self, query:str, metadata: dict, top_k:int = 5): 
        
        metadata_filter = {
            "$and": [
                {"subject": {"$eq": metadata['subject']}},
            ]
        }

        results = self.vector_store.similarity_search(query, filter=metadata_filter, k=top_k)

        return results
