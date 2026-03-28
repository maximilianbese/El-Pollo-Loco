/**
 * Binds touch events on the mobile control buttons to the global keyboard state.
 * Must be called after the game DOM is visible (called from startGame/restartGame).
 */
function bindTouchEvents() {
  bindButton(
    "btn-left",
    () => {
      keyboard.LEFT = true;
    },
    () => {
      keyboard.LEFT = false;
    },
  );
  bindButton(
    "btn-right",
    () => {
      keyboard.RIGHT = true;
    },
    () => {
      keyboard.RIGHT = false;
    },
  );
  bindButton(
    "btn-jump",
    () => {
      keyboard.SPACE = true;
    },
    () => {
      keyboard.SPACE = false;
    },
  );
  bindButton(
    "btn-throw",
    () => {
      keyboard.D = true;
    },
    () => {
      keyboard.D = false;
    },
  );
}

/**
 * Adds touchstart and touchend listeners to a button element.
 * Calls preventDefault to avoid scroll/zoom side effects.
 * @param {string} id - The DOM element ID of the button.
 * @param {Function} onStart - Callback fired on touchstart.
 * @param {Function} onEnd - Callback fired on touchend.
 */
function bindButton(id, onStart, onEnd) {
  const btn = document.getElementById(id);
  if (!btn) return;
  btn.addEventListener("touchstart", (e) => {
    e.preventDefault();
    onStart();
  });
  btn.addEventListener("touchend", (e) => {
    e.preventDefault();
    onEnd();
  });
}
