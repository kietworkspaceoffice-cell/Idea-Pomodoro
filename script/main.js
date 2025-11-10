import { updateDisplay } from "./display.js";
import { startTimer, pauseTimer, getSettings, resetSettings, autoPause } from "./timer.js";
import { showConfirm } from "./getInput.js";
import { replayVideo, pauseVideo, extractVideoId } from "./music.js";
import { showToast } from "./toast.js";


let workDuration = 20;
let breakDuration = 10;
let isWorksession = true;
const controlBtn = document.querySelector(".time-control");
const playBtn = document.querySelector(".play-btn");
const pauseBtn = document.querySelector(".pause-btn");
const applySetting = document.getElementById("apply-setting");
const resetClock = document.getElementById("reset-clock");
const input = document.getElementById('video-link');
const iframe = document.getElementById('videoA');

const isMobile = /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

getSettings();

applySetting.addEventListener('click', async () => {
    const isconfirm = await showConfirm("Are you sure to apply this setting? This will reset the clock");
    if(!isconfirm) return;

    if (!playBtn.classList.contains("active")) {
        playBtn.classList.toggle("active");
        pauseBtn.classList.toggle("active");
        // change video id
        const url = input.value.trim();
        const videoId = extractVideoId(url);

        if (videoId) {
            iframe.src = `https://www.youtube.com/embed/${videoId}?autoplay=1&loop=1`;
        } else if(videoId == null) {
            iframe.src = `https://www.youtube.com/embed/hj83cwfOF3Y?si=vHUrPOIiNQFjphHe&enablejsapi=1`;
        } else {
            alert('Link YouTube không hợp lệ!');
        }
        // 
        pauseTimer();
        getSettings();
        replayVideo("videoA");
        replayVideo("videoB");
        pauseVideo("videoA");
        pauseVideo("videoB");
    } else {

        const url = input.value.trim();
        const videoId = extractVideoId(url);

        if (videoId) {
            iframe.src = `https://www.youtube.com/embed/${videoId}?autoplay=1&loop=1`;
        } else if(videoId == null) {
            iframe.src = `https://www.youtube.com/embed/hj83cwfOF3Y?si=vHUrPOIiNQFjphHe&enablejsapi=1`;
        } else {
            alert('Link YouTube không hợp lệ!');
        }

        getSettings();
        replayVideo("videoA");
        replayVideo("videoB");
        pauseVideo("videoA");
        pauseVideo("videoB");
    }
    
    // getSettings();
    // startTimer();
})

resetClock.addEventListener('click', async () => {
    const isconfirm = await showConfirm("Are you sure to reset the clock?");
    if(!isconfirm) return;

    if (!playBtn.classList.contains("active")) {
        
        playBtn.classList.toggle("active");
        pauseBtn.classList.toggle("active");
    }

    iframe.src = `https://www.youtube.com/embed/hj83cwfOF3Y?si=vHUrPOIiNQFjphHe&enablejsapi=1`;
    input.value = null;
    pauseTimer();
    resetSettings();
    replayVideo("videoA");
    replayVideo("videoB");
    pauseVideo("videoA");
    pauseVideo("videoB");
})

controlBtn.addEventListener('click', () => {
    playBtn.classList.toggle("active");
    pauseBtn.classList.toggle("active");
    if (!playBtn.classList.contains("active")) {
        startTimer();
    } else {
        pauseTimer();
    };
})

document.addEventListener('visibilitychange', () => {
    if (isMobile) {
        autoPause();
        if (!playBtn.classList.contains('active')) {
            playBtn.classList.toggle("active");
            pauseBtn.classList.toggle("active");
        };
    };
});

