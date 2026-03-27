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

  // --- AUDIO STEUERUNG ---
  isMuted = false;
  globalVolume = 0.5;

  // SOUNDS
  coin_sound = new Audio("audio/coin.mp3");
  bottle_pickup_sound = new Audio("audio/bottle_collect.mp3");
  chicken_dead_sound = new Audio("audio/chicken-hit.mp3");
  boss_hurt_sound = new Audio("audio/chicken-hit.mp3");
  boss_intro_sound = new Audio("audio/endboss_intro.mp3");
  win_sound = new Audio("audio/you-win.mp3");
  game_over_sound = new Audio("audio/game_over.mp3");

  constructor(canvas, keyboard) {
    this.ctx = canvas.getContext("2d");
    this.canvas = canvas;
    this.keyboard = keyboard;
    this.setWorld();

    // WICHTIG: Erst alle Sounds in die Liste, dann Volume anwenden
    this.applyVolume();

    this.run();
    this.draw();
  }

  /**
   * Gibt ein Array mit allen Sound-Objekten zurück.
   */
  get allSounds() {
    return [
      this.coin_sound,
      this.bottle_pickup_sound,
      this.chicken_dead_sound,
      this.boss_hurt_sound,
      this.boss_intro_sound,
      this.win_sound,
      this.game_over_sound,
      this.character.walking_sound,
      this.character.jump_sound, // Korrigiert von jumping_sound auf jump_sound
      this.character.hurt_sound,
    ].filter((s) => s !== undefined);
  }

  /**
   * Wendet die aktuelle Lautstärke auf alle Audio-Objekte an.
   */
  applyVolume() {
    this.allSounds.forEach((sound) => {
      sound.volume = this.isMuted ? 0 : this.globalVolume;
    });
  }

  /**
   * Schaltet den Ton an oder aus.
   */
  toggleMute() {
    this.isMuted = !this.isMuted;
    this.applyVolume();
  }

  /**
   * Setzt eine neue globale Lautstärke (0 bis 1).
   */
  setVolume(value) {
    this.globalVolume = parseFloat(value);
    this.applyVolume();
  }

  /**
   * Zentrale Funktion zum Abspielen von Sounds.
   */
  playAudio(audio) {
    if (!audio) return;
    audio.volume = this.isMuted ? 0 : this.globalVolume;
    audio.pause();
    audio.currentTime = 0;
    audio.play().catch((e) => console.warn("Audio playback failed:", e));
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
      this.checkMuteToggle();
    }, 1000 / 60);
  }

  checkMuteToggle() {
    if (this.keyboard.M) {
      if (!this.muteKeyPressed) {
        this.toggleMute();
        const icon = document.getElementById("mute-icon");
        if (icon) icon.innerText = this.isMuted ? "🔇" : "🔊";
        this.muteKeyPressed = true;
      }
    } else {
      this.muteKeyPressed = false;
    }
  }

  checkGameStatus() {
    // 1. Pepe stirbt (Game Over)
    if (this.character.isDead() && !this.gameOver) {
      this.gameOver = true;
      this.character.walking_sound.pause(); // Walking Sound explizit stoppen
      this.boss_intro_sound.pause();
      this.playAudio(this.game_over_sound);
      showGameOver();
    }

    const boss = this.level.enemies.find((e) => e instanceof Endboss);
    if (boss && boss.isDead() && !this.gameOver) {
      this.gameOver = true;
      this.character.walking_sound.pause(); // Walking Sound auch bei Sieg stoppen
      this.playAudio(this.win_sound);
      setTimeout(() => {
        showWin();
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
            this.playAudio(this.character.hurt_sound); // Hurt Sound bei Boss-Kontakt
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
    this.playAudio(this.chicken_dead_sound);
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
          this.playAudio(this.boss_hurt_sound);
          this.endbossBar.setPercentage(enemy.energy);
          enemy.x += 30;
        } else {
          this.playAudio(this.chicken_dead_sound);
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
    this.playAudio(this.coin_sound);
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
    this.playAudio(this.bottle_pickup_sound);
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
    this.playAudio(this.boss_intro_sound);
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
    /* Zeichenlogik in world-draw.js */
  }
}
