let canvas;
let world;
let keyboard = new Keyboard();

/* ── Interval-Tracking ── */
let globalIntervals = [];
const _origSetInterval = window.setInterval;
window.setInterval = function (fn, delay) {
  const id = _origSetInterval(fn, delay);
  globalIntervals.push(id);
  return id;
};

function clearAllIntervals() {
  globalIntervals.forEach((id) => clearInterval(id));
  globalIntervals = [];
}

/* ── Menü-Logik ── */

function toggleControls() {
  const panel = document.getElementById("controls-panel");
  if (panel) panel.classList.toggle("d-none");
}

function startGame() {
  document.getElementById("start-screen").style.display = "none";
  document.getElementById("game-wrapper").style.display = "flex";
  canvas = document.getElementById("canvas");

  if (typeof initLevel === "function") initLevel();
  else if (typeof createLevel1 === "function") createLevel1();

  world = new World(canvas, keyboard);
  if (typeof initMobileControls === "function") initMobileControls();
}

function restartGame() {
  // Screens verstecken
  document.getElementById("game-over-screen").classList.add("d-none");
  document.getElementById("win-screen").classList.add("d-none");

  clearAllIntervals();

  if (typeof initLevel === "function") initLevel();
  else if (typeof createLevel1 === "function") createLevel1();

  world = new World(canvas, keyboard);
}

// Funktionen zum Anzeigen der Screens (werden von World.js aufgerufen)
function showGameOver() {
  document.getElementById("game-over-screen").classList.remove("d-none");
  clearAllIntervals();
}

function showWin() {
  document.getElementById("win-screen").classList.remove("d-none");
  clearAllIntervals();
}

/* ── Fullscreen & Keyboard ── */

function toggleFullscreen() {
  let element = document.getElementById("all-game-contents");
  if (!document.fullscreenElement) {
    element.requestFullscreen().catch((err) => console.error(err));
  } else {
    document.exitFullscreen();
  }
}

window.addEventListener("keydown", (e) => {
  if (e.keyCode === 32) e.preventDefault();
  setKeyState(e.keyCode, true);
  if (e.keyCode === 70) toggleFullscreen();
});

window.addEventListener("keyup", (e) => setKeyState(e.keyCode, false));

function setKeyState(keyCode, isPressed) {
  const keyMap = {
    39: "RIGHT",
    37: "LEFT",
    38: "UP",
    40: "DOWN",
    32: "SPACE",
    68: "D",
  };
  const key = keyMap[keyCode];
  if (key) keyboard[key] = isPressed;
}
