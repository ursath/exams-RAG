from src.repositories.vector_store_repository import VectorStoreRepository
from src.services.embedding_service import EmbeddingService
from typing import List
from langchain_core.documents import Document

class VectorStoreService:
    def __init__(self, index_name:str, vector_dim:int, sim_method:str="cosine"):
        self.repository = VectorStoreRepository(index_name, vector_dim, sim_method)
        self.embedder = EmbeddingService()

    def store(self, docs: List[Document], embedding_model: str):
        embeddings, metadata = self.process_docs(docs, embedding_model)
        self.repository.store(self, embeddings, metadata)

    def prepare_doc_format(id: str, values: List[int], metadata: dict)-> dict:
        doc = {}
        doc['id'] = id
        doc['values'] = values 
        doc['metadata'] = metadata
        return doc

    def process_docs(self, docs: List[Document], embedding_model: str):
        raw_chunks= []
        metadata = []
        for doc in docs:
            raw_chunks.append(doc.page_content)
            metadata.append(doc.metadata)
        
        embeddings = self.embedder.embed_chunks(raw_chunks, embedding_model)

        processed_docs = []

        for embedding, meta in zip(embeddings, metadata):
            id = f"{self.repository.index_name}-{meta['subject']}-{meta['main topic']}-{'-'.join(meta['topics'])}" 
            doc = self.prepare_doc_format(id, embedding, meta)
            processed_docs.append(doc)

        return processed_docs 
    

    def filter_out_by_threshold(self, results: object, threshold:float):
        filtered_results = []
        for match in results.matches:
            if (match.score >= threshold):
                filtered_results.append(match)
            else:
                continue
        return filtered_results

    def retrieve(self, query_embedding: List[int], query_metadata: dict, threshold:float = 0.25, top_k:int = 5): 
        response = self.repository.retrieve(query_embedding, query_metadata, top_k)
        response_filtered = self.filter_out_by_threshold(response, threshold)
        return response_filtered
