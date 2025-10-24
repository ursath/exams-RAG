from flask import Blueprint, request, Response, stream_with_context
from src.services.prompt_service import PromptService, prompt_service
import json

prompt_router = Blueprint("prompt", __name__, url_prefix="/prompt")

def __init__(self, prompt_service: PromptService):
  self.prompt_service = prompt_service

@prompt_router.post("/")
def create_prompt():
  generator = prompt_service.process_prompt(request.json)
  @stream_with_context
  def sse_wrapper():
    for chunk in generator:
      data = json.dumps({"data": chunk})
      yield f"event: message_delta\ndata: {data}\n\n"
    yield "event: done\ndata: [DONE]\n\n"
  return Response(sse_wrapper(), mimetype="text/event-stream")
