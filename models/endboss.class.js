class Endboss extends MovableObject {
  height = 400;
  width = 250;
  y = 55;
  energy = 100;
  speed = 0.8;
  hadFirstContact = false;

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

  deadAnimDone = false;
  deadFrameIndex = 0;

  constructor() {
    super().loadImage(this.IMAGES_ALERT[0]);
    this.loadImages(this.IMAGES_ALERT);
    this.loadImages(this.IMAGES_WALKING);
    this.loadImages(this.IMAGES_HURT);
    this.loadImages(this.IMAGES_DEAD);
    this.x = 2500;
    this.animate();
  }

  animate() {
    setInterval(() => {
      if (this.isDead()) {
        this.animateDead();
      } else {
        this.animateAlive();
      }
    }, 200);
  }

  animateDead() {
    if (this.deadAnimDone) return;

    const path = this.IMAGES_DEAD[this.deadFrameIndex];
    this.img = this.imageCache[path];
    this.deadFrameIndex++;

    if (this.deadFrameIndex >= this.IMAGES_DEAD.length) {
      this.deadAnimDone = true;
      setTimeout(() => showWinScreen(), 800);
    }
  }

  animateAlive() {
    if (this.isHurt()) {
      this.playAnimation(this.IMAGES_HURT);
    } else if (this.hadFirstContact) {
      this.playAnimation(this.IMAGES_WALKING);
      this.moveLeft();
    } else {
      this.playAnimation(this.IMAGES_ALERT);
    }
  }

  hit() {
    this.energy -= 20;
    if (this.energy < 0) this.energy = 0;
    this.lastHit = new Date().getTime();
  }
}
