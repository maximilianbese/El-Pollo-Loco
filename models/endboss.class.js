class Endboss extends MovableObject {
  height = 400;
  width = 250;
  y = 55;
  energy = 100;
  speed = 3;
  hadFirstContact = false;
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
    this.offset = {
      top: 50,
      bottom: 10,
      left: 40, // Erhöhe diesen Wert, damit Pepe näher ran kann
      right: 40, // Erhöhe diesen Wert ebenfalls
    };
  }

  animate() {
    // 1. Logik & Bewegung (60 FPS für maximale Flüssigkeit)
    setInterval(() => {
      if (this.isDead() || !this.hadFirstContact || !this.world) return;

      let distance =
        this.x - (this.world.character.x + this.world.character.width);
      if (distance > -100) {
        this.moveLeft(); // Nutzt jetzt den Speed von 5 flüssig
      }
    }, 1000 / 60);

    // 2. Animation / Bilderwechsel
    setInterval(() => {
      if (this.isDead()) {
        this.animateDead();
      } else if (this.isHurt()) {
        this.playAnimation(this.IMAGES_HURT);
      } else {
        this.checkStateAndPlayAnim();
      }
    }, 150); // Etwas schnellerer Bilderwechsel für den Speed
  }

  checkStateAndPlayAnim() {
    if (this.hadFirstContact && this.world) {
      let distance =
        this.x - (this.world.character.x + this.world.character.width);
      if (distance > 30) {
        this.playAnimation(this.IMAGES_WALKING);
      } else {
        this.playAnimation(this.IMAGES_ALERT);
      }
    }
  }

  animateDead() {
    if (this.deadAnimDone) return;
    if (this.deadFrameIndex < this.IMAGES_DEAD.length) {
      let path = this.IMAGES_DEAD[this.deadFrameIndex];
      this.img = this.imageCache[path];
      this.deadFrameIndex++;
    } else {
      this.deadAnimDone = true;
      setTimeout(() => showWinScreen(), 500);
    }
  }

  hit() {
    this.energy -= 20;
    if (this.energy < 0) {
      this.energy = 0;
    } else {
      this.lastHit = new Date().getTime();
      // Bei Speed 5 ist er schon extrem schnell, hier nur kleine Steigerung
      this.speed += 0.2;
    }
  }
}
