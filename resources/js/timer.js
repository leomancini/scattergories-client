// Based on https://tinloof.com/blog/how-to-build-a-stopwatch-with-html-css-js-react-part-2/

function timeToString(time) {
    let diffInHrs = time / 3600000;
    let hh = Math.floor(diffInHrs);

    let diffInMin = (diffInHrs - hh) * 60;
    let mm = Math.floor(diffInMin);

    let diffInSec = (diffInMin - mm) * 60;
    let ss = Math.floor(diffInSec);

    let diffInMs = (diffInSec - ss) * 100;
    let ms = Math.floor(diffInMs);

    let formattedMM = mm.toString().padStart(2, "0");
    let formattedSS = ss.toString().padStart(2, "0");
    let formattedMS = ms.toString().padStart(2, "0");

    let formattedTime = `${formattedMM}:${formattedSS}`;

    if (config.showMilliseconds) {
        formattedTime += `:${formattedMS}`;
    }

    return formattedTime;
}

let startTime;
let elapsedTime = 0;
let timerInterval;

function initalizeTimer() {
    let defaultFormattedTime = '00:00';

    if (config.showMilliseconds) {
        defaultFormattedTime += ':00';
    }

    timerContainer.innerText = defaultFormattedTime;
}

function startTimer() {
    startTime = Date.now() - elapsedTime;
    timerInterval = setInterval(function printTime() {
        elapsedTime = Date.now() - startTime;

        timerContainer.innerText = timeToString(elapsedTime);
        checkIfTimerReachesLimit(elapsedTime);
    }, 10);
}

function resetTimer() {
    clearInterval(timerInterval);
    elapsedTime = 0;

    let defaultFormattedTime = '00:00';

    if (config.showMilliseconds) {
        defaultFormattedTime += ':00';
    }

    timerContainer.innerText = defaultFormattedTime;
}

function stopTimer() {
    clearInterval(timerInterval);
}

function checkIfTimerReachesLimit(elapsedTime) {
    if (elapsedTime >= config.secondsPerLetter * 1000) {
        stopTimer();
        resetLetter();
    }
}