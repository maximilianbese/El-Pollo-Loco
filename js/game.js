/* ═══════════════════════════════════════════════════════
   GAME.JS  –  El Pollo Loco
   ═══════════════════════════════════════════════════════ */

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
  if (panel) {
    panel.classList.toggle("d-none");
  }
}

function startGame() {
  // 1. Startbildschirm ausblenden
  document.getElementById("start-screen").style.display = "none";

  // 2. Game-Wrapper anzeigen
  const wrapper = document.getElementById("game-wrapper");
  wrapper.style.display = "flex";

  // 3. Canvas initialisieren
  canvas = document.getElementById("canvas");

  // 4. Level laden (Wichtig!)
  // Falls deine Funktion in level1.js 'initLevel' heißt, lass es so.
  // Falls sie 'createLevel1' heißt, ändere es hier kurz um:
  if (typeof initLevel === "function") {
    initLevel();
  } else if (typeof createLevel1 === "function") {
    createLevel1();
  }

  // 5. Welt erstellen (Das ersetzt das fehlende 'init()')
  world = new World(canvas, keyboard);

  // 6. Mobile Controls (optional)
  if (typeof initMobileControls === "function") initMobileControls();
}

function restartGame() {
  document.getElementById("game-over-screen").style.display = "none";
  document.getElementById("win-screen").style.display = "none";
  clearAllIntervals();

  // Level neu laden, damit Gegner wieder da sind
  if (typeof initLevel === "function") initLevel();
  else if (typeof createLevel1 === "function") createLevel1();

  world = new World(canvas, keyboard);
}

/* ── Fullscreen ── */

function toggleFullscreen() {
  let element = document.getElementById("all-game-contents");
  if (!document.fullscreenElement) {
    element.requestFullscreen().catch((err) => {
      console.error(`Error: ${err.message}`);
    });
  } else {
    document.exitFullscreen();
  }
}

/* ── Tastatur ── */

window.addEventListener("keydown", (e) => {
  if (e.keyCode === 32) e.preventDefault();
  setKeyState(e.keyCode, true);
  if (e.keyCode === 70) toggleFullscreen(); // F für Fullscreen
});

window.addEventListener("keyup", (e) => {
  setKeyState(e.keyCode, false);
});

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
