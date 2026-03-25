class World {
  character = new Character();
  level = level1;
  canvas;
  ctx;
  keyboard;
  camera_x = 0;

  // Status-Bars – sauber gestaffelt, kein Overlap
  healthBar = new StatusBar("health", 10);
  bottleBar = new StatusBar("bottle", 58);
  coinBar = new StatusBar("coin", 106);
  endbossBar = new StatusBar("endboss", 0);

  throwableObjects = [];
  bottleCount = 0;
  coinCount = 0;
  maxBottles = 5;
  maxCoins = 10;
  gameOver = false;

  // Endboss-Intro state
  endbossIntroActive = false;
  endbossIntroDone = false;
  introAlpha = 0;
  introPhase = "in";
  introTimer = 0;

  constructor(canvas, keyboard) {
    this.ctx = canvas.getContext("2d");
    this.canvas = canvas;
    this.keyboard = keyboard;
    this.setWorld();
    this.run();
    this.draw();
  }

  setWorld() {
    this.character.world = this;
  }

  run() {
    setInterval(() => {
      if (this.gameOver) return;
      this.checkCollisions();
      this.checkThrowObjects();
      this.checkBottleCollisions();
      this.checkCoinCollections();
      this.checkBottlePickups();
      this.checkEndbossFirstContact();
      this.cleanupSplashedBottles();
    }, 200);
  }

  checkThrowObjects() {
    if (this.keyboard.D && this.bottleCount > 0 && !this.lastThrow) {
      this.bottleCount--;
      this.bottleBar.setPercentage((this.bottleCount / this.maxBottles) * 100);
      const bottle = new ThrowableObject(
        this.character.x + (this.character.otherDirection ? -60 : 100),
        this.character.y + 100,
      );
      this.throwableObjects.push(bottle);
      this.lastThrow = true;
      setTimeout(() => {
        this.lastThrow = false;
      }, 300);
    }
  }

  checkCollisions() {
    this.level.enemies.forEach((enemy) => {
      if (!enemy.isDead() && this.character.isColliding(enemy)) {
        if (
          enemy instanceof Chicken &&
          this.character.isAboveGround() &&
          this.character.speedY < 0
        ) {
          enemy.energy = 0;
          this.character.speedY = 10;
        } else {
          if (!this.character.isHurt()) {
            this.character.hit();
            this.healthBar.setPercentage(this.character.energy);
          }
        }
      }
    });
  }

  checkBottleCollisions() {
    this.throwableObjects.forEach((bottle) => {
      if (bottle.isSplashing || bottle.splashDone) return;
      if (bottle.y >= 370) {
        bottle.splash();
        return;
      }
      this.level.enemies.forEach((enemy) => {
        if (!enemy.isDead() && bottle.isColliding(enemy)) {
          enemy.hit();
          bottle.splash();
          if (enemy instanceof Endboss)
            this.endbossBar.setPercentage(enemy.energy);
        }
      });
    });
  }

  cleanupSplashedBottles() {
    this.throwableObjects = this.throwableObjects.filter((b) => !b.splashDone);
  }

  checkCoinCollections() {
    this.level.coins.forEach((coin, i) => {
      if (this.character.isColliding(coin)) {
        this.coinCount++;
        this.coinBar.setPercentage(
          Math.min((this.coinCount / this.maxCoins) * 100, 100),
        );
        this.level.coins.splice(i, 1);
      }
    });
  }

  checkBottlePickups() {
    this.level.bottlesOnGround.forEach((bottle, i) => {
      if (
        this.character.isColliding(bottle) &&
        this.bottleCount < this.maxBottles
      ) {
        this.bottleCount++;
        this.bottleBar.setPercentage(
          (this.bottleCount / this.maxBottles) * 100,
        );
        this.level.bottlesOnGround.splice(i, 1);
      }
    });
  }

  checkEndbossFirstContact() {
    this.level.enemies.forEach((enemy) => {
      if (
        enemy instanceof Endboss &&
        !enemy.hadFirstContact &&
        this.character.x > 1800
      ) {
        enemy.hadFirstContact = true;
        this.triggerEndbossIntro();
      }
    });
  }

  // ── Endboss Intro ──────────────────────────────────────────────────────
  triggerEndbossIntro() {
    if (this.endbossIntroDone) return;
    this.endbossIntroActive = true;
    this.introAlpha = 0;
    this.introPhase = "in";
    this.introTimer = 0;
  }

  updateIntro() {
    if (!this.endbossIntroActive) return;
    this.introTimer++;
    if (this.introPhase === "in") {
      this.introAlpha = Math.min(this.introAlpha + 0.05, 1);
      if (this.introAlpha >= 1) {
        this.introPhase = "hold";
        this.introTimer = 0;
      }
    } else if (this.introPhase === "hold") {
      if (this.introTimer > 70) {
        this.introPhase = "out";
        this.introTimer = 0;
      }
    } else if (this.introPhase === "out") {
      this.introAlpha = Math.max(this.introAlpha - 0.04, 0);
      if (this.introAlpha <= 0) {
        this.endbossIntroActive = false;
        this.endbossIntroDone = true;
      }
    }
  }

  drawEndbossIntro() {
    const ctx = this.ctx;
    const W = this.canvas.width;
    const H = this.canvas.height;
    ctx.save();

    // Dunkles Overlay
    ctx.globalAlpha = this.introAlpha * 0.65;
    ctx.fillStyle = "#000";
    ctx.fillRect(0, 0, W, H);

    // Warnstreifen
    const sH = 86,
      sY = H / 2 - sH / 2;
    ctx.globalAlpha = this.introAlpha * 0.88;
    ctx.fillStyle = "rgba(160,10,10,0.92)";
    ctx.fillRect(0, sY, W, sH);

    // Rahmenlinien
    ctx.globalAlpha = this.introAlpha;
    ctx.strokeStyle = "#FFD700";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(0, sY);
    ctx.lineTo(W, sY);
    ctx.moveTo(0, sY + sH);
    ctx.lineTo(W, sY + sH);
    ctx.stroke();

    // Schatten-Text
    ctx.globalAlpha = this.introAlpha;
    ctx.font = "bold 38px 'Rye', serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillStyle = "rgba(0,0,0,0.7)";
    ctx.fillText("⚠  EL POLLO LOCO ERSCHEINT!  ⚠", W / 2 + 3, H / 2 + 3);

    // Gradient-Text
    const g = ctx.createLinearGradient(0, H / 2 - 22, 0, H / 2 + 22);
    g.addColorStop(0, "#FFE84A");
    g.addColorStop(1, "#FF7A00");
    ctx.fillStyle = g;
    ctx.fillText("⚠  EL POLLO LOCO ERSCHEINT!  ⚠", W / 2, H / 2);

    ctx.restore();
  }

  // ── Draw ──────────────────────────────────────────────────────────────
  draw() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    this.updateIntro();

    // Spielwelt
    this.ctx.translate(this.camera_x, 0);
    this.addObjectsToMap(this.level.backgroundObjects);
    this.addObjectsToMap(this.level.clouds);
    this.addObjectsToMap(this.level.coins);
    this.addObjectsToMap(this.level.bottlesOnGround);
    this.addObjectsToMap(this.level.enemies);
    this.addToMap(this.character);
    this.addObjectsToMap(this.throwableObjects);
    this.ctx.translate(-this.camera_x, 0);

    // ── Linke Status-Bars ──────────────────────────────────────────────
    this.addToMap(this.healthBar);
    this.addToMap(this.bottleBar);
    this.addToMap(this.coinBar);

    // ── Endboss-Bar oben rechts ────────────────────────────────────────
    const endboss = this.level.enemies.find((e) => e instanceof Endboss);
    if (endboss && endboss.hadFirstContact) {
      this.addToMap(this.endbossBar);
      this.drawEndbossLabel();
    }

    // ── Fullscreen-Button (Canvas, oben rechts) ────────────────────────
    this.drawFSButton();

    // ── Endboss-Intro-Overlay ──────────────────────────────────────────
    if (this.endbossIntroActive) this.drawEndbossIntro();

    requestAnimationFrame(() => this.draw());
  }

  drawEndbossLabel() {
    const ctx = this.ctx;
    ctx.save();
    ctx.font = "bold 12px sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "top";
    ctx.fillStyle = "#FFE84A";
    ctx.shadowColor = "rgba(0,0,0,0.9)";
    ctx.shadowBlur = 4;
    ctx.fillText(
      "El Pollo Loco ❤",
      this.endbossBar.x + this.endbossBar.width / 2,
      this.endbossBar.y + this.endbossBar.height + 1,
    );
    ctx.restore();
  }

  drawFSButton() {
    const ctx = this.ctx;
    const W = this.canvas.width;
    const bx = W - 40,
      by = 8,
      bw = 32,
      bh = 26;

    ctx.save();
    ctx.fillStyle = "rgba(0,0,0,0.45)";
    ctx.strokeStyle = "rgba(255,255,255,0.45)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.roundRect(bx, by, bw, bh, 5);
    ctx.fill();
    ctx.stroke();

    ctx.font = "15px sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillStyle = "#fff";
    ctx.fillText("⛶", bx + bw / 2, by + bh / 2);
    ctx.restore();

    if (!this._fsBound) {
      this._fsBound = true;
      this.canvas.addEventListener("click", (e) => {
        const r = this.canvas.getBoundingClientRect();
        const sx = this.canvas.width / r.width;
        const sy = this.canvas.height / r.height;
        const cx = (e.clientX - r.left) * sx;
        const cy = (e.clientY - r.top) * sy;
        if (cx >= bx && cx <= bx + bw && cy >= by && cy <= by + bh)
          toggleFullscreen();
      });
    }
  }

  addObjectsToMap(objects) {
    objects.forEach((o) => this.addToMap(o));
  }

  addToMap(mo) {
    if (mo.otherDirection) this.flipImage(mo);
    mo.draw(this.ctx);
    mo.drawFrame(this.ctx);
    if (mo.otherDirection) this.flipImageBack(mo);
  }

  flipImage(mo) {
    this.ctx.save();
    this.ctx.translate(mo.width, 0);
    this.ctx.scale(-1, 1);
    mo.x = mo.x * -1;
  }

  flipImageBack(mo) {
    mo.x = mo.x * -1;
    this.ctx.restore();
  }
}
