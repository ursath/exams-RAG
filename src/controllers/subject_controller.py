from flask import Blueprint, request
from src.constants.subjects import subjects

subjects_router = Blueprint("subjects", __name__, url_prefix="/subjects")

PAGE_SIZE = 20

@subjects_router.get("/")
def get_subjects():
  query = request.args.get("filter")
  if query is None:
    return subjects[:PAGE_SIZE]
  return "TODO"
