/* ═══════════════════════════════════════════════════════
   MOBILE-CONTROLS.JS  –  El Pollo Loco
   Bindet Touch-Events an die virtuellen Buttons und
   schreibt in das globale `keyboard`-Objekt.
   ═══════════════════════════════════════════════════════ */

/**
 * Registriert Touch- und Mouse-Events für einen Button.
 * Setzt keyboard[key] auf true (press) und false (release).
 *
 * @param {string} btnId   – DOM-ID des Buttons
 * @param {string} key     – Schlüssel im Keyboard-Objekt
 * @param {object} kb      – das Keyboard-Objekt
 * @param {object} [opts]  – { onPress, onRelease } optionale Callbacks
 */
function bindControlButton(btnId, key, kb, opts = {}) {
  const btn = document.getElementById(btnId);
  if (!btn) return;

  const press = (e) => {
    e.preventDefault();
    kb[key] = true;
    btn.classList.add("pressed");
    if (opts.onPress) opts.onPress();
  };

  const release = (e) => {
    e.preventDefault();
    kb[key] = false;
    btn.classList.remove("pressed");
    if (opts.onRelease) opts.onRelease();
  };

  // Touch
  btn.addEventListener("touchstart", press, { passive: false });
  btn.addEventListener("touchend", release, { passive: false });
  btn.addEventListener("touchcancel", release, { passive: false });

  // Mouse (für Dev-Tools Device-Emulation)
  btn.addEventListener("mousedown", press);
  btn.addEventListener("mouseup", release);
  btn.addEventListener("mouseleave", release);
}

/**
 * Initialisiert alle Mobile-Controls.
 * Wird aufgerufen nachdem das DOM bereit ist.
 * keyboard-Objekt wird über die globale Variable referenziert.
 */
function initMobileControls() {
  // keyboard ist in game.js definiert – wird nach DOMContentLoaded verfügbar
  if (typeof keyboard === "undefined") {
    console.warn("mobile-controls: keyboard object not found");
    return;
  }

  bindControlButton("btn-left", "LEFT", keyboard);
  bindControlButton("btn-right", "RIGHT", keyboard);
  bindControlButton("btn-jump", "SPACE", keyboard);
  bindControlButton("btn-throw", "D", keyboard);

  // Verhindert Scrollen beim Tippen auf die Buttons
  document
    .getElementById("mobile-controls")
    ?.addEventListener("touchmove", (e) => e.preventDefault(), {
      passive: false,
    });
}

// Warten bis DOM + Scripts geladen → dann initialisieren
window.addEventListener("DOMContentLoaded", () => {
  // Kurze Verzögerung, damit game.js sein `keyboard`-Objekt anlegen kann
  setTimeout(initMobileControls, 0);
});
