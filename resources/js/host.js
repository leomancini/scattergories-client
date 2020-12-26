const config = {
    secondsPerLetter: 120,
    showMilliseconds: true
}

const gameNanoIdContainer = document.querySelector('#gameNanoId'),
    letterContainer = document.querySelector('#letter'),
    timerContainer = document.querySelector('#timer'),
    startTimerButton = document.querySelector('#startTimerButton');

if (window.location.hash) {
    gameNanoIdContainer.innerText = window.location.hash.replace('#', '');
}

initalizeTimer();

startTimerButton.onclick = function () {
    const letters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z']
    const randomLetter = letters[Math.floor(Math.random() * letters.length)];

    letterContainer.classList.add('hidden');

    resetTimer();

    setTimeout(function () {
        letterContainer.innerText = randomLetter;

        setTimeout(function () {
            letterContainer.classList.remove('hidden');

            setTimeout(function () {
                startTimer();
            }, 200);
        }, 400);
    }, 400);

    this.classList.add('hidden');
}

function resetLetter() {
    startTimerButton.classList.remove('hidden');
}