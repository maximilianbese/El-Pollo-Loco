/* ═══════════════════════════════════════════════════════
   WORLD_DRAW.JS  –  El Pollo Loco
   Alle Render-Methoden der World-Klasse.
   Wird nach world_class.js geladen und erweitert World.
   ═══════════════════════════════════════════════════════ */

/* ── Main Draw Loop ────────────────────────────────────── */
World.prototype.draw = function () {
  this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  this.updateIntro();
  this.drawWorld();
  this.drawHUD();
  if (this.endbossIntroActive) this.drawEndbossIntro();
  requestAnimationFrame(() => this.draw());
};

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

World.prototype.drawHUD = function () {
  this.addToMap(this.healthBar);
  this.addToMap(this.bottleBar);
  this.addToMap(this.coinBar);
  this.drawEndbossHUD();
  this.drawFSButton();
};

World.prototype.drawEndbossHUD = function () {
  const endboss = this.level.enemies.find((e) => e instanceof Endboss);
  if (endboss && endboss.hadFirstContact) {
    this.addToMap(this.endbossBar);
    this.drawEndbossLabel();
  }
};

/* ── Endboss Intro Overlay ─────────────────────────────── */
World.prototype.drawEndbossIntro = function () {
  const W = this.canvas.width;
  const H = this.canvas.height;
  this.ctx.save();
  this.drawIntroDimOverlay(W, H);
  this.drawIntroWarningStrip(W, H);
  this.drawIntroText(W, H);
  this.ctx.restore();
};

World.prototype.drawIntroDimOverlay = function (W, H) {
  this.ctx.globalAlpha = this.introAlpha * 0.65;
  this.ctx.fillStyle = "#000";
  this.ctx.fillRect(0, 0, W, H);
};

World.prototype.drawIntroWarningStrip = function (W, H) {
  const sH = 86;
  const sY = H / 2 - sH / 2;
  this.drawStripBackground(W, sY, sH);
  this.drawStripBorder(W, sY, sH);
};

World.prototype.drawStripBackground = function (W, sY, sH) {
  this.ctx.globalAlpha = this.introAlpha * 0.88;
  this.ctx.fillStyle = "rgba(160,10,10,0.92)";
  this.ctx.fillRect(0, sY, W, sH);
};

World.prototype.drawStripBorder = function (W, sY, sH) {
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

World.prototype.drawIntroText = function (W, H) {
  const label = "⚠  EL POLLO LOCO ERSCHEINT!  ⚠";
  this.ctx.globalAlpha = this.introAlpha;
  this.ctx.font = "bold 38px 'Rye', serif";
  this.ctx.textAlign = "center";
  this.ctx.textBaseline = "middle";
  this.drawIntroShadowText(label, W, H);
  this.drawIntroGradientText(label, W, H);
};

World.prototype.drawIntroShadowText = function (label, W, H) {
  this.ctx.fillStyle = "rgba(0,0,0,0.7)";
  this.ctx.fillText(label, W / 2 + 3, H / 2 + 3);
};

World.prototype.drawIntroGradientText = function (label, W, H) {
  const gradient = this.ctx.createLinearGradient(0, H / 2 - 22, 0, H / 2 + 22);
  gradient.addColorStop(0, "#FFE84A");
  gradient.addColorStop(1, "#FF7A00");
  this.ctx.fillStyle = gradient;
  this.ctx.fillText(label, W / 2, H / 2);
};

/* ── HUD Labels ────────────────────────────────────────── */
World.prototype.drawEndbossLabel = function () {
  const ctx = this.ctx;
  const x = this.endbossBar.x + this.endbossBar.width / 2;
  const y = this.endbossBar.y + this.endbossBar.height + 1;
  ctx.save();
  this.applyEndbossLabelStyle(ctx);
  ctx.fillText("El Pollo Loco ❤", x, y);
  ctx.restore();
};

World.prototype.applyEndbossLabelStyle = function (ctx) {
  ctx.font = "bold 12px sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "top";
  ctx.fillStyle = "#FFE84A";
  ctx.shadowColor = "rgba(0,0,0,0.9)";
  ctx.shadowBlur = 4;
};

/* ── Fullscreen Button ─────────────────────────────────── */
World.prototype.drawFSButton = function () {
  const { bx, by, bw, bh } = this.getFSButtonBounds();
  this.renderFSButton(bx, by, bw, bh);
  this.bindFSButtonClick(bx, by, bw, bh);
};

World.prototype.getFSButtonBounds = function () {
  return { bx: this.canvas.width - 40, by: 8, bw: 32, bh: 26 };
};

World.prototype.renderFSButton = function (bx, by, bw, bh) {
  const ctx = this.ctx;
  ctx.save();
  this.drawFSButtonBackground(ctx, bx, by, bw, bh);
  this.drawFSButtonIcon(ctx, bx, by, bw, bh);
  ctx.restore();
};

World.prototype.drawFSButtonBackground = function (ctx, bx, by, bw, bh) {
  ctx.fillStyle = "rgba(0,0,0,0.45)";
  ctx.strokeStyle = "rgba(255,255,255,0.45)";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.roundRect(bx, by, bw, bh, 5);
  ctx.fill();
  ctx.stroke();
};

World.prototype.drawFSButtonIcon = function (ctx, bx, by, bw, bh) {
  ctx.font = "15px sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillStyle = "#fff";
  ctx.fillText("⛶", bx + bw / 2, by + bh / 2);
};

World.prototype.bindFSButtonClick = function (bx, by, bw, bh) {
  if (this._fsBound) return;
  this._fsBound = true;
  this.canvas.addEventListener("click", (e) => {
    const pos = this.getCanvasClickPosition(e);
    if (this.isInsideFSButton(pos, bx, by, bw, bh)) toggleFullscreen();
  });
};

World.prototype.getCanvasClickPosition = function (e) {
  const r = this.canvas.getBoundingClientRect();
  return {
    x: (e.clientX - r.left) * (this.canvas.width / r.width),
    y: (e.clientY - r.top) * (this.canvas.height / r.height),
  };
};

World.prototype.isInsideFSButton = function (pos, bx, by, bw, bh) {
  return pos.x >= bx && pos.x <= bx + bw && pos.y >= by && pos.y <= by + bh;
};

/* ── Map Helpers ───────────────────────────────────────── */
World.prototype.addObjectsToMap = function (objects) {
  objects.forEach((o) => this.addToMap(o));
};

World.prototype.addToMap = function (mo) {
  if (mo.otherDirection) this.flipImage(mo);
  mo.draw(this.ctx);
  mo.drawFrame(this.ctx);
  if (mo.otherDirection) this.flipImageBack(mo);
};

World.prototype.flipImage = function (mo) {
  this.ctx.save();
  this.ctx.translate(mo.width, 0);
  this.ctx.scale(-1, 1);
  mo.x = mo.x * -1;
};

World.prototype.flipImageBack = function (mo) {
  mo.x = mo.x * -1;
  this.ctx.restore();
};
