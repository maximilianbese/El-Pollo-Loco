/* ═══════════════════════════════════════════════════════
   GAME.JS  –  El Pollo Loco
   Spielstart, Restart, Fullscreen, Keyboard-Events
   ═══════════════════════════════════════════════════════ */

let canvas;
let world;
let keyboard = new Keyboard();

/* ── Interval-Tracking (für sauberen Restart) ─────────── */
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

/* ── Game Lifecycle ────────────────────────────────────── */
function startGame() {
  document.getElementById("start-screen").style.display = "none";

  const wrapper = document.getElementById("game-wrapper");
  wrapper.style.display = "flex";

  canvas = document.getElementById("canvas");
  world = new World(canvas, keyboard);

  // Mobile-Controls neu binden (keyboard ist jetzt gesetzt)
  if (typeof initMobileControls === "function") initMobileControls();
}

function restartGame() {
  document.getElementById("game-over-screen").style.display = "none";
  document.getElementById("win-screen").style.display = "none";

  clearAllIntervals();
  createLevel1();
  world = new World(canvas, keyboard);
}

function showGameOver() {
  if (world) world.gameOver = true;
  document.getElementById("game-over-screen").style.display = "flex";
}

function showWinScreen() {
  if (world) world.gameOver = true;
  document.getElementById("win-screen").style.display = "flex";
}

/* ── Fullscreen ────────────────────────────────────────── */
function toggleFullscreen() {
  const el = document.getElementById("game-container");

  if (!document.fullscreenElement && !document.webkitFullscreenElement) {
    const req =
      el.requestFullscreen ||
      el.webkitRequestFullscreen ||
      el.mozRequestFullScreen;
    if (req) req.call(el);
  } else {
    const exit =
      document.exitFullscreen ||
      document.webkitExitFullscreen ||
      document.mozCancelFullScreen;
    if (exit) exit.call(document);
  }
}

/* ── Keyboard Events ───────────────────────────────────── */
window.addEventListener("keydown", (e) => {
  switch (e.keyCode) {
    case 39:
      keyboard.RIGHT = true;
      break;
    case 37:
      keyboard.LEFT = true;
      break;
    case 38:
      keyboard.UP = true;
      break;
    case 40:
      keyboard.DOWN = true;
      break;
    case 32:
      keyboard.SPACE = true;
      e.preventDefault();
      break;
    case 68:
      keyboard.D = true;
      break;
    case 70:
      toggleFullscreen();
      break;
  }
});

window.addEventListener("keyup", (e) => {
  switch (e.keyCode) {
    case 39:
      keyboard.RIGHT = false;
      break;
    case 37:
      keyboard.LEFT = false;
      break;
    case 38:
      keyboard.UP = false;
      break;
    case 40:
      keyboard.DOWN = false;
      break;
    case 32:
      keyboard.SPACE = false;
      break;
    case 68:
      keyboard.D = false;
      break;
  }
});
