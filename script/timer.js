


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

import { updateDisplay } from './display.js'; 
updateDisplay(workDuration);


export function startTimer() {
  if (isRunning) {return;};
  
  if (timeRemain) {
    timeEnd = Date.now() + timeRemain*1000
  } else {
    const duration = isWorksession?workDuration:breakDuration;
    timeEnd = Date.now() + duration*1000;
  };  

  timer = setInterval(() => {
    
    isRunning = true;
    const now = Date.now();
    timeLeft = Math.max(0, Math.round((timeEnd - now)/1000));
    updateDisplay(timeLeft);
    if (timeLeft <=0) {
      clearInterval(timer);
      isRunning = false;
      timeRemain = false;
      if (isWorksession) {
        sessionsCount++;
        if (sessionsCount >= 4) {
          return;
        } else {
          isWorksession = false;
          setTimeout(() => {
            startTimer();
          }, 500);
        }
      } else {
        isWorksession = true;
          setTimeout(() => {
            startTimer();
          }, 500);
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