🔧 Implementation Plan for LLM Prompt Manager

1. Project Structure

Organize the app for maintainability, modularity, and clarity.

llm_prompt_manager/
│
├── app/
│   ├── main.py                # FastAPI entry point (routes, startup/shutdown)
│   ├── models.py              # Data models (Prompt schema, Pydantic models)
│   ├── crud.py                # File I/O operations for prompts.json
│   ├── api.py                 # API endpoints (CRUD operations)
│   ├── utils.py               # Helper functions (UUID, file safety, etc.)
│   ├── templates/
│   │   └── index.html         # Main Jinja2 HTML template
│   ├── static/
│   │   ├── style.css          # Optional: extra styles beyond Bootstrap
│   │   └── script.js          # Vanilla JS logic (search, substitution, copy, modals)
│   └── data/
│       └── prompts.json       # Persistent prompt data (created on first run)
│
├── tests/
│   └── test_api.py            # Unit tests for API and CRUD
│
├── requirements.txt
└── README.md


⸻

2. Backend Implementation

2.1 main.py
	•	Initialize FastAPI app.
	•	Mount static and template directories.
	•	Include router from api.py.
	•	On startup:
	•	Check if prompts.json exists; if not, create an empty array [].
	•	On shutdown:
	•	Optionally flush in-memory cache (if caching is used).

2.2 models.py
	•	Define a Prompt Pydantic model:

class Prompt(BaseModel):
    id: str
    title: str
    description: str
    base_prompt: str
    parameters: List[str]


	•	Define optional PromptCreate and PromptUpdate schemas for clean CRUD operations.

2.3 crud.py

Handles file-safe CRUD operations:
	•	Load prompts (load_prompts())
	•	Save prompts (save_prompts_safe())
	•	Write to a temporary file (e.g., prompts.tmp.json), then rename to prompts.json.
	•	Add, edit, delete functions that manipulate the list and call save.

Example:

def save_prompts_safe(prompts, file_path):
    tmp = file_path + ".tmp"
    with open(tmp, 'w') as f:
        json.dump(prompts, f, indent=2)
    os.replace(tmp, file_path)


⸻

3. API Implementation (api.py)

Operation	Method	Endpoint	Behavior
List all prompts	GET	/api/prompts	Return all prompts
Get one prompt	GET	/api/prompts/{id}	Return prompt by ID
Add prompt	POST	/api/prompts	Create a new prompt, generate UUID
Update prompt	POST	/api/prompts	Overwrite existing prompt matching ID
Delete prompt	DELETE	/api/prompts/{id}	Remove from file and memory

Use FastAPI’s built-in response models for automatic validation and OpenAPI documentation.

⸻

4. Frontend Implementation

4.1 index.html (Jinja2)
	•	Simple two-panel layout:
	•	Left panel: list of prompt titles with a search box.
	•	Right panel: detail view (title, description, editable parameters, live assembled output).
	•	Use Bootstrap layout grid (col-md-4 / col-md-8) and modals for “Add/Edit Prompt.”

4.2 script.js

Implements:
	•	Fetch all prompts from /api/prompts and populate sidebar.
	•	Filter list client-side using a search input (text matching title/description).
	•	Load selected prompt into detail view.
	•	Dynamically create parameter input boxes (textarea per parameter).
	•	Real-time substitution using:

const assembled = basePrompt.replace(/{{(.*?)}}/g, (_, key) => formValues[key] || '');


	•	Copy-to-clipboard functionality with navigator.clipboard.writeText().

4.3 Modal forms
	•	Triggered by “Add” or “Edit” buttons.
	•	Support dynamic parameter addition/removal.
	•	On submit, POST to /api/prompts.

⸻

5. Data Flow Overview
	1.	User opens app → Frontend fetches all prompts via /api/prompts.
	2.	User selects a prompt → JS loads prompt details and parameters.
	3.	User types into parameter boxes → JS substitutes values live in assembled preview.
	4.	User clicks “Copy” → Prompt text copied to clipboard.
	5.	User adds/edits/deletes a prompt → Backend updates prompts.json safely.

⸻

6. Testing Plan

6.1 Unit Tests
	•	CRUD operations on test JSON files (ensure safe overwrite).
	•	API endpoint tests with FastAPI TestClient.

6.2 Frontend Tests (optional)
	•	Basic JS integration test using Playwright or Cypress (optional for local utility).

⸻

7. Enhancement Hooks (Future)
	•	Add categories/tags for better organization.
	•	Export/import functionality (JSON).
	•	Version history (simple diff system in file).
	•	Parameter templates or autocomplete.

⸻

8. Implementation Order
	1.	Initialize project structure.
	2.	Implement models.py, crud.py, api.py.
	3.	Build FastAPI app (main.py).
	4.	Create index.html with static JS logic.
	5.	Connect frontend to API.
	6.	Add modal forms and live substitution logic.
	7.	Implement file safety and basic tests.
	8.	Polish UI (Bootstrap, responsiveness).
