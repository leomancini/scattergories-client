function renderGameListItem(game) {
    const gameListItem = document.createElement('li');
    gameListItem.id = `id_${game._id}`;

    const label = document.createElement('label');
    label.innerText = capitalize(game.nano_id);
    gameListItem.appendChild(label);

    const deleteButton = document.createElement('div');
    deleteButton.classList.add('delete');
    deleteButton.innerHTML = '&times;';
    deleteButton.onclick = function () {
        if (window.location.hostname === 'localhost' || confirm('Delete this game?') === true) {
            deleteGame(this);
        }
    }
    gameListItem.appendChild(deleteButton);

    const info = document.createElement('div');
    info.classList = 'info';
    gameListItem.appendChild(info);

    const playedLabel = document.createElement('label');
    if (game.metadata) {
        playedLabel.innerText = `Played ${game.metadata.numPlayedAnswerSheets} of ${game.metadata.numTotalAnswerSheets} sheets`;
    } else if (game.numTotalAnswerSheets) {
        playedLabel.innerText = `Played 0 of ${game.numTotalAnswerSheets} sheets`;
    }
    info.appendChild(playedLabel);

    const buttons = document.createElement('div');
    buttons.classList = 'buttons';
    gameListItem.appendChild(buttons);

    const playButton = document.createElement('button');
    playButton.innerText = 'Play';
    playButton.onclick = function () {
        window.open(`play#${game.nano_id}`, '_blank');
    }
    buttons.appendChild(playButton);

    const printButton = document.createElement('button');
    printButton.innerText = 'Print';
    printButton.onclick = function () {
        window.open(`print#${game.nano_id}`, '_blank');
    }
    buttons.appendChild(printButton);

    const hostButton = document.createElement('button');
    hostButton.innerText = 'Host';
    hostButton.onclick = function () {
        window.open(`host#${game.nano_id}`, '_blank');
    }
    buttons.appendChild(hostButton);

    return gameListItem;
}

async function renderGamesList() {
    window.server = await getServerAddress();

    const request = await fetch(`${window.server}/getAllGames`);
    const result = await request.json();

    gamesList.innerHTML = '';

    result.games.map((game) => {
        gamesList.appendChild(renderGameListItem(game));
    });
}

async function createGame() {
    const request = await fetch(`${window.server}/createGame`);
    const result = await request.json();

    if (result.success) {
        gamesList.insertBefore(renderGameListItem(result.created), gamesList.firstChild);
    }
}

function deleteGame(deleteButton) {
    const thisgameListItem = deleteButton.closest('li');

    thisgameListItem.remove();

    fetch(`${window.server}/deleteGame?id=${thisgameListItem.id.replace('id_', '')}`);
}

const gamesList = document.querySelector('ul#games'),
    createGameButton = document.querySelector('button#createGame');

createGameButton.onclick = createGame;

renderGamesList();