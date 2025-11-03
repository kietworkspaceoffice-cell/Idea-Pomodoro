// timer.js
import { saveState, loadState } from './storage.js';
import { showTimeToast } from './toast.js';

let timer = null;
let isRunning = false;
let timeLeft = 1500; // 25 phút
let isWorksession = true;

export function formatTime(seconds) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
}

export function updateDisplay() {
  const countdownEl = document.getElementById("count-down");
  if (countdownEl) countdownEl.textContent = formatTime(timeLeft);
}

export function startTimer(workDuration, breakDuration) {
  if (isRunning) return;
  isRunning = true;

  timer = setInterval(() => {
    timeLeft--;
    updateDisplay();
    saveState({ timeLeft, isRunning });

    if (timeLeft <= 5 && timeLeft >= 0) {
      showTimeToast(`⏰ ${timeLeft}s left!`);
    }

    if (timeLeft <= 0) {
      clearInterval(timer);
      isRunning = false;
      isWorksession = !isWorksession;
      timeLeft = isWorksession ? workDuration : breakDuration;
      showTimeToast(isWorksession ? "Work time!" : "Break time!");
      startTimer(workDuration, breakDuration);
    }
  }, 1000);
}

export function pauseTimer() {
  clearInterval(timer);
  isRunning = false;
  saveState({ timeLeft, isRunning });
}

export function resetTimer(defaultWork, defaultBreak) {
  clearInterval(timer);
  isRunning = false;
  isWorksession = true;
  timeLeft = defaultWork;
  updateDisplay();
  saveState({});
}
