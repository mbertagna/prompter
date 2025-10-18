from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Literal
from .models import Prompt, PromptCreate, PromptUpdate
from . import crud

router = APIRouter(prefix="/api/prompts", tags=["prompts"])


@router.get("/")
def list_prompts():
    return crud.get_all_prompts()


@router.get("/{prompt_id}")
def get_prompt(prompt_id: str):
    prompt = crud.get_prompt_by_id(prompt_id)
    if not prompt:
        raise HTTPException(status_code=404, detail="Prompt not found")
    return prompt


class OperationResult(BaseModel):
    status: Literal["created", "updated"]
    prompt: Prompt


@router.post("/", response_model=OperationResult)
def create_or_update_prompt(data: dict):
    """Handles both add and edit depending on if 'id' is present, with validation."""
    # Validate input using Pydantic models
    if "id" in data and data["id"]:
        valid = PromptUpdate(**data)
        updated = crud.update_prompt(valid.dict())
        if not updated:
            raise HTTPException(status_code=404, detail="Prompt not found for update")
        return {"status": "updated", "prompt": updated}
    else:
        valid = PromptCreate(**data)
        # Create a new Prompt (auto-generates UUID)
        prompt = Prompt(**valid.dict()).dict()
        created = crud.add_prompt(prompt)
        return {"status": "created", "prompt": created}


@router.delete("/{prompt_id}")
def delete_prompt(prompt_id: str):
    deleted = crud.delete_prompt(prompt_id)
    if not deleted:
        raise HTTPException(status_code=404, detail="Prompt not found for deletion")
    return {"status": "deleted"}