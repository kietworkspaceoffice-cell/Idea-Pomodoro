// toast.js
export function showTimeToast(message, duration = 3000) {
  const toastEl = document.getElementById("timerToast");
  const progressEl = toastEl.querySelector(".progress-bar");
  const toastBody = toastEl.querySelector(".toast-body");

  if (!toastEl || !progressEl) return;

  toastBody.textContent = message;
  const toast = new bootstrap.Toast(toastEl);
  toast.show();

  let startTime = Date.now();
  const interval = setInterval(() => {
    const elapsed = Date.now() - startTime;
    const percent = Math.min((elapsed / duration) * 100, 100);
    progressEl.style.width = `${percent}%`;

    if (elapsed >= duration) {
      clearInterval(interval);
      toast.hide();
    }
  }, 50);
}
