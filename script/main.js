// Đếm ngược 25 phút (1500 giây)
// function updateClock() {
//   const now = new Date();
//   const hours = now.getHours().toString().padStart(2, "0");
//   const minutes = now.getMinutes().toString().padStart(2, "0");
//   const seconds = now.getSeconds().toString().padStart(2, "0");

//   document.getElementById("clock").textContent = `${hours}:${minutes}:${seconds}`;
// }

// setInterval(updateClock, 10);
// updateClock(); // Gọi lần đầu để hiển thị ngay

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
  
  if (isRunning) document.getElementById("start-sound").play();
  if (isRunning) return;
  

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

  timer = setInterval(() => {
    timeLeft--;
    updateDisplay();

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

          return;
        } else {
          isWorksession = false;
          timeLeft = breakDuration;
          document.getElementById("session-name").innerHTML = "Break";
          document.getElementById("end-sound").play();
          workMusic.pause();
        }
      } else {
        isWorksession = true;
        timeLeft = workDuration;
        document.getElementById("session-name").innerHTML = "Work";
        document.getElementById("start-sound").play();

        workMusic.play();


      }
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
  workDuration = 25 * 60;
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


