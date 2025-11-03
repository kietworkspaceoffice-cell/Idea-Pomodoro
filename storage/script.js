// ...existing code...
// --- DOM elements ---
const countdownEl = document.getElementById("count-down");
const controlBtn = document.querySelector(".time-control");
const playBtn = document.querySelector(".play-btn");
const pauseBtn = document.querySelector(".pause-btn");

const applySetting = document.getElementById("apply-setting");
const resetClock = document.getElementById("reset-clock");

// --- Biến trạng thái ---
let timer = null;
let isRunning = false;
let workDuration = 10; // 10 phút mặc định (đơn vị: giây)
let breakDuration = 10; // 10 phút mặc định (đơn vị: giây)
let timeLeft = workDuration;
let isWorksession = true;
let sessionsCount = 0;
let totalSessions = 4; 

// Toast helper state
let toastUpdateInterval = null;

// --- Lưu trạng thái vào Local Storage ---
function saveState() {
  const state = {
    timeLeft,
    isRunning,
    isWorksession,
    sessionsCount,
    totalSessions,
    workDuration,
    breakDuration,
  };
  try {
    localStorage.setItem("pomodoroState", JSON.stringify(state));
  } catch (e) {
    console.warn("Failed to save state:", e);
  }
}

// --- Tải trạng thái từ Local Storage ---
function loadState() {
  const saved = localStorage.getItem("pomodoroState");
  if (saved) {
    try {
      const state = JSON.parse(saved);
      timeLeft = typeof state.timeLeft === "number" ? state.timeLeft : workDuration;
      isRunning = false; // luôn dừng khi reload
      isWorksession = typeof state.isWorksession === "boolean" ? state.isWorksession : true;
      sessionsCount = typeof state.sessionsCount === "number" ? state.sessionsCount : 0;
      totalSessions = typeof state.totalSessions === "number" ? state.totalSessions : 4;
      workDuration = typeof state.workDuration === "number" ? state.workDuration : workDuration;
      breakDuration = typeof state.breakDuration === "number" ? state.breakDuration : breakDuration;

      // cập nhật select cho khớp (guard elements exist)
      const workSel = document.getElementById("work-select");
      const breakSel = document.getElementById("break-select");
      const cycleSel = document.getElementById("cycle-select");
      if (workSel) workSel.value = Math.floor(workDuration / 60);
      if (breakSel) breakSel.value = Math.floor(breakDuration / 60);
      if (cycleSel) cycleSel.value = totalSessions;
    } catch (e) {
      console.warn("Invalid saved state:", e);
    }
  }
}

// --- Hàm format thời gian ---
function formatTime(seconds) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
}

// --- Cập nhật hiển thị ---
function updateDisplay() {
  if (countdownEl) countdownEl.innerHTML = formatTime(timeLeft);
}

// --- Toast UI ---
function showTimeToast(duration = 5000) {
  const toastE1 = document.getElementById("toast");
  const progressBar = document.querySelector(".progress-bar");
  if (!toastE1 || !progressBar || !window.bootstrap) return;

  const toast = new bootstrap.Toast(toastE1);
  toast.show();

  const startTime = Date.now();

  const interval = setInterval(() => {
    const elapsed = Date.now() - startTime;
    const percent = Math.min((elapsed / duration) * 100, 100);
    progressBar.style.width = `${100 - percent}%`;

    if (elapsed >= duration) {
      clearInterval(interval);
      toast.hide();
    }
  }, 50);
}

// --- Lấy setting từ form ---
function getSettings() {
  const workValue = parseInt(document.getElementById("work-select").value) || (workDuration / 60);
  const breakValue = parseInt(document.getElementById("break-select").value) || (breakDuration / 60);
  const cycleValue = parseInt(document.getElementById("cycle-select").value) || totalSessions;

  workDuration = workValue * 60;
  breakDuration = breakValue * 60;
  totalSessions = cycleValue;

  // If not running, update the visible time to the currently active session duration
  timeLeft = isWorksession ? workDuration : breakDuration;
  updateDisplay();
}

// --- Bắt đầu đếm ---
function startTimer() {
  if (isRunning) return;

  // Ensure we use global durations and appropriate starting time
  if (timeLeft <= 0) {
    timeLeft = isWorksession ? workDuration : breakDuration;
  }

  isRunning = true;

  const bgMusic = document.getElementById("bg-music");
  const workMusic = document.getElementById("work-music");
  if (bgMusic) {
    bgMusic.volume = 0.5;
    bgMusic.play().catch(() => {});
  }
  if (isWorksession && workMusic) {
    workMusic.volume = 0.7;
    workMusic.play().catch(() => {});
  }

  // Clear any existing toast update interval
  if (toastUpdateInterval) {
    clearInterval(toastUpdateInterval);
    toastUpdateInterval = null;
  }

  timer = setInterval(() => {
    timeLeft--;
    updateDisplay();
    saveState();

    const toastBody = document.querySelector(".toast-body");

    // show warning toast in the last 5 seconds (one-time per second update)
    if (timeLeft <= 5 && timeLeft >= 0) {
      if (toastBody) {
        toastBody.innerHTML = isWorksession ? `${timeLeft}s to Break!` : `${timeLeft}s to Work!`;
      }
      showTimeToast(); // short toast for the second
    }

    if (timeLeft <= 0) {
      clearInterval(timer);
      timer = null;
      isRunning = false;

      const startSound = document.getElementById("start-sound");
      const endSound = document.getElementById("end-sound");
      const bgMusic = document.getElementById("bg-music");
      const workMusic = document.getElementById("work-music");
      const toastBody = document.querySelector(".toast-body");

      if (isWorksession) {
        // finished a work session
        sessionsCount++;
        if (sessionsCount >= totalSessions) {
          // finished all cycles
          if (bgMusic) { bgMusic.pause(); bgMusic.currentTime = 0; }
          if (workMusic) { workMusic.pause(); workMusic.currentTime = 0; }
          if (toastBody) toastBody.innerHTML = "Congrats, you finished a Pomodoro cycle. Good job!";
          showTimeToast();
          saveState();
          return;
        } else {
          // switch to break
          isWorksession = false;
          timeLeft = breakDuration;
          const sessionName = document.getElementById("session-name");
          if (sessionName) sessionName.innerHTML = "Break";
          if (endSound) endSound.play().catch(() => {});
          if (workMusic) workMusic.pause();
          if (toastBody) toastBody.innerHTML = `You finished ${sessionsCount} session(s), ${totalSessions - sessionsCount} remaining.`;
          showTimeToast();
        }
      } else {
        // finished a break -> switch to work
        isWorksession = true;
        timeLeft = workDuration;
        const sessionName = document.getElementById("session-name");
        if (sessionName) sessionName.innerHTML = "Work";
        if (startSound) startSound.play().catch(() => {});
        if (workMusic) workMusic.play().catch(() => {});
      }

      saveState();
      // Start next session automatically
      startTimer();
    }
  }, 1000);
}

// --- Tạm dừng ---
function pauseTimer() {
  if (timer) {
    clearInterval(timer);
    timer = null;
  }
  isRunning = false;
  const bgMusic = document.getElementById("bg-music");
  const workMusic = document.getElementById("work-music");
  if (bgMusic) bgMusic.pause();
  if (workMusic) workMusic.pause();
  saveState();
}

function resetTimer() {
  if (timer) {
    clearInterval(timer);
    timer = null;
  }
  isRunning = false;
  isWorksession = true;
  sessionsCount = 0;

  // Reset selects to defaults (guard elements)
  const workSel = document.getElementById("work-select");
  const breakSel = document.getElementById("break-select");
  const cycleSel = document.getElementById("cycle-select");
  if (workSel) workSel.value = "0";
  if (breakSel) breakSel.value = "0";
  if (cycleSel) cycleSel.value = "4";

  workDuration = 0;
  breakDuration = 0;
  totalSessions = 4;

  const bgMusic = document.getElementById("bg-music");
  const workMusic = document.getElementById("work-music");
  if (bgMusic) { bgMusic.pause(); bgMusic.currentTime = 0; }
  if (workMusic) { workMusic.pause(); workMusic.currentTime = 0; }

  timeLeft = workDuration;
  updateDisplay();
  try {
    localStorage.removeItem("pomodoroState");
  } catch (e) {}
}

// --- Gắn sự kiện ---
controlBtn.addEventListener('click', () => {
  // Toggle start / pause behavior
  if (isRunning) {
    pauseTimer();
    // toggle UI classes so play becomes active
    playBtn.classList.add("active");
    pauseBtn.classList.remove("active");
  } else {
    startTimer();
    // toggle UI classes so pause becomes active
    playBtn.classList.remove("active");
    pauseBtn.classList.add("active");
    const bellStart = document.getElementById("start-sound");
    if (bellStart) {
      bellStart.volume = 0.3;
      bellStart.play().catch(() => {});
    }
  }
});

// --- Khởi tạo ban đầu ---
loadState();
updateDisplay();

applySetting.addEventListener('click', () => {
  getSettings();
  const workMusic = document.getElementById("work-music");
  const bgMusic = document.getElementById("bg-music");
  if (workMusic) workMusic.currentTime = 0;
  if (bgMusic) bgMusic.currentTime = 0;
  saveState();
});
resetClock.addEventListener('click', () => {
  resetTimer();
  // reset UI play/pause state
  if (pauseBtn.classList.contains("active")) {
    pauseBtn.classList.remove("active");
    playBtn.classList.add("active");
  }
});
// ...existing code...