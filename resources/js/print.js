function renderAnswerField(promptIndex, prompt) {
    const answerFieldWrapper = document.createElement('div');
    answerFieldWrapper.classList.add('answerFieldWrapper');

    if (promptIndex < 10) {
        answerFieldWrapper.classList.add('lessThan10');
    } else if (promptIndex >= 10) {
        answerFieldWrapper.classList.add('greaterOrEqualTo10');
    }

    const number = document.createElement('div');
    number.classList.add('number');
    number.innerText = promptIndex;
    answerFieldWrapper.appendChild(number);

    const label = document.createElement('label');
    const promptText = capitalize(prompt);
    label.innerText = promptText;
    if (promptText.length > 20) { label.classList.add('long'); }
    answerFieldWrapper.appendChild(label);

    const input = document.createElement('div');
    input.classList.add('input');
    answerFieldWrapper.appendChild(input);

    return answerFieldWrapper;
}

async function renderAnswerSheet(gameData, answerSheetData, answerSheetId) {
    const answerSheets = document.querySelector('#sheets');

    const answerSheet = document.createElement('div');
    answerSheet.classList.add('answerSheet');

    const letterPlaceholder = document.createElement('div');
    letterPlaceholder.classList = 'letterPlaceholder';
    answerSheet.appendChild(letterPlaceholder);

    const answerSheetIndex = parseInt(answerSheetId.replaceAll('sheet_', ''));

    const info = document.createElement('div');
    info.classList = 'info';
    info.innerHTML = `<label>${gameData.nano_id}</label><label class='index'>${answerSheetIndex}</label>`;
    answerSheet.appendChild(info);

    const answerSheetFirstColumn = document.createElement('div');
    answerSheetFirstColumn.classList.add('column');

    let promptIndex = 0;

    answerSheetData.prompts.slice(0, 6).map((prompt) => {
        promptIndex++;
        answerSheetFirstColumn.appendChild(renderAnswerField(promptIndex, prompt));
    });

    answerSheet.appendChild(answerSheetFirstColumn);

    const answerSheetSecondColumn = document.createElement('div');
    answerSheetSecondColumn.classList.add('column');

    answerSheetData.prompts.slice(6, 12).map((prompt) => {
        promptIndex++;
        answerSheetSecondColumn.appendChild(renderAnswerField(promptIndex, prompt));
    });

    answerSheet.appendChild(answerSheetSecondColumn);

    answerSheets.appendChild(answerSheet);
}

async function getGameByNanoId(nano_id) {
    window.server = await getServerAddress();

    const request = await fetch(`${window.server}/getGameByNanoId?nano_id=${nano_id}`);
    const game = await request.json();

    return game;
}

async function printAnswerSheets(gameNanoId) {
    try {
        const result = await getGameByNanoId(gameNanoId);

        for (const answerSheetId in result.game.answerSheets) {
            renderAnswerSheet(result.game, result.game.answerSheets[answerSheetId], answerSheetId);
        }

        window.print();
    } catch {
        alert('Sorry, that game code is invalid!');
    }
}

const gameNanoIdInputField = document.querySelector('.printGame input');

gameNanoIdInputField.onkeyup = function (e) {
    const keysToIgnore = [
        'Escape',
        'Shift',
        'Meta',
        'Control',
        'Alt'
    ];

    if (!keysToIgnore.includes(e.key)) {
        if (this.value.length === 4 || e.key === 'Enter') {
            this.blur();
            printAnswerSheets(this.value.toUpperCase());
        }
    }
};

if (window.location.hash) {
    const hash = window.location.hash.replaceAll('#', '');

    if (hash.length === 4) {
        printAnswerSheets(hash.toUpperCase());
    }
}