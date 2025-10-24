from typing import Optional, List, overload, Union, Generator
from src.providers.provider import Provider
from src.providers.openai_provider import openai_provider

class LLMService:
  def __init__(self, provider: Provider):
    self._provider = provider
  
  @overload
  def prompt(
    self,
    text_prompt: Optional[str] = None,
    system_instructions: Optional[str] = None,
    model: str = "gpt-4.1",
    file_ids: List[str] = [],
    stream: bool = True
  ) -> Generator[str, None, None]: ...

  @overload
  def prompt(
    self,
    text_prompt: Optional[str] = None,
    system_instructions: Optional[str] = None,
    model: str = "gpt-4.1",
    file_ids: List[str] = [],
    stream: bool = False
  ) -> str: ...

  def prompt(
    self,
    text_prompt: Optional[str] = None,
    system_instructions: Optional[str] = None,
    model: str = "gpt-4.1",
    file_ids: List[str] = [],
    stream: bool = False
  ) -> Union[str, Generator[str, None, None]]:
    return self._provider.prompt(
      text_prompt=text_prompt,
      system_instructions=system_instructions,
      model=model,
      file_ids=file_ids,
      stream=stream
    )
  
  def upload_files(self, dir: str) -> List[str]:
    return self._provider.upload_files(dir)

  def upload_file(self, path: str) -> str:
    return self._provider.upload_file(path)
  
  def delete_files(self, file_ids: List[str]) -> None:
    self._provider.delete_files(file_ids)
  
  def delete_file(self, file_id: str) -> None:
    self._provider.delete_file(file_id)
    
llm_service = LLMService(openai_provider)
