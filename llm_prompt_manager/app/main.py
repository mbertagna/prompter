from fastapi import FastAPI, Request
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from pathlib import Path

from .api import router as prompt_router
from .utils import ensure_data_file

app = FastAPI(title="LLM Prompt Manager")

BASE_DIR = Path(__file__).resolve().parent
templates = Jinja2Templates(directory=str(BASE_DIR / "templates"))
app.mount("/static", StaticFiles(directory=str(BASE_DIR / "static")), name="static")

# Include prompt API
app.include_router(prompt_router)

@app.on_event("startup")
def startup_event():
    ensure_data_file()

@app.get("/")
async def index(request: Request):
    """Render main UI."""
    return templates.TemplateResponse("index.html", {"request": request})