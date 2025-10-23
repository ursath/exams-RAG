from src.services.embedding_service import embedding_service
from src.services.vector_store_service import vector_store_service
from src.types.services import Metadata
from langchain_core.documents import Document

class RetrievalService:
    def retrieve(topics: list[str], metadata: Metadata) -> list[str]:
        topicEmbeddings = embedding_service.embed_chunks(topics)
        retrievedInfo: list[list] = list() # una lista de documentos por cada topico
        for embedding in topicEmbeddings:
            response = vector_store_service.retrieve(embedding, metadata)
            # cada response tiene id, score, values y metadata (que tiene "text")
            retrievedInfo.append(response)
