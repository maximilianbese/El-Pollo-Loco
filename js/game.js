let canvas;
let world;
let keyboard = new Keyboard();
let globalIntervals = [];

// Persist volume and mute state across sessions via localStorage
let currentVolume =
  localStorage.getItem("gameVolume") !== null
    ? parseFloat(localStorage.getItem("gameVolume"))
    : 0.5;
let isMuted = localStorage.getItem("gameMuted") === "true";

// Override setInterval globally to track all interval IDs for cleanup
const _origSetInterval = window.setInterval;
window.setInterval = function (fn, delay) {
  const id = _origSetInterval(fn, delay);
  globalIntervals.push(id);
  return id;
};

window.addEventListener("load", () => {
  const icon = document.getElementById("mute-icon");
  const slider = document.getElementById("volume-slider");
  if (icon) icon.innerText = isMuted ? "🔇" : "🔊";
  if (slider) slider.value = currentVolume;
});

/**
 * Clears all tracked setInterval instances to stop the game loop on restart.
 */
function clearAllIntervals() {
  globalIntervals.forEach((id) => clearInterval(id));
  globalIntervals = [];
}

/**
 * Toggles the keyboard controls panel on the start screen.
 */
function toggleControls() {
  document.getElementById("controls-panel")?.classList.toggle("d-none");
}

/**
 * Hides the start screen, initializes the level and world,
 * transfers audio settings, and binds mobile touch controls.
 */
function startGame() {
  document.getElementById("start-screen").style.display = "none";
  document.getElementById("game-wrapper").style.display = "flex";
  canvas = document.getElementById("canvas");
  createLevel1();
  world = new World(canvas, keyboard);
  world.isMuted = isMuted;
  world.globalVolume = currentVolume;
  world.applyVolume();
  if (typeof bindTouchEvents === "function") bindTouchEvents();
}

/**
 * Resets the game state and starts a fresh run while preserving audio settings.
 */
function restartGame() {
  document.getElementById("game-over-screen").classList.add("d-none");
  document.getElementById("win-screen").classList.add("d-none");
  const lastVol = world ? world.globalVolume : currentVolume;
  const lastMute = world ? world.isMuted : isMuted;
  clearAllIntervals();
  createLevel1();
  world = new World(canvas, keyboard);
  world.globalVolume = lastVol;
  world.isMuted = lastMute;
  world.applyVolume();
  world.camera_x = 0;
  if (typeof bindTouchEvents === "function") bindTouchEvents();
}

/**
 * Shows the game-over screen and stops all game loops.
 */
function showGameOver() {
  document.getElementById("game-over-screen").classList.remove("d-none");
  clearAllIntervals();
}

/**
 * Shows the win screen and stops all game loops.
 */
function showWin() {
  document.getElementById("win-screen").classList.remove("d-none");
  clearAllIntervals();
}

/**
 * Toggles global mute state, persists the setting, and updates the icon.
 */
function toggleMute() {
  isMuted = !isMuted;
  localStorage.setItem("gameMuted", isMuted);
  if (world) world.toggleMute();
  document.getElementById("mute-icon").innerText = isMuted ? "🔇" : "🔊";
}

/**
 * Updates the global volume, persists it, and applies it to the running world.
 * @param {string|number} value - New volume level between 0 and 1.
 */
function changeVolume(value) {
  currentVolume = parseFloat(value);
  localStorage.setItem("gameVolume", currentVolume);
  if (world) world.setVolume(currentVolume);
}

/**
 * Toggles fullscreen mode for the main game container element.
 */
function toggleFullscreen() {
  const element = document.getElementById("all-game-contents");
  if (!document.fullscreenElement)
    element.requestFullscreen().catch(console.error);
  else document.exitFullscreen();
}

/**
 * Maps a keyboard keyCode to the corresponding Keyboard property name.
 * @param {number} keyCode
 * @returns {string|undefined}
 */
function getKeyName(keyCode) {
  const keyMap = {
    39: "RIGHT",
    37: "LEFT",
    38: "UP",
    40: "DOWN",
    32: "SPACE",
    68: "D",
    77: "M",
  };
  return keyMap[keyCode];
}

window.addEventListener("keydown", (e) => {
  if (e.keyCode === 32) e.preventDefault();
  const key = getKeyName(e.keyCode);
  if (key) keyboard[key] = true;
  if (e.keyCode === 70) toggleFullscreen();
  if (e.keyCode === 77) toggleMute();
});

window.addEventListener("keyup", (e) => {
  const key = getKeyName(e.keyCode);
  if (key) keyboard[key] = false;
});
