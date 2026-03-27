/**
 * Initialisiert die Touch-Events für die mobile Steuerung.
 * Diese Funktion sollte in deiner init() oder startGame() aufgerufen werden.
 */
function bindTouchEvents() {
  // Buttons für die Bewegung (Links / Rechts)
  const btnLeft = document.getElementById("btn-left");
  const btnRight = document.getElementById("btn-right");

  // Buttons für Aktionen (Springen / Werfen)
  const btnJump = document.getElementById("btn-jump");
  const btnThrow = document.getElementById("btn-throw");

  // Event-Listener für LINKS
  btnLeft.addEventListener("touchstart", (e) => {
    e.preventDefault(); // Verhindert Scrollen oder Zoomen beim Tippen
    keyboard.LEFT = true;
  });
  btnLeft.addEventListener("touchend", (e) => {
    e.preventDefault();
    keyboard.LEFT = false;
  });

  // Event-Listener für RECHTS
  btnRight.addEventListener("touchstart", (e) => {
    e.preventDefault();
    keyboard.RIGHT = true;
  });
  btnRight.addEventListener("touchend", (e) => {
    e.preventDefault();
    keyboard.RIGHT = false;
  });

  // Event-Listener für SPRINGEN (Space-Ersatz)
  btnJump.addEventListener("touchstart", (e) => {
    e.preventDefault();
    keyboard.SPACE = true;
  });
  btnJump.addEventListener("touchend", (e) => {
    e.preventDefault();
    keyboard.SPACE = false;
  });

  // Event-Listener für WERFEN (D-Ersatz)
  btnThrow.addEventListener("touchstart", (e) => {
    e.preventDefault();
    keyboard.D = true;
  });
  btnThrow.addEventListener("touchend", (e) => {
    e.preventDefault();
    keyboard.D = false;
  });
}

/**
 * Ruft die Initialisierung auf, sobald das Dokument geladen ist,
 * oder du rufst bindTouchEvents() manuell in deiner game.js auf.
 */
window.addEventListener("load", () => {
  bindTouchEvents();
});
