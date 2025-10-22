from pinecone.grpc import PineconeGRPC as Pinecone
from pinecone import ServerlessSpec
from src.services.environment_service import environment_service
from typing import List, Dict, Any


class VectorStoreRepository:
    def __init__(self, index_name:str, vector_dim:int, sim_method:str="cosine"):
        self.sim_method = sim_method
        self.index_name = index_name
        self.pc = Pinecone(environment_service.get_pinecone_api_key())
        self.init_repository(index_name, vector_dim, sim_method)

    def init_repository(self, index_name:str = "notes", vector_dimension:int = 1536, similarity_method = "cosine"):

        if index_name not in self.pc.list_indexes().names:
            self.pc.create_index(
                name=index_name,
                dimension=vector_dimension,
                metric=similarity_method,
                spec=ServerlessSpec(
                    cloud="aws",       
                    region="sa-east-1" 
                )
            )
        self.index = self.pc.Index(index_name)

    #metadata should be a list where each element is a dict like this (for each embedding): {"subject": "SO", "topics": ["pipes", "shared memory", "sockets"], "main topic": "IPC"}
    def store(self, docs, batch_size:int=256):
        total_vectors = len(docs)
        
        for i in range(0, total_vectors, batch_size):
            batch = docs[i : i + batch_size]
            self.index.upsert(vectors=batch)
       
    def retrieve(self, query_embedding: List[int], metadata: dict, top_k:int = 5): 
        
        metadata_filter = {
            "$and": [
                {"subject": {"$eq": metadata['subject']}},
                {"$or": [
                    {"main topic": {"$eq": metadata['main topic']}},
                    {"topics": {"$eq": metadata['main topic']}}
                ]}
            ]
        }

        results = self.index.query(
            vector = query_embedding,
            top_k = top_k, 
            filter= metadata_filter,
            include_metadata=True
        )

        return results
