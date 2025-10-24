from src.services.vector_store_service import vector_store_service
from src.types.services import Metadata
from langchain_core.documents import Document

class RetrievalService:
    def retrieve(self, topics: list[str], metadata: Metadata) -> dict[str, list[str]]:
        retrievedInfo:dict[str, list[str]] = {}
        for topic in topics:
            response = vector_store_service.retrieve(topic, metadata) # list[Document]
            retrievedInfo[topic] = list(map(lambda d: d['page_content'], response))
        return retrievedInfo

retrieval_service = RetrievalService()