Concise Application Specification
1. Core Architecture & Technology
| Component | Detail | Rationale |
|---|---|---|
| Application Type | Local Web Application (FastAPI) | Provides a searchable interface with dynamic forms. |
| Language | Python | Portable and simple for utility development. |
| Frontend | Jinja2 Templates, HTML, Bootstrap CSS, Vanilla JavaScript | Simple and dependency-free for client-side interactivity. |
| Persistence | File I/O only (No external database) | Ensures maximum portability via Git; data is stored next to the code. |
| File Safety | Temporary file write mechanism (FastAPI backend) | Prevents data corruption of prompts.json during save operations. |
2. Data Structure & Storage
| Element | Detail | Rationale |
|---|---|---|
| Data File | prompts.json | Human-readable, easy to version control and parse. |
| Prompt Structure | JSON array of objects | Stores all required metadata for each prompt. |
| Placeholders | Jinja-style: {{parameter_name}} | Clear, standard syntax for substitution within the base_prompt. |
| Prompt ID | UUID (FastAPI generated) | Ensures a unique key for CRUD operations. |
3. User Interface (UI) Features
| Feature | Detail | Implementation |
|---|---|---|
| Prompt Listing | Left-hand panel displays all prompts. | Uses a simple HTML list and client-side JavaScript to load details. |
| Search/Filter | Real-time text input filter. | Client-side JavaScript (in index.html) filters the visible list items based on title/description. |
| Parameter Inputs | All parameters use a multi-line, scrollable textarea element. | Simple design choice that accommodates both short and long inputs. |
| Prompt Assembly | Real-time substitution. | Client-side JavaScript updates the output box immediately on every keystroke. |
| Final Output | Copy Button (sole function). | Copies the final assembled prompt text to the user's clipboard via navigator.clipboard.writeText(). |
4. Data Management (CRUD)
| Operation | Method / Endpoint | Detail |
|---|---|---|
| Add New Prompt | POST /api/prompts | Opens a modal form, generates a new uuid, and saves the entry. |
| Edit Existing | POST /api/prompts | Opens the modal, loads existing data via GET /api/prompts/{id}, and updates the entry by matching the existing ID. |
| Delete Prompt | DELETE /api/prompts/{id} | Removes the entry from the in-memory list and persists the change to prompts.json. |
| Parameter Editing | Integrated into the Edit modal | Dynamic UI allows users to add, edit, and remove parameter fields on the fly using vanilla JavaScript. |