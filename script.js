(function () { // DON'T EDIT BELOW THIS LINE
    var d = document, s = d.createElement('script');
    s.src = 'https://invisibletimer.disqus.com/embed.js';
    s.setAttribute('data-timestamp', +new Date());
    (d.head || d.body).appendChild(s);
})();

const jazz = document.getElementById('jazz');
jazz.pause();
let isPlaying = false;

function toggleAudio() {
    if (isPlaying) {
        jazz.pause();
    } else {
        jazz.play();
    }

    isPlaying = !isPlaying;
}

jazz.addEventListener('ended', function () {
    jazz.currentTime = 0;
    if (isPlaying) {
        jazz.play();
    }
})

let timer;
let startTime;
let endTime;
function startTimer() {
    resetTimer()
    var minTime = +document.getElementById("minTime").value;
    var maxTime = +document.getElementById("maxTime").value;
    console.log(minTime);
    console.log(maxTime);
    console.log(typeof (maxTime));
    if (minTime === "" || isNaN(minTime) || maxTime === "" || isNaN(maxTime) || minTime > maxTime || (minTime == 0 && maxTime == 0)) {
        alert("Please enter valid time!");
        return;
    }
    const randomTime = getRandomTime(minTime, maxTime);
    startTime = new Date().getTime();
    endTime = startTime + randomTime;

    document.getElementById('timeSet').textContent = `Time Set: ${formatTime(randomTime)}`;
    // document.getElementById('timer-info').style.display = 'none'; // Hide initially

    document.getElementById('startBtn').style.backgroundColor = '#8BC34A'; // Change color to green

    document.getElementById('showBtn').disabled = false;
    document.getElementById('resetBtn').disabled = false;
    if (!isPlaying){
        jazz.play();
        isPlaying = true;
    }
    updateRealTime();
}

function showTime() {
    clearInterval(timer);
    document.getElementById('timer-info').style.visibility = 'visible'; // Show after clicking "Show" button
    updateElapsedTime(); // Update elapsed time immediately

    // Continue updating elapsed time in real-time
    timer = setInterval(updateElapsedTime, 1000);
}

function resetTimer() {
    clearInterval(timer);
    document.getElementById('timer-info').style.visibility = 'hidden';

    document.getElementById('startBtn').style.backgroundColor = ''; // Reset color

    document.getElementById('showBtn').disabled = true;
    document.getElementById('resetBtn').disabled = true;
}

function updateRealTime() {
    timer = setInterval(updateElapsedTime, 1000);
}

function updateElapsedTime() {
    const elapsedTime = getElapsedTime();
    document.getElementById('timePassed').textContent = `Time Passed: ${formatTime(elapsedTime)}`;

    if (elapsedTime >= endTime - startTime) {
        playAudio(); // Play audio when the timer is up
        // Stop updating elapsed time and audio playback
        clearInterval(timer);
    }
}

function getElapsedTime() {
    return Math.floor((new Date().getTime() - startTime) / 1000);
}

function playAudio() {
    const drum = document.getElementById('drum');
    drum.play();
}

function getRandomTime(min, max) {
    return Math.floor(60 * Math.random() * (max - min) + 60 * min);
}

function formatTime(totalSeconds) {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}min ${seconds}sec`;
}