from typing import TypedDict, Literal, Union
from langchain_core.documents import Document


class Metadata(TypedDict):
    subject: str

class UserPrompt(TypedDict):
   subject: str
   type: str

class Exercise(TypedDict):
    topic: str
    type: str
