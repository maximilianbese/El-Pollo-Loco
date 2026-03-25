let canvas;
let world;
let keyboard = new Keyboard();

function init() {
  // Start Screen wird angezeigt – Spiel startet erst per Button
}

function startGame() {
  document.getElementById("start-screen").style.display = "none";
  document.getElementById("game-container").style.display = "block";

  canvas = document.getElementById("canvas");
  world = new World(canvas, keyboard);
}

function restartGame() {
  document.getElementById("game-over-screen").style.display = "none";
  document.getElementById("win-screen").style.display = "none";

  createLevel1();
  world = new World(canvas, keyboard);
}

function showGameOver() {
  document.getElementById("game-over-screen").style.display = "flex";
}

function showWinScreen() {
  document.getElementById("win-screen").style.display = "flex";
}

function toggleFullscreen() {
  const container = document.getElementById("game-container");
  const target =
    container.style.display === "none" ? document.documentElement : container;

  if (!document.fullscreenElement) {
    (
      target.requestFullscreen ||
      target.webkitRequestFullscreen ||
      target.mozRequestFullScreen
    ).call(target);
  } else {
    (
      document.exitFullscreen ||
      document.webkitExitFullscreen ||
      document.mozCancelFullScreen
    ).call(document);
  }
}

window.addEventListener("keydown", (e) => {
  if (e.keyCode === 39) keyboard.RIGHT = true;
  if (e.keyCode === 37) keyboard.LEFT = true;
  if (e.keyCode === 38) keyboard.UP = true;
  if (e.keyCode === 40) keyboard.DOWN = true;
  if (e.keyCode === 32) {
    keyboard.SPACE = true;
    e.preventDefault();
  }
  if (e.keyCode === 68) keyboard.D = true;
  if (e.keyCode === 70) toggleFullscreen();
});

window.addEventListener("keyup", (e) => {
  if (e.keyCode === 39) keyboard.RIGHT = false;
  if (e.keyCode === 37) keyboard.LEFT = false;
  if (e.keyCode === 38) keyboard.UP = false;
  if (e.keyCode === 40) keyboard.DOWN = false;
  if (e.keyCode === 32) keyboard.SPACE = false;
  if (e.keyCode === 68) keyboard.D = false;
});
