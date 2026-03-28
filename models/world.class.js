/**
 * Central game world that owns all entities, manages the game loop,
 * handles collisions, pickups, audio, and win/loss conditions.
 */
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

  isMuted = false;
  globalVolume = 0.5;

  coin_sound = new Audio("audio/coin.mp3");
  bottle_pickup_sound = new Audio("audio/bottle_collect.mp3");
  chicken_dead_sound = new Audio("audio/chicken-hit.mp3");
  boss_intro_sound = new Audio("audio/endboss_intro.mp3");
  win_sound = new Audio("audio/you-win.mp3");
  game_over_sound = new Audio("audio/game_over.mp3");

  /**
   * @param {HTMLCanvasElement} canvas - The game canvas element.
   * @param {Keyboard} keyboard - The shared keyboard state object.
   */
  constructor(canvas, keyboard) {
    this.ctx = canvas.getContext("2d");
    this.canvas = canvas;
    this.keyboard = keyboard;
    this.setWorld();
    this.applyVolume();
    this.run();
    this.draw();
  }

  /** Returns all active Audio instances used by the world and character. @returns {HTMLAudioElement[]} */
  get allSounds() {
    return [
      this.coin_sound,
      this.bottle_pickup_sound,
      this.chicken_dead_sound,
      this.boss_intro_sound,
      this.win_sound,
      this.game_over_sound,
      this.character.walking_sound,
      this.character.jump_sound,
      this.character.hurt_sound,
    ].filter(Boolean);
  }

  /** Applies the current volume/mute state to every registered sound. */
  applyVolume() {
    this.allSounds.forEach(
      (s) => (s.volume = this.isMuted ? 0 : this.globalVolume),
    );
  }

  /** Toggles mute state and updates all sound volumes. */
  toggleMute() {
    this.isMuted = !this.isMuted;
    this.applyVolume();
  }

  /** Sets a new global volume and updates all sounds immediately. @param {number} value */
  setVolume(value) {
    this.globalVolume = parseFloat(value);
    this.applyVolume();
  }

  /**
   * Resets and plays an audio clip, silently catching any browser AbortError.
   * @param {HTMLAudioElement} audio
   */
  playAudio(audio) {
    if (!audio) return;
    audio.volume = this.isMuted ? 0 : this.globalVolume;
    audio.pause();
    audio.currentTime = 0;
    audio.play()?.catch(() => {});
  }

  /** Pauses and resets all registered sounds. */
  stopAllSounds() {
    this.allSounds.forEach((s) => {
      s.pause();
      s.currentTime = 0;
    });
  }

  /** Assigns this world reference to the character and all Endboss enemies. */
  setWorld() {
    this.character.world = this;
    this.level.enemies.forEach((e) => {
      if (e instanceof Endboss) e.world = this;
    });
  }

  /** Starts the main game logic loop at 60 fps. */
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

  /** Detects M-key press and toggles mute without repeating on a held key. */
  checkMuteToggle() {
    if (this.keyboard.M && !this.muteKeyPressed) {
      this.toggleMute();
      const icon = document.getElementById("mute-icon");
      if (icon) icon.innerText = this.isMuted ? "🔇" : "🔊";
      this.muteKeyPressed = true;
    } else if (!this.keyboard.M) {
      this.muteKeyPressed = false;
    }
  }

  /** Checks win/loss conditions and delegates to the appropriate handler. */
  checkGameStatus() {
    this.checkCharacterDeath();
    this.checkBossDeath();
  }

  /** Triggers Game Over if the character has died and the game is still running. */
  checkCharacterDeath() {
    if (!this.character.isDead() || this.gameOver) return;
    this.gameOver = true;
    this.stopAllSounds();
    this.playAudio(this.game_over_sound);
    showGameOver();
  }

  /** Triggers the win screen if the endboss has died and the game is still running. */
  checkBossDeath() {
    const boss = this.level.enemies.find((e) => e instanceof Endboss);
    if (!boss?.isDead() || this.gameOver) return;
    this.gameOver = true;
    this.stopAllSounds();
    this.playAudio(this.win_sound);
    setTimeout(() => showWin(), 1000);
  }

  /**
   * Checks each enemy for collision with the character.
   * Stomping kills chickens; other contacts damage Pepe.
   */
  checkCollisions() {
    this.level.enemies.forEach((enemy) => {
      if (!this.character.isColliding(enemy) || enemy.isDead()) return;
      if (this.canStompEnemy(enemy)) {
        this.stompEnemy(enemy);
        return;
      }
      if (this.character.isHurt()) return;
      if (enemy instanceof Endboss) {
        this.character.energy -= 20;
        this.character.lastHit = new Date().getTime();
        this.playAudio(this.character.hurt_sound);
      } else {
        this.character.hit();
      }
      this.healthBar.setPercentage(this.character.energy);
    });
  }

  /**
   * Returns true if the character can stomp (jump-kill) the given enemy.
   * @param {MovableObject} enemy @returns {boolean}
   */
  canStompEnemy(enemy) {
    return (
      (enemy instanceof Chicken || enemy instanceof SmallChicken) &&
      this.character.isAboveGround() &&
      this.character.speedY <= 0.5 &&
      this.character.y + this.character.height > enemy.y
    );
  }

  /** Kills an enemy by stomping and bounces the character upward. @param {MovableObject} enemy */
  stompEnemy(enemy) {
    enemy.energy = 0;
    this.character.speedY = 15;
    this.playAudio(this.chicken_dead_sound);
  }

  /** Checks all thrown bottles for ground impact or enemy collision. */
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

  /** Tests a bottle against all living enemies; triggers splash + hit on contact. @param {ThrowableObject} bottle */
  checkBottleHitsEnemy(bottle) {
    this.level.enemies.forEach((enemy) => {
      if (enemy.isDead() || !bottle.isColliding(enemy)) return;
      enemy.hit();
      bottle.splash();
      if (enemy instanceof Endboss) {
        this.endbossBar.setPercentage(enemy.energy);
        enemy.x += 30;
      }
      this.playAudio(this.chicken_dead_sound);
    });
  }

  /** Spawns a thrown bottle when D is pressed and the player has bottles available. */
  checkThrowObjects() {
    if (!this.canThrow()) return;
    this.bottleCount--;
    this.bottleBar.setPercentage((this.bottleCount / this.maxBottles) * 100);
    this.spawnBottle();
    this.startThrowCooldown();
  }

  /** Returns true if throw conditions are met. @returns {boolean} */
  canThrow() {
    return this.keyboard.D && this.bottleCount > 0 && !this.lastThrow;
  }

  /** Creates and registers a new ThrowableObject at the character's position. */
  spawnBottle() {
    const xOffset = this.character.otherDirection ? -60 : 100;
    this.throwableObjects.push(
      new ThrowableObject(
        this.character.x + xOffset,
        this.character.y + 100,
        this.character.otherDirection,
      ),
    );
  }

  /** Prevents rapid-fire throwing by locking throws for 300 ms. */
  startThrowCooldown() {
    this.lastThrow = true;
    setTimeout(() => (this.lastThrow = false), 300);
  }

  /** Removes fully splashed bottles from the active list. */
  cleanupSplashedBottles() {
    this.throwableObjects = this.throwableObjects.filter((b) => !b.splashDone);
  }

  /** Checks for character–coin overlap and collects matching coins. */
  checkCoinCollections() {
    this.level.coins.forEach((coin, i) => {
      if (this.character.isColliding(coin)) this.collectCoin(i);
    });
  }

  /** Removes a coin, increments the counter, and updates the HUD. @param {number} index */
  collectCoin(index) {
    this.coinCount++;
    this.playAudio(this.coin_sound);
    this.coinBar.setPercentage(
      Math.min((this.coinCount / this.maxCoins) * 100, 100),
    );
    this.level.coins.splice(index, 1);
  }

  /** Checks for character overlap with ground bottles and picks them up. */
  checkBottlePickups() {
    this.level.bottlesOnGround.forEach((bottle, i) => {
      if (
        this.character.isColliding(bottle) &&
        this.bottleCount < this.maxBottles
      )
        this.pickupBottle(i);
    });
  }

  /** Removes a ground bottle, increments the counter, and updates the HUD. @param {number} index */
  pickupBottle(index) {
    this.bottleCount++;
    this.playAudio(this.bottle_pickup_sound);
    this.bottleBar.setPercentage((this.bottleCount / this.maxBottles) * 100);
    this.level.bottlesOnGround.splice(index, 1);
  }

  /** Activates the endboss when the character crosses x = 1800. */
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

  /** Starts the boss intro overlay sequence and plays the intro sound. */
  triggerEndbossIntro() {
    if (this.endbossIntroDone) return;
    this.playAudio(this.boss_intro_sound);
    this.endbossIntroActive = true;
    this.introAlpha = 0;
    this.introPhase = "in";
    this.introTimer = 0;
  }

  /** Advances the intro animation state machine each draw frame. */
  updateIntro() {
    if (!this.endbossIntroActive) return;
    this.introTimer++;
    if (this.introPhase === "in") this.updateIntroFadeIn();
    else if (this.introPhase === "hold") this.updateIntroHold();
    else if (this.introPhase === "out") this.updateIntroFadeOut();
  }

  /** Fades the intro overlay in until fully opaque, then transitions to "hold". */
  updateIntroFadeIn() {
    this.introAlpha = Math.min(this.introAlpha + 0.05, 1);
    if (this.introAlpha >= 1) {
      this.introPhase = "hold";
      this.introTimer = 0;
    }
  }

  /** Holds the intro overlay for ~70 frames, then transitions to "out". */
  updateIntroHold() {
    if (this.introTimer > 70) {
      this.introPhase = "out";
      this.introTimer = 0;
    }
  }

  /** Fades the intro overlay out until transparent, then marks it as done. */
  updateIntroFadeOut() {
    this.introAlpha = Math.max(this.introAlpha - 0.04, 0);
    if (this.introAlpha <= 0) {
      this.endbossIntroActive = false;
      this.endbossIntroDone = true;
    }
  }

  /** Placeholder overridden by world-draw.js via prototype extension. */
  draw() {}
}
