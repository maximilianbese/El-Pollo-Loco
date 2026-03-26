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
function handleKeyDown(e) {
  if (e.keyCode === 32) e.preventDefault();
  setKeyState(e.keyCode, true);
  if (e.keyCode === 70) toggleFullscreen();
}

function handleKeyUp(e) {
  setKeyState(e.keyCode, false);
}

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

window.addEventListener("keydown", handleKeyDown);
window.addEventListener("keyup", handleKeyUp);
