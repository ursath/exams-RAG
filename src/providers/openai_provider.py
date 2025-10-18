from .provider import Provider
from src.services.environment_service import environment_service
from openai.types import ResponsesModel
from openai.types.responses import ResponseStreamEvent, ResponseInputFileParam, ResponseInputTextParam
from openai.types.responses.response_input_param import Message
from typing import Optional, List
import openai

class OpenAIProvider(Provider):
  def __init__(self, api_key: str):
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
    
  def upload_file(self, path: str) -> str:
    with open(path, "rb") as f:
      response = openai.files.create(
        file=f,
        purpose="user_data"
      )
    return response.id
  
openai_provider = OpenAIProvider(environment_service.get_openai_api_key())