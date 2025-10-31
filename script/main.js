let timer;
let isRunning = false;
let isWorking = true;
let timeLeft;
let currentLoop = 0;

const timeDisplay = document.getElementById("time");
const sessionType = document.getElementById("session-type");
const bell = document.getElementById("bell");
const bgMusic = document.getElementById("bg-music");

const startBtn = document.getElementById("start-btn");
const pauseBtn = document.getElementById("pause-btn");
const resetBtn = document.getElementById("reset-btn");
const musicToggle = document.getElementById("music-toggle");

const workInput = document.getElementById("work-input");
const breakInput = document.getElementById("break-input");
const loopsInput = document.getElementById("loops-input");

function formatTime(seconds) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
}

function startTimer() {
  if (isRunning) return;
  isRunning = true;

  const workTime = parseInt(workInput.value) * 60;
  const breakTime = parseInt(breakInput.value) * 60;
  const totalLoops = parseInt(loopsInput.value);

  timeLeft = isWorking ? workTime : breakTime;
  sessionType.textContent = isWorking ? "Work" : "Break";

  timer = setInterval(() => {
    timeDisplay.textContent = formatTime(timeLeft);
    timeLeft--;

    if (timeLeft < 0) {
      clearInterval(timer);
      bell.play();

      if (isWorking) currentLoop++;
      if (currentLoop >= totalLoops && !isWorking) {
        alert("🎉 Pomodoro hoàn thành!");
        resetTimer();
        return;
      }

      isWorking = !isWorking;
      startTimer();
    }
  }, 1000);
}

function pauseTimer() {
  clearInterval(timer);
  isRunning = false;
}

function resetTimer() {
  clearInterval(timer);
  isRunning = false;
  isWorking = true;
  currentLoop = 0;
  timeLeft = parseInt(workInput.value) * 60;
  timeDisplay.textContent = formatTime(timeLeft);
  sessionType.textContent = "Work";
}

musicToggle.addEventListener("click", () => {
  if (bgMusic.paused) bgMusic.play();
  else bgMusic.pause();
});

startBtn.addEventListener("click", startTimer);
pauseBtn.addEventListener("click", pauseTimer);
resetBtn.addEventListener("click", resetTimer);

resetTimer(); // init
