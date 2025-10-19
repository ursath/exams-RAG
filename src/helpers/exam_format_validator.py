from typing import List
from pydantic import BaseModel, Field, field_validator, ConfigDict

class Topic(BaseModel):
  topic: str
  exercises_per_exam_avg: float = Field(ge=0)
  true_or_false_amount: int = Field(ge=0)
  multiple_choice_amount: int = Field(ge=0)
  essay_amount: int = Field(ge=0)
  midterm_appearances: List[float] = Field(default_factory=list)
  final_appearances: float = Field(ge=0, le=1)

  @field_validator("exercises_per_exam_avg", "final_appearances", mode="before")
  def round_floats(cls, v):
    return round(v, 2)

  @field_validator("midterm_appearances", mode="before")
  def round_midterms(cls, v):
    return [round(x, 2) for x in v]

  model_config = ConfigDict(extra="forbid")


class ExamAnalysis(BaseModel):
  subject: str
  exercise_amount_avg: float = Field(ge=0)
  exams_amount: int = Field(ge=0)
  topics: List[Topic]

  @field_validator("exercise_amount_avg", mode="before")
  def round_exercise_avg(cls, v):
    return round(v, 2)

  model_config = ConfigDict(extra="forbid")
