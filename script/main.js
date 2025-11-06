import { updateDisplay } from "./display.js";
import { startTimer, pauseTimer, getSettings, resetSettings } from "./timer.js";
import { showConfirm } from "./getInput.js";
import { replayVideo, pauseVideo } from "./music.js";


let workDuration = 20;
let breakDuration = 10;
let isWorksession = true;
const controlBtn = document.querySelector(".time-control");
const playBtn = document.querySelector(".play-btn");
const pauseBtn = document.querySelector(".pause-btn");
const applySetting = document.getElementById("apply-setting");
const resetClock = document.getElementById("reset-clock");

getSettings();

applySetting.addEventListener('click', async () => {
    const isconfirm = await showConfirm("Are you sure to apply this setting? This will reset the clock");
    if(!isconfirm) return;

    if (!playBtn.classList.contains("active")) {
        playBtn.classList.toggle("active");
        pauseBtn.classList.toggle("active");
        pauseTimer();
        getSettings();
        replayVideo("videoA");
        replayVideo("videoB");
        pauseVideo("videoA");
        pauseVideo("videoB");
    } else {
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



