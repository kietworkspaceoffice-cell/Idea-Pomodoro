// main.js
import { startTimer, pauseTimer, resetTimer, updateDisplay } from './timer.js';
import { loadState } from './storage.js';

document.addEventListener("DOMContentLoaded", () => {
  const controlBtn = document.querySelector(".time-control");
  const playIcon = document.querySelector(".play-btn");
  const pauseIcon = document.querySelector(".pause-btn");
  const resetBtn = document.getElementById("reset-clock");

  const { timeLeft } = loadState();
  if (timeLeft) updateDisplay();

  controlBtn.addEventListener("click", () => {
      if (playIcon.classList.contains("active")) {
        startTimer(25 * 60, 5 * 60); // Default durations
        playIcon.classList.toggle("active");
        pauseIcon.classList.toggle("active");
      }  else {
        pauseTimer();
        playIcon.classList.toggle("active");
        pauseIcon.classList.toggle("active");
      }
  });
  resetBtn.addEventListener("click", () => resetTimer(25*60, 5*60));
});
