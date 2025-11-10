import { showToast } from './toast.js';
import { playBell, playVideo, pauseVideo, replayVideo, setVolume, fadeVolume } from './music.js';


let isRunning = false; 
let workDuration = 20;
let breakDuration = 10;
let totalSessions = 4;
let sessionsCount = 0;
let timeLeft;
let timeEnd;
let timeRemain = false;
let isWorksession = true;
let timer;
let hasShowToast = false;

import { updateDisplay } from './display.js'; 
updateDisplay(workDuration, isWorksession);


export function getSettings() {
  workDuration = parseInt(document.getElementById("work-select").value)*60;
  breakDuration = parseInt(document.getElementById("break-select").value)*60;
  totalSessions = parseInt(document.getElementById("cycle-select").value);

  updateDisplay(workDuration, true);
  isRunning = false;
  isWorksession = true;
  timeRemain = false;
}


export function resetSettings() {
  document.getElementById("work-select").value = 25;
  document.getElementById("break-select").value = 5;
  document.getElementById("cycle-select").value = 4;

  getSettings();
}

export async function startTimer() {
  if (isRunning) {return;};
 
  setVolume("videoB", 50);
  playVideo("videoB");
  // fadeVolume("videoB", 50, 3000);

  if (isWorksession) {
    // Work phase: bật videoA (chính)
    setVolume("videoA", 70);
    playVideo("videoA");
    fadeVolume("videoA", 70, 2000);
  } else {
    // Break phase: tắt videoA, để lại nền B
    await fadeVolume("videoA", 0, 1500);
    pauseVideo("videoA");
  }

  hasShowToast = false;
  
  if (timeRemain) {
    timeEnd = Date.now() + timeRemain*1000
    hasShowToast = true;
  } else {
    const duration = isWorksession?workDuration:breakDuration;
    timeEnd = Date.now() + duration*1000;
  };  

  timer = setInterval( async () => {
    
    isRunning = true;
    const now = Date.now();
    timeLeft = Math.max(0, Math.round((timeEnd - now)/1000));
    updateDisplay(timeLeft, isWorksession);

    if (timeLeft <= timeEnd && !hasShowToast) {
      showToast(isWorksession?"You just start a work session, there are: " + (totalSessions - sessionsCount) + " session(s) more":"Time to break");
      
      hasShowToast = true;
    };

    if (timeLeft <=0) {
      clearInterval(timer);
      isRunning = false;
      timeRemain = false;
      if (isWorksession) {
        await fadeVolume("videoA", 0, 800);
        pauseVideo("videoA");
        playBell(!isWorksession);
        sessionsCount++;

        if (sessionsCount >= totalSessions) {
          showToast("You have done a cycle pomodoro, Congrats!");
          pauseVideo("videoB");
          return;
        // } else {
        //   isWorksession = false;
        //   setTimeout(() => {
        //     startTimer();
        //   }, 800);
        // }
      }
      //  else {
      //   playBell(!isWorksession);
      //   playVideo("videoA", 70);
      //   fadeVolume("videoA", 70, 2000);
      //   isWorksession = true;
      //     setTimeout(() => {
      //       startTimer();
      //     }, 800);
      // }
    };
    playBell(!isWorksession);
    isWorksession = !isWorksession;
    
    setTimeout(() => {
      startTimer();
    }, 300);
  };
}, 50);

 console.log(timeRemain);
 console.log(timeLeft);
}


export function pauseTimer() {
  clearInterval(timer);
  timeRemain = timeLeft;
  isRunning = false;
  console.log(timeRemain);
  pauseVideo("videoA");
  pauseVideo("videoB");
}

//Check xem có phải là trình duyệt mobile hay không


export function autoPause() {
  if (document.hidden && isRunning) {
    pauseTimer();
    showToast("The clock will automatically stop when you exit the browser.");
  }
};

