/**
 * Represents the final boss in the game.
 * Inherits from MovableObject.
 */
class Endboss extends MovableObject {
  height = 400;
  width = 250;
  y = 55;
  energy = 100;
  speed = 3;
  hadFirstContact = false;
  deadAnimDone = false;
  deadFrameIndex = 0;
  world;

  IMAGES_ALERT = [
    "img/4_enemie_boss_chicken/2_alert/G5.png",
    "img/4_enemie_boss_chicken/2_alert/G6.png",
    "img/4_enemie_boss_chicken/2_alert/G7.png",
    "img/4_enemie_boss_chicken/2_alert/G8.png",
    "img/4_enemie_boss_chicken/2_alert/G9.png",
    "img/4_enemie_boss_chicken/2_alert/G10.png",
    "img/4_enemie_boss_chicken/2_alert/G11.png",
    "img/4_enemie_boss_chicken/2_alert/G12.png",
  ];

  IMAGES_WALKING = [
    "img/4_enemie_boss_chicken/1_walk/G1.png",
    "img/4_enemie_boss_chicken/1_walk/G2.png",
    "img/4_enemie_boss_chicken/1_walk/G3.png",
    "img/4_enemie_boss_chicken/1_walk/G4.png",
  ];

  IMAGES_HURT = [
    "img/4_enemie_boss_chicken/4_hurt/G21.png",
    "img/4_enemie_boss_chicken/4_hurt/G22.png",
    "img/4_enemie_boss_chicken/4_hurt/G23.png",
  ];

  IMAGES_DEAD = [
    "img/4_enemie_boss_chicken/5_dead/G24.png",
    "img/4_enemie_boss_chicken/5_dead/G25.png",
    "img/4_enemie_boss_chicken/5_dead/G26.png",
  ];

  /**
   * Initializes the Endboss with images, position and animation.
   */
  constructor() {
    super().loadImage(this.IMAGES_ALERT[0]);
    this.loadImages(this.IMAGES_ALERT);
    this.loadImages(this.IMAGES_WALKING);
    this.loadImages(this.IMAGES_HURT);
    this.loadImages(this.IMAGES_DEAD);
    this.x = 2500;
    this.offset = { top: 50, bottom: 10, left: 40, right: 40 };
    this.animate();
  }

  /**
   * Starts the movement and animation intervals.
   */
  animate() {
    setInterval(() => {
      if (!this.isDead() && this.hadFirstContact && this.world) {
        this.moveTowardsCharacter();
      }
    }, 1000 / 60);
    setInterval(() => this.playBossAnimations(), 150);
  }

  /**
   * Tracks the character and moves the boss accordingly.
   */
  moveTowardsCharacter() {
    let charX = this.world.character.x;
    this.otherDirection = charX > this.x;
    if (Math.abs(this.x - charX) > 10) {
      this.otherDirection ? this.moveRight() : this.moveLeft();
    }
  }

  /**
   * Decides which animation to play based on the boss state.
   */
  playBossAnimations() {
    if (this.isDead()) {
      this.animateDead();
    } else if (this.isHurt()) {
      this.playAnimation(this.IMAGES_HURT);
    } else {
      this.checkStateAndPlayAnim();
    }
  }

  /**
   * Plays either walking or alert animation based on contact.
   */
  checkStateAndPlayAnim() {
    if (this.hadFirstContact) {
      this.playAnimation(this.IMAGES_WALKING);
    } else {
      this.playAnimation(this.IMAGES_ALERT);
    }
  }

  /**
   * Handles the death animation sequence.
   */
  animateDead() {
    if (this.deadAnimDone) return;
    if (this.deadFrameIndex < this.IMAGES_DEAD.length) {
      this.img = this.imageCache[this.IMAGES_DEAD[this.deadFrameIndex]];
      this.deadFrameIndex++;
    } else {
      this.deadAnimDone = true;
      setTimeout(() => typeof showWin === "function" && showWin(), 500);
    }
  }

  /**
   * Decreases energy and increases speed when hit.
   */
  hit() {
    this.energy -= 20;
    if (this.energy < 0) {
      this.energy = 0;
    } else {
      this.lastHit = new Date().getTime();
      this.speed += 0.2;
    }
  }
}
