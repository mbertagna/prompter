from pydantic import BaseModel, Field
from typing import List, Optional
import uuid


class PromptBase(BaseModel):
    title: str
    description: str
    base_prompt: str
    parameters: List[str] = Field(default_factory=list)


class Prompt(PromptBase):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))


class PromptCreate(PromptBase):
    pass


class PromptUpdate(PromptBase):
    id: str