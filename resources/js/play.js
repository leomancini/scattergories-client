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

    const input = document.createElement('input');
    input.classList.add('input');
    answerFieldWrapper.appendChild(input);

    return answerFieldWrapper;
}

async function renderAnswerSheet(gameData, answerSheetData, answerSheetId) {
    const answerSheets = document.querySelector('#sheets');

    const answerSheet = document.createElement('div');
    answerSheet.classList = 'answerSheet hidden';
    answerSheet.id = answerSheetId;

    // const letterPlaceholder = document.createElement('div');
    // letterPlaceholder.classList = 'letterPlaceholder';
    // answerSheet.appendChild(letterPlaceholder);

    const answerSheetIndex = parseInt(answerSheetId.replaceAll('sheet_', ''));

    const info = document.createElement('div');
    info.classList = 'info';
    info.innerHTML = `<label>${gameData.nano_id}</label><label class='index'>${answerSheetIndex}</label>`;
    answerSheet.appendChild(info);

    let promptIndex = 0;

    answerSheetData.prompts.map((prompt) => {
        promptIndex++;
        answerSheet.appendChild(renderAnswerField(promptIndex, prompt));
    });

    const doneButton = document.createElement('button');
    doneButton.classList = 'doneButton';
    doneButton.innerText = 'Lock Answers';
    doneButton.onclick = function () {
        const doneButton = this;
        const nextanswerSheetId = `sheet_${answerSheetIndex + 1}`;

        markAnswerSheetAsPlayed(gameData.nano_id, answerSheetIndex);

        answerSheet.classList.add('locked');
        doneButton.classList.add('hidden');

        setTimeout(function () {
            doneButton.innerText = 'Go to Next Level';
            doneButton.classList.remove('hidden');
        }, 300);

        doneButton.onclick = function () {
            answerSheet.classList.add('fadeOut');

            setTimeout(function () {
                window.scrollTo(0, 0);

                setTimeout(function () {
                    answerSheetsContainer.querySelector(`#${nextanswerSheetId}`).classList.remove('hidden');

                    setTimeout(function () {
                        answerSheet.classList.remove('fadeOut');
                        answerSheet.classList.add('hidden');
                    }, 100);
                }, 300);
            }, 300);
        };
    };
    answerSheet.appendChild(doneButton);

    answerSheets.appendChild(answerSheet);
}

async function getGameByNanoId(nanoId) {
    const request = await fetch(`${window.server}/getGameByNanoId?nano_id=${nanoId}`);
    const game = await request.json();

    return game;
}

async function renderAnswerSheets(gameNanoId) {
    window.server = await getServerAddress();

    try {
        const result = await getGameByNanoId(gameNanoId);

        for (const answerSheetId in result.game.answerSheets) {
            if (!result.game.answerSheets[answerSheetId].metadata.played) {
                renderAnswerSheet(result.game, result.game.answerSheets[answerSheetId], answerSheetId);
            }
        }

        introScreen.classList.add('hidden');

        setTimeout(function () {
            answerSheetsContainer.classList.remove('hidden');

            const answerSheets = answerSheetsContainer.querySelectorAll('.answerSheet');

            answerSheets[0].classList.remove('hidden');

            window.scrollTo(0, 0);
        }, 300);
    } catch {
        alert('Sorry, that game code is invalid!');
    }
}

async function markAnswerSheetAsPlayed(nanoId, answerSheetIndex) {
    const request = await fetch(`${window.server}/markAnswerSheetAsPlayed?game_nano_id=${nanoId}&answer_sheet_index=${answerSheetIndex}`);
    const result = await request.json();
}

const introScreen = document.querySelector('.playGame'),
    gameNanoIdInputField = introScreen.querySelector('input'),
    answerSheetsContainer = document.querySelector('#sheets');

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
            renderAnswerSheets(this.value.toUpperCase());
        }
    }
};

if (window.location.hash) {
    const hash = window.location.hash.replaceAll('#', '');

    if (hash.length === 4) {
        introScreen.classList.add('hidden');
        renderAnswerSheets(hash.toUpperCase());
    }
}