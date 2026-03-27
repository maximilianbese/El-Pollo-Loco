let canvas;
let world;
let keyboard = new Keyboard();
let globalIntervals = [];

// Globale Audio-Werte zum Zwischenspeichern der Slider-Einstellung
let currentVolume = 0.5;
let isMuted = false;

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

  if (typeof createLevel1 === "function") createLevel1();

  world = new World(canvas, keyboard);

  // Einstellungen aus dem Startmenü auf die neue Welt übertragen
  world.isMuted = isMuted;
  world.globalVolume = currentVolume;
  world.applyVolume();
}

function restartGame() {
  document.getElementById("game-over-screen").classList.add("d-none");
  document.getElementById("win-screen").classList.add("d-none");

  // Audio-Status der alten Welt merken
  let lastVol = world.globalVolume;
  let lastMute = world.isMuted;

  clearAllIntervals();
  if (typeof createLevel1 === "function") createLevel1();

  world = new World(canvas, keyboard);
  world.globalVolume = lastVol;
  world.isMuted = lastMute;
  world.applyVolume();
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

function toggleMute() {
  isMuted = !isMuted;
  if (world) {
    world.toggleMute();
  }
  document.getElementById("mute-icon").innerText = isMuted ? "🔇" : "🔊";
}

function changeVolume(value) {
  currentVolume = parseFloat(value);
  if (world) {
    world.setVolume(currentVolume);
  }
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
  if (e.keyCode === 77) toggleMute();
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
    77: "M",
  };
  const key = keyMap[keyCode];
  if (key) keyboard[key] = isPressed;
}
