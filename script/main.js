import { updateDisplay } from "./display.js";
import { startTimer, pauseTimer } from "./timer.js";

let workDuration = 20;
let breakDuration = 10;
let isWorksession = true;
const controlBtn = document.querySelector(".time-control");
const playBtn = document.querySelector(".play-btn");
const pauseBtn = document.querySelector(".pause-btn");

updateDisplay(workDuration, isWorksession);

controlBtn.addEventListener('click', () => {
    playBtn.classList.toggle("active");
    pauseBtn.classList.toggle("active");
    if (!playBtn.classList.contains("active")) {
        startTimer();
    } else {
        pauseTimer();
    };
})

