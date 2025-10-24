from flask import Flask, send_from_directory
from flask_cors import CORS
from src.controllers.prompt_controller import prompt_router
from src.controllers.subject_controller import subjects_router

import os

origins = [
  "http://localhost:3000",
  "http://127.0.0.1:3000",
]

frontend_url = os.getenv("FRONTEND_URL")
if frontend_url:
  origins.append(frontend_url)


app = Flask(
  __name__,
  static_folder="dist",
  template_folder="dist"
)
app.url_map.strict_slashes = False
CORS(app, resources={r"/*": {"origins": origins}})

app.register_blueprint(prompt_router)
app.register_blueprint(subjects_router)

@app.route("/", defaults={"path": ""})
@app.route("/<path:path>")
def serve_react(path):
  if path and os.path.exists(os.path.join(app.static_folder, path)):
      return send_from_directory(app.static_folder, path)
  return send_from_directory(app.static_folder, "index.html")
