// LLM Prompt Manager Frontend Logic
(function () {
    const apiBase = "/api/prompts"; // trailing slash added by endpoints where needed

    // State
    let prompts = [];
    let selectedPrompt = null;
    let parameterValues = {}; // { [paramName]: value }

    // Elements
    const searchInput = document.getElementById("searchInput");
    const promptList = document.getElementById("promptList");
    const detailTitle = document.getElementById("detailTitle");
    const detailDescription = document.getElementById("detailDescription");
    const parametersContainer = document.getElementById("parametersContainer");
    const assembledOutput = document.getElementById("assembledOutput");
    const copyBtn = document.getElementById("copyBtn");

    const addPromptBtn = document.getElementById("addPromptBtn");
    const editPromptBtn = document.getElementById("editPromptBtn");
    const deletePromptBtn = document.getElementById("deletePromptBtn");

    // Modal elements
    const promptModalEl = document.getElementById("promptModal");
    const promptModal = promptModalEl ? new bootstrap.Modal(promptModalEl) : null;
    const promptIdEl = document.getElementById("promptId");
    const promptTitleEl = document.getElementById("promptTitle");
    const promptDescriptionEl = document.getElementById("promptDescription");
    const promptBaseEl = document.getElementById("promptBase");
    const addParamFieldBtn = document.getElementById("addParamFieldBtn");
    const paramFields = document.getElementById("paramFields");
    const savePromptBtn = document.getElementById("savePromptBtn");
    const promptModalTitle = document.getElementById("promptModalTitle");

    // Utilities
    function sanitize(str) {
        return (str || "").toString();
    }

    function replacePlaceholders(template, values) {
        if (!template) return "";
        return template.replace(/\{\{(.*?)\}\}/g, (_, key) => {
            const trimmed = key.trim();
            return values[trimmed] || "";
        });
    }

    function setButtonsEnabled(enabled) {
        editPromptBtn.disabled = !enabled;
        deletePromptBtn.disabled = !enabled;
        copyBtn.disabled = !enabled;
    }

    // Fetch & Render
    async function loadPrompts() {
        try {
            const res = await fetch(`${apiBase}/`);
            if (!res.ok) throw new Error(`Failed to fetch prompts: ${res.status}`);
            prompts = await res.json();
            renderList();
            // Keep selection if still present
            if (selectedPrompt) {
                const stillExists = prompts.find(p => p.id === selectedPrompt.id);
                if (stillExists) {
                    selectPrompt(stillExists);
                } else {
                    clearDetail();
                }
            }
        } catch (err) {
            console.error(err);
            alert("Failed to load prompts.");
        }
    }

    function renderList(filterText = sanitize(searchInput.value).toLowerCase()) {
        promptList.innerHTML = "";
        const filtered = prompts.filter(p => {
            const title = sanitize(p.title).toLowerCase();
            const desc = sanitize(p.description).toLowerCase();
            return !filterText || title.includes(filterText) || desc.includes(filterText);
        });

        filtered.forEach(p => {
            const li = document.createElement("li");
            li.className = "list-group-item list-group-item-action" + (selectedPrompt && selectedPrompt.id === p.id ? " active" : "");
            li.textContent = p.title;
            li.style.cursor = "pointer";
            li.addEventListener("click", () => selectPrompt(p));
            promptList.appendChild(li);
        });
    }

    function clearDetail() {
        selectedPrompt = null;
        detailTitle.textContent = "Select a prompt";
        detailDescription.textContent = "";
        parametersContainer.innerHTML = "";
        assembledOutput.textContent = "";
        parameterValues = {};
        setButtonsEnabled(false);
        renderList();
    }

    function selectPrompt(prompt) {
        selectedPrompt = prompt;
        renderDetail(prompt);
        setButtonsEnabled(true);
        renderList();
    }

    function renderDetail(prompt) {
        detailTitle.textContent = sanitize(prompt.title);
        detailDescription.textContent = sanitize(prompt.description);
        parametersContainer.innerHTML = "";
        parameterValues = parameterValues || {};

        const parameters = Array.isArray(prompt.parameters) ? prompt.parameters : [];
        parameters.forEach(paramName => {
            const wrapper = document.createElement("div");
            wrapper.className = "mb-2";

            // top row with label and clear button
            const topRow = document.createElement("div");
            topRow.className = "d-flex align-items-center justify-content-between";

            const label = document.createElement("label");
            label.className = "form-label m-0";
            label.textContent = paramName;
            label.setAttribute("for", `param_${paramName}`);

            const clearBtn = document.createElement("button");
            clearBtn.type = "button";
            clearBtn.className = "btn btn-sm btn-outline-secondary";
            clearBtn.textContent = "Clear";

            topRow.appendChild(label);
            topRow.appendChild(clearBtn);

            const textarea = document.createElement("textarea");
            textarea.className = "form-control";
            textarea.id = `param_${paramName}`;
            textarea.value = parameterValues[paramName] || "";
            textarea.addEventListener("input", () => {
                parameterValues[paramName] = textarea.value;
                updateAssembled();
            });

            clearBtn.addEventListener("click", () => {
                textarea.value = "";
                parameterValues[paramName] = "";
                updateAssembled();
                textarea.focus();
            });

            wrapper.appendChild(topRow);
            wrapper.appendChild(textarea);
            parametersContainer.appendChild(wrapper);
        });

        updateAssembled();
    }

    function updateAssembled() {
        if (!selectedPrompt) {
            assembledOutput.textContent = "";
            return;
        }
        const output = replacePlaceholders(selectedPrompt.base_prompt, parameterValues);
        assembledOutput.textContent = output;
    }

    // Copy
    async function copyToClipboard() {
        try {
            await navigator.clipboard.writeText(assembledOutput.textContent || "");
        } catch (err) {
            console.error(err);
            alert("Copy failed. Your browser may not allow clipboard access.");
        }
    }

    // Modal Helpers
    function clearModal() {
        if (!promptModal) return;
        promptIdEl.value = "";
        promptTitleEl.value = "";
        promptDescriptionEl.value = "";
        promptBaseEl.value = "";
        paramFields.innerHTML = "";
    }

    function fillModal(prompt) {
        if (!promptModal) return;
        promptIdEl.value = prompt.id || "";
        promptTitleEl.value = sanitize(prompt.title);
        promptDescriptionEl.value = sanitize(prompt.description);
        promptBaseEl.value = sanitize(prompt.base_prompt);
        paramFields.innerHTML = "";
        const parameters = Array.isArray(prompt.parameters) ? prompt.parameters : [];
        parameters.forEach(name => addParamField(name));
    }

    function addParamField(defaultName = "") {
        const row = document.createElement("div");
        row.className = "input-group mb-2";

        const input = document.createElement("input");
        input.type = "text";
        input.className = "form-control";
        input.placeholder = "parameter_name";
        input.value = defaultName;

        const btnWrap = document.createElement("button");
        btnWrap.type = "button";
        btnWrap.className = "btn btn-outline-danger";
        btnWrap.textContent = "Remove";
        btnWrap.addEventListener("click", () => row.remove());

        row.appendChild(input);
        row.appendChild(btnWrap);
        paramFields.appendChild(row);
    }

    function readParametersFromModal() {
        const names = [];
        paramFields.querySelectorAll("input[type='text']").forEach(inp => {
            const name = sanitize(inp.value).trim();
            if (name && !names.includes(name)) names.push(name);
        });
        return names;
    }

    // CRUD
    async function savePrompt() {
        const body = {
            title: sanitize(promptTitleEl.value).trim(),
            description: sanitize(promptDescriptionEl.value).trim(),
            base_prompt: sanitize(promptBaseEl.value),
            parameters: readParametersFromModal()
        };

        const id = sanitize(promptIdEl.value).trim();
        if (id) body.id = id;

        try {
            const res = await fetch(`${apiBase}/`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body)
            });
            if (!res.ok) throw new Error(`Save failed: ${res.status}`);
            const data = await res.json();
            await loadPrompts();
            if (data && data.prompt) {
                // attempt to reselect
                const updated = prompts.find(p => p.id === data.prompt.id);
                if (updated) selectPrompt(updated);
            }
            if (promptModal) promptModal.hide();
        } catch (err) {
            console.error(err);
            alert("Failed to save prompt.");
        }
    }

    async function deleteSelectedPrompt() {
        if (!selectedPrompt) return;
        if (!confirm(`Delete prompt "${selectedPrompt.title}"?`)) return;
        try {
            const res = await fetch(`${apiBase}/${encodeURIComponent(selectedPrompt.id)}`, { method: "DELETE" });
            if (!res.ok) throw new Error(`Delete failed: ${res.status}`);
            await loadPrompts();
            clearDetail();
        } catch (err) {
            console.error(err);
            alert("Failed to delete prompt.");
        }
    }

    // Event bindings
    if (searchInput) {
        searchInput.addEventListener("input", () => renderList());
    }

    if (copyBtn) {
        copyBtn.addEventListener("click", copyToClipboard);
    }

    if (addPromptBtn && promptModal) {
        addPromptBtn.addEventListener("click", () => {
            promptModalTitle.textContent = "Add Prompt";
            clearModal();
            addParamField();
            promptModal.show();
        });
    }

    if (editPromptBtn && promptModal) {
        editPromptBtn.addEventListener("click", () => {
            if (!selectedPrompt) return;
            promptModalTitle.textContent = "Edit Prompt";
            clearModal();
            fillModal(selectedPrompt);
            promptModal.show();
        });
    }

    if (deletePromptBtn) {
        deletePromptBtn.addEventListener("click", deleteSelectedPrompt);
    }

    if (addParamFieldBtn) {
        addParamFieldBtn.addEventListener("click", () => addParamField());
    }

    if (savePromptBtn) {
        savePromptBtn.addEventListener("click", savePrompt);
    }

    // Init
    loadPrompts();
})();