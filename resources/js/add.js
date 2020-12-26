function renderPromptListItem(prompt) {
    const promptListItem = document.createElement('li');
    promptListItem.id = `id_${prompt.id}`;

    const label = document.createElement('label');
    label.innerText = capitalize(prompt.text);
    promptListItem.appendChild(label);

    const deleteButton = document.createElement('div');
    deleteButton.classList.add('delete');
    deleteButton.innerHTML = '&times;';
    deleteButton.onclick = function () {
        if (window.location.hostname === 'localhost' || confirm('Delete this game?') === true) {
            deletePrompt(this);
        }
    }
    promptListItem.appendChild(deleteButton);

    return promptListItem;
}

async function renderPromptsList() {
    window.server = await getServerAddress();

    const request = await fetch(`${window.server}/getAllPrompts`);
    const prompts = await request.json()

    promptsList.innerHTML = '';

    prompts.map((prompt) => {
        promptsList.appendChild(renderPromptListItem({ id: prompt._id, text: prompt.prompt }));
    });

    inputField.onkeyup = function (e) {
        if (this.value !== '' && e.key === 'Enter') {
            const promptText = this.value;
            const tempId = `temp_${Date.now()}`;
            promptsList.insertBefore(renderPromptListItem({ id: tempId, text: promptText }), promptsList.firstChild);

            inputField.value = '';

            addPrompt(`${window.server}/addPrompt`, { prompt: promptText })
                .then(response => {
                    if (response.success) {
                        document.querySelector(`#id_${tempId}`).id = `id_${response.id}`;
                    }
                });
        }
    };
}

async function addPrompt(url = '', data = {}) {
    const request = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });

    return request.json();
}

function deletePrompt(deleteButton) {
    const thisPromptListItem = deleteButton.closest('li');

    thisPromptListItem.remove();

    fetch(`${window.server}/deletePrompt?id=${thisPromptListItem.id.replace('id_', '')}`);
}

const inputField = document.querySelector('input#add'),
    promptsList = document.querySelector('ul#prompts');

window.onload = function () {
    inputField.focus();
};

renderPromptsList();