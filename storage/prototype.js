
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
let workDuration = 25 * 60; // 25 phút mặc định (đơn vị: giây)
let breakDuration = 5 * 60;
let timeLeft = workDuration;
let isWorksession = true;
let sessionsCount = 0;
let totalSessions = 4; 


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
  localStorage.setItem("pomodoroState", JSON.stringify(state));
}

// --- Tải trạng thái từ Local Storage ---
function loadState() {
  const saved = localStorage.getItem("pomodoroState");
  if (saved) {
    const state = JSON.parse(saved);
    timeLeft = state.timeLeft;
    isRunning = false; // luôn dừng khi reload
    isWorksession = state.isWorksession;
    sessionsCount = state.sessionsCount;
    totalSessions = state.totalSessions;
    workDuration = state.workDuration;
    breakDuration = state.breakDuration;

    // cập nhật select cho khớp
    document.getElementById("work-select").value = workDuration / 60;
    document.getElementById("break-select").value = breakDuration / 60;
    document.getElementById("cycle-select").value = totalSessions;
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
  countdownEl.innerHTML = formatTime(timeLeft);
}

function getSettings() {
  const workValue = parseInt(document.getElementById("work-select").value);
  const breakValue = parseInt(document.getElementById("break-select").value);
  const cycleValue = parseInt(document.getElementById("cycle-select").value);

  

  workDuration = workValue * 60;
  breakDuration = breakValue * 60;
  totalSessions = cycleValue;

  timeLeft = workDuration; // reset về thời gian mới
  updateDisplay();
}

// --- Bắt đầu đếm ---
function startTimer() {
  // Lấy phần tử thông báo
  const toastBody = document.querySelector(".toast-body");

  // Khai báo function showToast
  function showTimeToast(duration = 5000) {
    const toastE1 = document.getElementById("toast");
    const progressBar = document.querySelector(".progress-bar");
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

  };
  // End function showToast
  if (isRunning) document.getElementById("start-sound").play();
  if (isRunning) return;
  
  
  updateDisplay();

  if (timeLeft === 0 || timeLeft === workDuration || timeLeft === breakDuration) {
    getSettings();

  }
  
  isRunning = true;
  const bgMusic = document.getElementById("bg-music");
  const workMusic = document.getElementById("work-music");
  bgMusic.volumn = 0.5;
  bgMusic.play();

  if (isWorksession) {
    workMusic.volumn = 0.7;
    workMusic.play();
  }
// Hàm chạy đồng hồ (lặp bằng interval)
  timer = setInterval(() => {
    timeLeft--;
    updateDisplay();
    saveState();

    if (timeLeft <= 5 && timeLeft >= 0) {
      if(isWorksession) {
        setInterval(() =>{
          toastBody.innerHTML = timeLeft + "s to Break!";
        }, 1000);
      } else {
        setInterval(() =>{
          toastBody.innerHTML = timeLeft + "s to Work!";
        }, 1000);
      }
      showTimeToast();
    };


    if (timeLeft <= 0) {
      clearInterval(timer);
      isRunning = false;
      
      if (isWorksession) {
        document.getElementById("session-name").innerHTML = "Work";
        sessionsCount++;
        if (sessionsCount >= totalSessions) {
          bgMusic.pause();
          bgMusic.currentTime = 0;
          workMusic.pause();
          workMusic.currentTime = 0;
          toastBody.innerHTML = "Congrats, You are finished a cycle Pomodoro. Good job!";
          showTimeToast();
          saveState();
          return;
        } else {
          isWorksession = false;
          timeLeft = breakDuration;
          document.getElementById("session-name").innerHTML = "Break";
          document.getElementById("end-sound").play();
          workMusic.pause();
          toastBody.innerHTML = "You just finished " + sessionsCount + " sessions, there are " + calc(4-sessionsCount) + " sessions more!";
          showTimeToast();
        }
      } else {
        isWorksession = true;
        timeLeft = workDuration;
        document.getElementById("session-name").innerHTML = "Work";
        document.getElementById("start-sound").play();

        workMusic.play();


      }
      saveState();
      startTimer();
    }
  }, 1000);
}

// --- Tạm dừng ---
function pauseTimer() {
  clearInterval(timer);
  isRunning = false;
  const bgMusic = document.getElementById("bg-music");
  const workMusic = document.getElementById("work-music");
  bgMusic.pause();
  workMusic.pause();
  saveState();
}

function resetTimer() {
  clearInterval(timer);
  isRunning = false;
  isWorkSession = true;
  sessionCount = 0;

  // ✅ Đặt lại tất cả select về giá trị mặc định
  document.getElementById("work-select").value = "25";
  document.getElementById("break-select").value = "5";
  document.getElementById("cycle-select").value = "4";

  // ✅ Cập nhật lại giá trị trong chương trình
  workDuration = 25* 60;
  breakDuration = 5 * 60;
  totalSessions = 4;

  const bgMusic = document.getElementById("bg-music");
  const workMusic = document.getElementById("work-music");
  bgMusic.pause();
  bgMusic.currentTime = 0;
  workMusic.pause();
  workMusic.currentTime = 0;
  // ✅ Reset lại hiển thị đồng hồ
  timeLeft = workDuration;
  updateDisplay();
  localStorage.removeItem("pomodoroState");
}

// --- Gắn sự kiện ---

controlBtn.addEventListener('click', () => {
  playBtn.classList.toggle("active");
  pauseBtn.classList.toggle("active");

  if (playBtn.classList.contains("active")) {
    pauseTimer();
  } else {
    startTimer();
    const bellStart = document.getElementById("start-sound");
    bellStart.volumn = 0.3;
    bellStart.play();
  }
});

// startBtn.addEventListener("click", startTimer);
// pauseBtn.addEventListener("click", pauseTimer);

// --- Khởi tạo ban đầu ---
updateDisplay();

applySetting.addEventListener('click', () => {
  getSettings();
  const workMusic = document.getElementById("work-music");
  const bgMusic = document.getElementById("bg-music");
  workMusic.currentTime = 0;
  bgMusic.currentTime = 0;
  saveState();
});
resetClock.addEventListener('click', () => {
  resetTimer()
  if (pauseBtn.classList.contains("active")) {
    pauseBtn.classList.toggle("active");
    playBtn.classList.toggle("active");

    const bgMusic = document.getElementById("bg-music");
    const workMusic = document.getElementById("work-music");
    bgMusic.pause();
    workMusic.pause();
    bgMusic.currentTime = 0;
    workMusic.currentTime = 0;
  }
});

loadState();
updateDisplay();

// Toast
// function showTimeToast(duration = 5000) {
//   const toastE1 = document.getElementById("toast");
//   const progressBar = document.querySelector(".progress-bar");
//   const toast = new bootstrap.Toast(toastE1);
  
//   toast.show();
  
//   const startTime = Date.now();
  
//   const interval = setInterval(() => {
//     const elapsed = Date.now() - startTime;
//     const percent = Math.min((elapsed / duration) * 100, 100);
//     progressBar.style.width = `${100 - percent}%`;

//     if (elapsed >= duration) {
//       clearInterval(interval);
//       toast.hide();
//     }
//   }, 50);

// };
// showTimeToast();



