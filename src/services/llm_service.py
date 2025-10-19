from typing import Optional, List
from src.providers.provider import Provider
from src.providers.openai_provider import openai_provider

class LLMService:
  def __init__(self, provider: Provider):
    self._provider = provider
    
  def prompt(
    self,
    text_prompt: str,
    model: str = "gpt-4.1",
    temperature: Optional[float] = 0.3, 
    system_instructions: Optional[str] = None,
    file_ids: List[str] = []
  ) -> str:
    return self._provider.prompt(
      text_prompt=text_prompt,
      model=model,
      temperature=temperature, 
      system_instructions=system_instructions,
      file_ids=file_ids
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