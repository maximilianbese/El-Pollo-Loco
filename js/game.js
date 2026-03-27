let canvas;
let world;
let keyboard = new Keyboard();
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

function toggleControls() {
  const panel = document.getElementById("controls-panel");
  if (panel) panel.classList.toggle("d-none");
}

function startGame() {
  document.getElementById("start-screen").style.display = "none";
  document.getElementById("game-wrapper").style.display = "flex";
  canvas = document.getElementById("canvas");

  // Nutzt deine neue Funktion aus level1.js
  if (typeof createLevel1 === "function") createLevel1();

  world = new World(canvas, keyboard);
}

function restartGame() {
  // Beide End-Screens verstecken
  document.getElementById("game-over-screen").classList.add("d-none");
  document.getElementById("win-screen").classList.add("d-none");

  // Alle laufenden Intervalle stoppen
  clearAllIntervals();

  // 1. Level-Objekte (Gegner, Items) neu erstellen
  if (typeof createLevel1 === "function") createLevel1();

  // 2. Neue Welt-Instanz erstellen (setzt Pepe, Bars etc. zurück)
  world = new World(canvas, keyboard);

  // 3. Kamera manuell auf Startposition setzen
  world.camera_x = 0;
}

function showGameOver() {
  document.getElementById("game-over-screen").classList.remove("d-none");
  clearAllIntervals();
}

function showWin() {
  document.getElementById("win-screen").classList.remove("d-none");
  clearAllIntervals();
}

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
