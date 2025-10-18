from abc import ABC, abstractmethod
from typing import List, Optional


class Embedder:
  """Placeholder for an Embedder class definition."""
  pass

class Provider(ABC):
  @abstractmethod
  def prompt(self, text_prompt: str, system_instructions: Optional[str] = None, model: str = "", file_ids: List[str] = []) -> str:
    """
    Generate a response given a user prompt and optional system instructions.
    """
    raise NotImplementedError("Subclasses must implement 'prompt' method")

  @abstractmethod
  def upload_files(self, dir: str) -> List[str]:
    """Upload all files in a directory. Returns a list of file IDs."""
    raise NotImplementedError("Subclasses must implement 'upload_files' method")

  @abstractmethod
  def upload_file(self, path: str) -> str:
    """Upload a single file. Returns the file ID."""
    raise NotImplementedError("Subclasses must implement 'upload_file' method")

  @abstractmethod
  def delete_files(self, file_ids: List[str]) -> None:
    """Delete multiple files by their IDs."""
    raise NotImplementedError("Subclasses must implement 'delete_files' method")

  @abstractmethod
  def delete_file(self, file_id: str) -> None:
    """Delete a single file by its ID."""
    raise NotImplementedError("Subclasses must implement 'delete_file' method")
