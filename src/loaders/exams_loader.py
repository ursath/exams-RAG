
from argparse import ArgumentParser
from src.services.llm_service import llm_service
from src.constants.instructions import exams_loader_instructions
from src.helpers.exam_format_validator import ExamAnalysis
from src.services.s3_service import s3_service
import json

def main():
  """
  Main function to load the different exams.
  
  Use the `--subject_dir` argument to specify the subject directory.
  For example, `python src/loaders/exams_loader --subject_dir="docs/TADL"`.
  
  It's assumed that this directory contains at least one `exams` directory and a `topics.txt` file:
  - `exams`: directory that contains different PDF files with the following name convention - `{subject}-{ISO Date}.pdf`.
  For example, `sistemas_operativos-2024-12-08.pdf`.
  - `topics.txt`: text file containing the name of the subject and the different topics covered on this subject.
  For example, `
  Materia: Temas Avanzados de Deep Learning.
  Temas: Transformers, Tokenizers, Embedders, RAG (Retrieval-Augmented-Generation), AI Safety
  `
  """
  parser = ArgumentParser()
  parser.add_argument("--subject_dir", type=str, default="docs/TADL")
  args = parser.parse_args()
  
  subject_directory: str = args.subject_dir
  file_ids = llm_service.upload_files(subject_directory)
  exam_format = llm_service.prompt(
    system_instructions=exams_loader_instructions,
    file_ids=file_ids,
  )
  
  parsed_json = json.loads(exam_format)
  validated_json = ExamAnalysis(**parsed_json)
  
  subject = validated_json.subject
  s3_key = f"{subject}/format.json"
  
  s3_service.upload_file(s3_key, exam_format)
  
if __name__ == "__main__":
  main()