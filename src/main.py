from pdf2image import convert_from_path
import pytesseract
import logging
from dotenv import load_dotenv, find_dotenv
from argparse import ArgumentParser
from glob import glob
from pypdf import PdfReader
import fitz

custom_config = "--tessdata-dir /usr/share/tesseract-ocr/5/tessdata"

def main():
  _ = load_dotenv(find_dotenv())
  parser = ArgumentParser()
  parser.add_argument("--knowledge_dir", type=str, default="docs")
  parser.add_argument("--subject_dir", type=str, default="*")
  args = parser.parse_args()

  kb_directory: str = args.knowledge_dir
  subject_dir: str = args.subject_dir

  logging.basicConfig(
    level=logging.DEBUG,
    format="[%(levelname)s] - %(message)s ",
    handlers=[
        logging.FileHandler("logs/exams-rag.log", mode="w"),
        logging.StreamHandler(),
    ],
    force=True
  )

  logger = logging.getLogger(__name__)
  
  
  pdfs = glob(fr"{kb_directory}/{subject_dir}/*.pdf")
  # read PDF text
  for pdf_path in pdfs:
    pages = fitz.open(pdf_path)
    pdf_texts = [p.get_text().strip() for p in pages]
    pdf_texts = "\n".join([text for text in pdf_texts if text])
    pdf_path_without_extension = pdf_path.replace(".pdf", "")
    with open(f"{pdf_path_without_extension}a.txt", "a") as parsed_pdf:
      parsed_pdf.write(pdf_texts)
  
  # parse PDFs with images
  
  # for pdf_path in pdfs:
  #   pages = convert_from_path(pdf_path) # Default -> dpi=200
    
  #   for img_blob in pages:
  #     text = pytesseract.image_to_string(img_blob, lang="spa", config=custom_config)
  #     pdf_path_without_extension = pdf_path.replace(".pdf", "")
  #     with open(f"{pdf_path_without_extension}.txt", "a") as parsed_pdf:
  #       parsed_pdf.write(text)
  
  return

if __name__ == "__main__":
  main()

