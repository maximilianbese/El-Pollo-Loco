class World {
  character = new Character();
  level = level1;
  canvas;
  ctx;
  keyboard;
  camera_x = 0;

  // Status bars
  healthBar = new StatusBar("health", 0);
  bottleBar = new StatusBar("bottle", 50);
  coinBar = new StatusBar("coin", 100);
  endbossBar = new StatusBar("endboss", 0);

  throwableObjects = [];

  // Inventory
  bottleCount = 0;
  coinCount = 0;
  maxBottles = 5;
  maxCoins = 10;

  gameOver = false;

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
      this.updateHUD();
    }, 200);
  }

  checkThrowObjects() {
    if (this.keyboard.D && this.bottleCount > 0 && !this.lastThrow) {
      this.bottleCount--;
      this.bottleBar.setPercentage((this.bottleCount / this.maxBottles) * 100);
      let bottle = new ThrowableObject(
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
    this.throwableObjects.forEach((bottle, bi) => {
      this.level.enemies.forEach((enemy) => {
        if (!enemy.isDead() && bottle.isColliding(enemy)) {
          enemy.hit();
          this.throwableObjects.splice(bi, 1);
          if (enemy instanceof Endboss) {
            this.endbossBar.setPercentage(enemy.energy);
          }
        }
      });
    });
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
      if (enemy instanceof Endboss && !enemy.hadFirstContact) {
        if (this.character.x > 1800) {
          enemy.hadFirstContact = true;
        }
      }
    });
  }

  updateHUD() {
    const bc = document.getElementById("bottle-count");
    const cc = document.getElementById("coin-count");
    if (bc) bc.textContent = `🍾 Flaschen: ${this.bottleCount}`;
    if (cc) cc.textContent = `🪙 Coins: ${this.coinCount}`;
  }

  draw() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    this.ctx.translate(this.camera_x, 0);
    this.addObjectsToMap(this.level.backgroundObjects);
    this.addObjectsToMap(this.level.clouds);
    this.addObjectsToMap(this.level.coins);
    this.addObjectsToMap(this.level.bottlesOnGround);
    this.addObjectsToMap(this.level.enemies);
    this.addToMap(this.character);
    this.addObjectsToMap(this.throwableObjects);
    this.ctx.translate(-this.camera_x, 0);

    this.addToMap(this.healthBar);
    this.addToMap(this.bottleBar);
    this.addToMap(this.coinBar);

    const endboss = this.level.enemies.find((e) => e instanceof Endboss);
    if (endboss && endboss.hadFirstContact) {
      this.addToMap(this.endbossBar);
    }

    requestAnimationFrame(() => this.draw());
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
