from typing import TypedDict
from src.services.embedding_service import embedding_service
from langchain_core.documents import Document

class Metadata(TypedDict):
    subject: str

class RetrievalService:
    def retrieve(topics: list[str], metadata: Metadata) -> list[str]:
        topicEmbeddings = embedding_service.embed_chunks(topics)
        retrievedInfo: list[str] = list()
        for embedding in topicEmbeddings:
            pass
