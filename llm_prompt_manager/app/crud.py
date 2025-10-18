from .models import Prompt
from .utils import ensure_data_file, load_json, save_json_safe


def get_all_prompts():
    file_path = ensure_data_file()
    return load_json(file_path)


def get_prompt_by_id(prompt_id: str):
    prompts = get_all_prompts()
    for prompt in prompts:
        if prompt["id"] == prompt_id:
            return prompt
    return None


def add_prompt(prompt_data: dict):
    prompts = get_all_prompts()
    prompts.append(prompt_data)
    save_json_safe(prompts, ensure_data_file())
    return prompt_data


def update_prompt(updated_prompt: dict):
    prompts = get_all_prompts()
    for i, prompt in enumerate(prompts):
        if prompt["id"] == updated_prompt["id"]:
            prompts[i] = updated_prompt
            save_json_safe(prompts, ensure_data_file())
            return updated_prompt
    return None


def delete_prompt(prompt_id: str):
    prompts = get_all_prompts()
    updated_prompts = [p for p in prompts if p["id"] != prompt_id]
    save_json_safe(updated_prompts, ensure_data_file())
    return len(updated_prompts) < len(prompts)