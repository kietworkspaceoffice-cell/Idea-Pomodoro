import { showToast } from './toast.js';


let isRunning = false; 
let workDuration = 20;
let breakDuration = 10;
let totalSessions = 4;
let sessionsCount = 0;
let timeLeft;
let timePause;
let timeEnd
let timeRemain = false;
let isWorksession = true;
let timer;
let hasShowToast = false;

import { updateDisplay } from './display.js'; 
updateDisplay(workDuration, isWorksession);


export function startTimer() {
  if (isRunning) {return;};

  hasShowToast = false;
  
  if (timeRemain) {
    timeEnd = Date.now() + timeRemain*1000
    hasShowToast = true;
  } else {
    const duration = isWorksession?workDuration:breakDuration;
    timeEnd = Date.now() + duration*1000;
  };  

  timer = setInterval(() => {
    
    isRunning = true;
    const now = Date.now();
    timeLeft = Math.max(0, Math.round((timeEnd - now)/1000));
    updateDisplay(timeLeft, isWorksession);

    if (timeLeft <= timeEnd && !hasShowToast) {
      if (isWorksession) {
        showToast("You just start a work session, there are: " + sessionsCount + " session(s) more");
      } else {
        showToast("Time to break");
      }

      hasShowToast = true;
    };

    if (timeLeft <=0) {
      clearInterval(timer);
      isRunning = false;
      timeRemain = false;
      if (isWorksession) {
        sessionsCount++;
        if (sessionsCount >= 4) {
          showToast("You have done a cycle pomodoro, Congrats!");
          return;
        } else {
          isWorksession = false;
          setTimeout(() => {
            startTimer();
          }, 800);
        }
      } else {
        isWorksession = true;
          setTimeout(() => {
            startTimer();
          }, 800);
      }
    }
  }, 50);
// Khi tạm dừng
// clearInterval(timer);
// timePause = timeLeft;

// KHi resume

// timeEnd = Date.now() + timePause*1000;
// startInterval();
 console.log(timeRemain);
 console.log(timeLeft);
}
export function pauseTimer() {
  clearInterval(timer);
  timeRemain = timeLeft;
  isRunning = false;
  console.log(timeRemain);
}