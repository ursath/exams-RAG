from src.services.prompt_service import prompt_service
from src.constants.services import UserPrompt

prompt = UserPrompt(subject="software_project_management", type="midterm1")

for msg in prompt_service.process_prompt(prompt):
  print(msg, end="", flush=True)
