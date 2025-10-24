from argparse import ArgumentParser
from src.services.chunking_service import chunking_service
from src.services.vector_store_service import vector_store_service 
from langchain_community.document_loaders import TextLoader
from langchain_community.document_loaders import DirectoryLoader
from os import sep

def main():
  """
  Main function to load notes.
  """
  parser = ArgumentParser()
  parser.add_argument("--subject", type=str, default="SO")
  args = parser.parse_args()

  subject :str = args.subject

  loader = DirectoryLoader(
      f".{sep}docs{sep}{subject}{sep}notes",  
      glob="*.md",
      loader_cls=TextLoader,
  )
  
  documents = loader.load()
  
  for document in documents:
    chunks_for_document = chunking_service.chunk(document.page_content)
    for chunk in chunks_for_document:
      chunk.metadata = {**chunk.metadata, 'subject': subject}
    vector_store_service.store(chunks_for_document)

  #documents = vector_store_service.retrieve("scheduling", {"subject": subject}) 
  #print(f"Retrieved {len(documents)} documents:")
  #for doc in documents: 
  #  print(doc)
  
if __name__ == "__main__":
  main()