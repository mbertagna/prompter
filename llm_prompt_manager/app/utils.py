from pathlib import Path
import json
import os
import tempfile

DATA_FILE = Path(__file__).resolve().parent / "data" / "prompts.json"


def ensure_data_file():
    """Create prompts.json if it doesn't exist."""
    if not DATA_FILE.exists():
        DATA_FILE.parent.mkdir(parents=True, exist_ok=True)
        DATA_FILE.write_text("[]", encoding="utf-8")
    return DATA_FILE


def load_json(file_path: Path):
    """Load JSON safely."""
    if not file_path.exists():
        return []
    with open(file_path, "r", encoding="utf-8") as f:
        return json.load(f)


def save_json_safe(data, file_path: Path):
    """
    Write JSON atomically and corruption-proof:
    - Write to a secure temporary file in same directory
    - Flush + fsync
    - Atomically replace target file
    """
    dir_name = file_path.parent
    with tempfile.NamedTemporaryFile("w", delete=False, dir=dir_name, encoding="utf-8") as tmp:
        json.dump(data, tmp, indent=2)
        tmp.flush()
        os.fsync(tmp.fileno())
        tmp_path = tmp.name

    os.replace(tmp_path, file_path)