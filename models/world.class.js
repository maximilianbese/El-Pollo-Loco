class World {
  character = new Character();
  level = level1;
  canvas;
  ctx;
  keyboard;
  camera_x = 0;

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
    this.level.enemies.forEach((enemy) => {
      if (enemy instanceof Endboss) enemy.world = this;
    });
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
      this.checkGameStatus();
    }, 1000 / 60);
  }

  /**
   * Prüft den Spielzustand auf Sieg oder Niederlage
   */
  checkGameStatus() {
    // 1. Pepe stirbt
    if (this.character.isDead()) {
      this.gameOver = true;
      showGameOver(); // Funktion in game.js
    }

    // 2. Endboss stirbt
    const boss = this.level.enemies.find((e) => e instanceof Endboss);
    if (boss && boss.isDead()) {
      this.gameOver = true;
      // Kurze Verzögerung für die Todes-Animation des Bosses
      setTimeout(() => {
        showWin(); // Funktion in game.js
      }, 1000);
    }
  }

  checkCollisions() {
    this.level.enemies.forEach((enemy) => {
      if (this.character.isColliding(enemy) && !enemy.isDead()) {
        if (this.canStompEnemy(enemy)) {
          this.stompEnemy(enemy);
        } else if (!this.character.isHurt()) {
          if (enemy instanceof Endboss) {
            this.character.energy -= 20;
            this.character.lastHit = new Date().getTime();
          } else {
            this.character.hit();
          }
          this.healthBar.setPercentage(this.character.energy);
        }
      }
    });
  }

  canStompEnemy(enemy) {
    return (
      (enemy instanceof Chicken || enemy instanceof SmallChicken) &&
      this.character.isAboveGround() &&
      this.character.speedY <= 0.5 &&
      this.character.y + this.character.height > enemy.y
    );
  }

  stompEnemy(enemy) {
    enemy.energy = 0;
    this.character.speedY = 15;
  }

  checkBottleCollisions() {
    this.throwableObjects.forEach((bottle) => {
      if (bottle.isSplashing || bottle.splashDone) return;
      if (bottle.y >= 370) {
        bottle.splash();
        return;
      }
      this.checkBottleHitsEnemy(bottle);
    });
  }

  checkBottleHitsEnemy(bottle) {
    this.level.enemies.forEach((enemy) => {
      if (!enemy.isDead() && bottle.isColliding(enemy)) {
        enemy.hit();
        bottle.splash();
        if (enemy instanceof Endboss) {
          this.endbossBar.setPercentage(enemy.energy);
          enemy.x += 30; // Kleiner Rückstoß für den Boss
        }
      }
    });
  }

  checkThrowObjects() {
    if (!this.canThrow()) return;
    this.bottleCount--;
    this.bottleBar.setPercentage((this.bottleCount / this.maxBottles) * 100);
    this.spawnBottle();
    this.startThrowCooldown();
  }

  canThrow() {
    return this.keyboard.D && this.bottleCount > 0 && !this.lastThrow;
  }

  spawnBottle() {
    const xOffset = this.character.otherDirection ? -60 : 100;
    const bottle = new ThrowableObject(
      this.character.x + xOffset,
      this.character.y + 100,
      this.character.otherDirection,
    );
    this.throwableObjects.push(bottle);
  }

  startThrowCooldown() {
    this.lastThrow = true;
    setTimeout(() => (this.lastThrow = false), 300);
  }

  cleanupSplashedBottles() {
    this.throwableObjects = this.throwableObjects.filter((b) => !b.splashDone);
  }

  checkCoinCollections() {
    this.level.coins.forEach((coin, i) => {
      if (this.character.isColliding(coin)) this.collectCoin(i);
    });
  }

  collectCoin(index) {
    this.coinCount++;
    this.coinBar.setPercentage(
      Math.min((this.coinCount / this.maxCoins) * 100, 100),
    );
    this.level.coins.splice(index, 1);
  }

  checkBottlePickups() {
    this.level.bottlesOnGround.forEach((bottle, i) => {
      if (
        this.character.isColliding(bottle) &&
        this.bottleCount < this.maxBottles
      ) {
        this.pickupBottle(i);
      }
    });
  }

  pickupBottle(index) {
    this.bottleCount++;
    this.bottleBar.setPercentage((this.bottleCount / this.maxBottles) * 100);
    this.level.bottlesOnGround.splice(index, 1);
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
    if (this.introPhase === "in") this.updateIntroFadeIn();
    else if (this.introPhase === "hold") this.updateIntroHold();
    else if (this.introPhase === "out") this.updateIntroFadeOut();
  }

  updateIntroFadeIn() {
    this.introAlpha = Math.min(this.introAlpha + 0.05, 1);
    if (this.introAlpha >= 1) {
      this.introPhase = "hold";
      this.introTimer = 0;
    }
  }

  updateIntroHold() {
    if (this.introTimer > 70) {
      this.introPhase = "out";
      this.introTimer = 0;
    }
  }

  updateIntroFadeOut() {
    this.introAlpha = Math.max(this.introAlpha - 0.04, 0);
    if (this.introAlpha <= 0) {
      this.endbossIntroActive = false;
      this.endbossIntroDone = true;
    }
  }

  draw() {
    /* Die Zeichenlogik wird über world-draw.js ausgeführt */
  }
}
