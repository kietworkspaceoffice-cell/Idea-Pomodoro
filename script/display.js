const countdownEl = document.getElementById("count-down");
const sessionTitle = document.getElementById("session-name");

export function updateDisplay(timeLeft, isWorksession) {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    countdownEl.innerHTML = `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
    if (isWorksession) {
        sessionTitle.innerHTML = "Work";
    } else {
        sessionTitle.innerHTML = "Break";
    }
};