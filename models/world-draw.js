/* ═══════════════════════════════════════════════════════════
   WORLD-DRAW.JS  –  El Pollo Loco
   All rendering methods for the World class.
   Loaded after world.class.js and extends World via prototype.
   ═══════════════════════════════════════════════════════════ */

/**
 * Main render loop: clears the canvas, updates intro state,
 * draws all world and HUD layers, then schedules the next frame.
 */
World.prototype.draw = function () {
  this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  this.updateIntro();
  this.drawWorld();
  this.drawHUD();
  if (this.endbossIntroActive) this.drawEndbossIntro();
  requestAnimationFrame(() => this.draw());
};

/**
 * Draws all world-space objects with camera translation applied.
 */
World.prototype.drawWorld = function () {
  this.ctx.translate(this.camera_x, 0);
  this.addObjectsToMap(this.level.backgroundObjects);
  this.addObjectsToMap(this.level.clouds);
  this.addObjectsToMap(this.level.coins);
  this.addObjectsToMap(this.level.bottlesOnGround);
  this.addObjectsToMap(this.level.enemies);
  this.addToMap(this.character);
  this.addObjectsToMap(this.throwableObjects);
  this.ctx.translate(-this.camera_x, 0);
};

/**
 * Draws all fixed HUD elements (status bars and endboss label if active).
 */
World.prototype.drawHUD = function () {
  this.addToMap(this.healthBar);
  this.addToMap(this.bottleBar);
  this.addToMap(this.coinBar);
  this.drawEndbossHUD();
};

/**
 * Draws the endboss health bar and label once first contact has been made.
 */
World.prototype.drawEndbossHUD = function () {
  const endboss = this.level.enemies.find((e) => e instanceof Endboss);
  if (endboss?.hadFirstContact) {
    this.addToMap(this.endbossBar);
    this.drawEndbossLabel();
  }
};

/* ── Endboss Intro Overlay ──────────────────────────────── */

/**
 * Renders the full endboss intro overlay (dim + warning strip + text).
 */
World.prototype.drawEndbossIntro = function () {
  const W = this.canvas.width;
  const H = this.canvas.height;
  this.ctx.save();
  this.drawIntroDimOverlay(W, H);
  this.drawIntroWarningStrip(W, H);
  this.drawIntroText(W, H);
  this.ctx.restore();
};

/**
 * Draws a semi-transparent black overlay for the intro dimming effect.
 * @param {number} W - Canvas width.
 * @param {number} H - Canvas height.
 */
World.prototype.drawIntroDimOverlay = function (W, H) {
  this.ctx.globalAlpha = this.introAlpha * 0.65;
  this.ctx.fillStyle = "#000";
  this.ctx.fillRect(0, 0, W, H);
};

/**
 * Draws the red warning banner strip with gold border lines.
 * @param {number} W - Canvas width.
 * @param {number} H - Canvas height.
 */
World.prototype.drawIntroWarningStrip = function (W, H) {
  const sH = 86;
  const sY = H / 2 - sH / 2;
  this.ctx.globalAlpha = this.introAlpha * 0.88;
  this.ctx.fillStyle = "rgba(160,10,10,0.92)";
  this.ctx.fillRect(0, sY, W, sH);
  this.ctx.globalAlpha = this.introAlpha;
  this.ctx.strokeStyle = "#FFD700";
  this.ctx.lineWidth = 3;
  this.ctx.beginPath();
  this.ctx.moveTo(0, sY);
  this.ctx.lineTo(W, sY);
  this.ctx.moveTo(0, sY + sH);
  this.ctx.lineTo(W, sY + sH);
  this.ctx.stroke();
};

/**
 * Draws the warning text with drop shadow and gold gradient fill.
 * @param {number} W - Canvas width.
 * @param {number} H - Canvas height.
 */
World.prototype.drawIntroText = function (W, H) {
  const label = "⚠  EL POLLO LOCO ERSCHEINT!  ⚠";
  this.ctx.globalAlpha = this.introAlpha;
  this.ctx.font = "bold 38px 'Rye', serif";
  this.ctx.textAlign = "center";
  this.ctx.textBaseline = "middle";
  this.ctx.fillStyle = "rgba(0,0,0,0.7)";
  this.ctx.fillText(label, W / 2 + 3, H / 2 + 3);
  const gradient = this.ctx.createLinearGradient(0, H / 2 - 22, 0, H / 2 + 22);
  gradient.addColorStop(0, "#FFE84A");
  gradient.addColorStop(1, "#FF7A00");
  this.ctx.fillStyle = gradient;
  this.ctx.fillText(label, W / 2, H / 2);
};

/* ── HUD Labels ─────────────────────────────────────────── */

/**
 * Draws the "El Pollo Loco ❤" label below the endboss health bar.
 */
World.prototype.drawEndbossLabel = function () {
  const ctx = this.ctx;
  const x = this.endbossBar.x + this.endbossBar.width / 2;
  const y = this.endbossBar.y + this.endbossBar.height + 1;
  ctx.save();
  ctx.font = "bold 12px sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "top";
  ctx.fillStyle = "#FFE84A";
  ctx.shadowColor = "rgba(0,0,0,0.9)";
  ctx.shadowBlur = 4;
  ctx.fillText("El Pollo Loco ❤", x, y);
  ctx.restore();
};

/* ── Map Helpers ────────────────────────────────────────── */

/**
 * Draws all objects in an array onto the canvas.
 * @param {DrawableObject[]} objects - Array of drawable game objects.
 */
World.prototype.addObjectsToMap = function (objects) {
  objects.forEach((o) => this.addToMap(o));
};

/**
 * Draws a single object, handling horizontal flip for mirrored sprites.
 * @param {DrawableObject} mo - The object to draw.
 */
World.prototype.addToMap = function (mo) {
  if (mo.otherDirection) this.flipImage(mo);
  mo.draw(this.ctx);
  if (mo.otherDirection) this.flipImageBack(mo);
};

/**
 * Flips the canvas context horizontally to mirror a sprite.
 * @param {DrawableObject} mo - The object to flip.
 */
World.prototype.flipImage = function (mo) {
  this.ctx.save();
  this.ctx.translate(mo.width, 0);
  this.ctx.scale(-1, 1);
  mo.x = mo.x * -1;
};

/**
 * Restores the canvas context after a horizontal flip.
 * @param {DrawableObject} mo - The object that was flipped.
 */
World.prototype.flipImageBack = function (mo) {
  mo.x = mo.x * -1;
  this.ctx.restore();
};
