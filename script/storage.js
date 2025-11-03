// storage.js
const STORAGE_KEY = 'pomodoroState';

export function saveState(state) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (e) {
    console.warn("Save error:", e);
  }
}

export function loadState() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : {};
  } catch (e) {
    console.warn("Load error:", e);
    return {};
  }
}

export function clearState() {
  localStorage.removeItem(STORAGE_KEY);
}
