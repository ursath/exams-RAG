from .provider import Provider
from src.services.environment_service import environment_service
from openai.types import ResponsesModel
from openai.types.responses import ResponseStreamEvent, ResponseInputFileParam, ResponseInputTextParam
from openai.types.responses.response_input_param import Message
from typing import Optional, List, override
from glob import glob
from concurrent.futures import ThreadPoolExecutor, as_completed
from os.path import join
import openai

class OpenAIProvider(Provider):
  def __init__(self, api_key: str, max_workers: int):
    self._max_workers = max_workers;
    openai.api_key = api_key

  def _augment_file_ids(self, file_ids: List[str]) -> List[ResponseInputFileParam]:
    return [
      {
        "type": "input_file",
        "file_id": file_id
      }
      for file_id in file_ids
    ]
  
  def _augment_system_instructions(self, system_instructions: Optional[str] = None) -> List[Message]:
    if system_instructions is None:
      return []
    return [
      {
        "role": "system",
        "content": [
          {
            "type": "input_text",
            "text": system_instructions
          }
        ]
      }
    ]
    
  def _augment_text_prompt(self, text_prompt: str) -> List[ResponseInputTextParam]:
    return [
      {
        "type": "input_text",
        "text": text_prompt
      }
    ]
  
  def _get_augmented_input(self, prompt: str, system_instructions: Optional[str], file_ids: List[str]) -> List[ResponseInputFileParam | ResponseInputTextParam | Message]:
    system_prompt = self._augment_system_instructions(system_instructions)
    text_prompt = self._augment_text_prompt(prompt)
    file_prompt = self._augment_file_ids(file_ids)
    
    return system_prompt + text_prompt + file_prompt
  
  @override
  def prompt(
    self,
    text_prompt: str,
    model: Optional[ResponsesModel] = "gpt-4.1",
    temperature: Optional[float] = 0.3, 
    system_instructions: Optional[str] = None,
    file_ids: List[str] = []
  ) -> str:
    
    input = self._get_augmented_input(text_prompt, system_instructions, file_ids)
    
    response: openai.Stream[ResponseStreamEvent] = openai.responses.create(
      stream=True,
      model=model,
      input=input,
      temperature=temperature
    )
    
    # TODO: handle the response
  
  @override
  def upload_files(self, dir: str) -> List[str]:
    file_paths = glob(f"{dir}/*")
    file_ids = []
    with ThreadPoolExecutor(max_workers=self._max_workers) as executor:
      future_to_path = {executor.submit(self.upload_file, p): p for p in file_paths}
      for future in as_completed(future_to_path):
        file_id = future.result()
        file_ids.append(file_id)
    return file_ids

  @override
  def upload_file(self, path: str) -> str:
    with open(path, "rb") as f:
      response = openai.files.create(
        file=f,
        purpose="user_data"
      )
    return response.id
  
  @override
  def delete_file(self, file_id: str) -> None:
    openai.files.delete(file_id)
  
  @override
  def delete_files(self, file_ids: list[str]) -> None:
    with ThreadPoolExecutor(max_workers=self._max_workers) as executor:
      executor.map(self.delete_file, file_ids)
  
openai_provider = OpenAIProvider(environment_service.get_openai_api_key(), environment_service.get_max_workers())