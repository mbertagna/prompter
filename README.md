# LLM Prompt Manager

A lightweight local web app for managing and assembling reusable LLM prompts.

## Quick Start
```bash
python3.11 -m venv llm_prompt_manager.env
source llm_prompt_manager.env/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

Open the app at `http://127.0.0.1:8000/`.

## Features
- Manage prompts with title, description, base prompt, and parameters.
- Search prompts client-side.
- Dynamic parameter inputs with live substitution into the base prompt using `{{parameter_name}}` syntax.
- Copy the final assembled prompt to clipboard.
- File-backed storage (`app/data/prompts.json`) with safe atomic writes.

## API
- GET `/api/prompts/`: List all prompts
- GET `/api/prompts/{id}`: Get a prompt by ID
- POST `/api/prompts/`: Create or update (include `id` for update)
- DELETE `/api/prompts/{id}`: Delete a prompt

## Run tests
```bash
python -m pytest -q llm_prompt_manager/tests
```
