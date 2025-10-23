from argparse import ArgumentParser
from src.services.chunking_service import chunking_service
from src.services.vector_store_service import VectorStoreService
from langchain_community.document_loaders import TextLoader
from langchain_community.document_loaders import DirectoryLoader
from pathlib import Path

def main():
  """
  Main function to load notes.
  """
  parser = ArgumentParser()
  parser.add_argument("--subject", type=str, default="SO")
  args = parser.parse_args()

  subject :str = args.subject

  loader = DirectoryLoader(
      f"./docs/{subject}/notes",  
      glob="*.md",
      loader_cls=TextLoader,
  )
  
  documents = loader.load()
  
  vector_store_service = VectorStoreService(index_name=f"notes-index", vector_dim=1536)
  for document in documents:
    chunks_for_document = chunking_service.chunk(document.page_content)
    for chunk in chunks_for_document:
      chunk.metadata = {**chunk.metadata, 'subject': subject}

  documents = vector_store_service.retrieve("scheduling", {"subject": subject}) 
  print(f"Retrieved {len(documents)} documents:")
  for doc in documents: 
    print(doc)
  
if __name__ == "__main__":
  main()