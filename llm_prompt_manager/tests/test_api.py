#### `tests/test_api.py`

from fastapi.testclient import TestClient
from llm_prompt_manager.app.main import app
import uuid


client = TestClient(app)


def test_list_prompts():
    r = client.get("/api/prompts/")
    assert r.status_code == 200
    assert isinstance(r.json(), list)


def test_create_update_delete_prompt():
    # Create
    payload = {
        "title": "Test Title",
        "description": "Test Description",
        "base_prompt": "Hello, {{name}}!",
        "parameters": ["name"]
    }
    r = client.post("/api/prompts/", json=payload)
    assert r.status_code == 200
    data = r.json()
    assert data["status"] == "created"
    created_prompt = data["prompt"]
    assert created_prompt["id"]

    # Get one
    r = client.get(f"/api/prompts/{created_prompt['id']}")
    assert r.status_code == 200
    assert r.json()["title"] == payload["title"]

    # Update
    updated = {**created_prompt, "title": "Updated Title"}
    r = client.post("/api/prompts/", json=updated)
    assert r.status_code == 200
    data = r.json()
    assert data["status"] == "updated"
    assert data["prompt"]["title"] == "Updated Title"

    # Delete
    r = client.delete(f"/api/prompts/{created_prompt['id']}")
    assert r.status_code == 200
    # Ensure it's gone
    r = client.get(f"/api/prompts/{created_prompt['id']}")
    assert r.status_code == 404