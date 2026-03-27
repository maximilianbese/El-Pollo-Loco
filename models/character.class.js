class Character extends MovableObject {
  height = 280;
  width = 120;
  y = 145;
  speed = 3;

  IMAGES_WALKING = [
    "img/2_character_pepe/2_walk/W-21.png",
    "img/2_character_pepe/2_walk/W-22.png",
    "img/2_character_pepe/2_walk/W-23.png",
    "img/2_character_pepe/2_walk/W-24.png",
    "img/2_character_pepe/2_walk/W-25.png",
    "img/2_character_pepe/2_walk/W-26.png",
  ];

  IMAGES_IDLE = [
    "img/2_character_pepe/1_idle/idle/I-1.png",
    "img/2_character_pepe/1_idle/idle/I-2.png",
    "img/2_character_pepe/1_idle/idle/I-3.png",
    "img/2_character_pepe/1_idle/idle/I-4.png",
    "img/2_character_pepe/1_idle/idle/I-5.png",
    "img/2_character_pepe/1_idle/idle/I-6.png",
    "img/2_character_pepe/1_idle/idle/I-7.png",
    "img/2_character_pepe/1_idle/idle/I-8.png",
    "img/2_character_pepe/1_idle/idle/I-9.png",
    "img/2_character_pepe/1_idle/idle/I-10.png",
  ];

  IMAGES_LONG_IDLE = [
    "img/2_character_pepe/1_idle/long_idle/I-11.png",
    "img/2_character_pepe/1_idle/long_idle/I-12.png",
    "img/2_character_pepe/1_idle/long_idle/I-13.png",
    "img/2_character_pepe/1_idle/long_idle/I-14.png",
    "img/2_character_pepe/1_idle/long_idle/I-15.png",
    "img/2_character_pepe/1_idle/long_idle/I-16.png",
    "img/2_character_pepe/1_idle/long_idle/I-17.png",
    "img/2_character_pepe/1_idle/long_idle/I-18.png",
    "img/2_character_pepe/1_idle/long_idle/I-19.png",
    "img/2_character_pepe/1_idle/long_idle/I-20.png",
  ];

  IMAGES_JUMPING = [
    "img/2_character_pepe/3_jump/J-31.png",
    "img/2_character_pepe/3_jump/J-32.png",
    "img/2_character_pepe/3_jump/J-33.png",
    "img/2_character_pepe/3_jump/J-34.png",
    "img/2_character_pepe/3_jump/J-35.png",
    "img/2_character_pepe/3_jump/J-36.png",
    "img/2_character_pepe/3_jump/J-37.png",
    "img/2_character_pepe/3_jump/J-38.png",
    "img/2_character_pepe/3_jump/J-39.png",
  ];

  IMAGES_HURT = [
    "img/2_character_pepe/4_hurt/H-41.png",
    "img/2_character_pepe/4_hurt/H-42.png",
    "img/2_character_pepe/4_hurt/H-43.png",
  ];

  IMAGES_DEAD = [
    "img/2_character_pepe/5_dead/D-51.png",
    "img/2_character_pepe/5_dead/D-52.png",
    "img/2_character_pepe/5_dead/D-53.png",
    "img/2_character_pepe/5_dead/D-54.png",
    "img/2_character_pepe/5_dead/D-55.png",
    "img/2_character_pepe/5_dead/D-56.png",
    "img/2_character_pepe/5_dead/D-57.png",
  ];

  lastActionTime = new Date().getTime();

  // SOUNDS
  walking_sound = new Audio("audio/walking.mp3");
  jump_sound = new Audio("audio/jump.mp3");
  hurt_sound = new Audio("audio/hurt.mp3");

  constructor() {
    super().loadImage("img/2_character_pepe/1_idle/idle/I-1.png");
    this.loadImages(this.IMAGES_WALKING);
    this.loadImages(this.IMAGES_IDLE);
    this.loadImages(this.IMAGES_LONG_IDLE);
    this.loadImages(this.IMAGES_JUMPING);
    this.loadImages(this.IMAGES_DEAD);
    this.loadImages(this.IMAGES_HURT);
    this.applyGravity();
    this.animate();
  }

  animate() {
    setInterval(() => {
      this.moveCharacter();
    }, 1000 / 60);

    setInterval(() => {
      this.playCharacterAnimations();
    }, 150);
  }

  moveCharacter() {
    if (this.isDead()) {
      this.walking_sound.pause();
      return;
    }

    let isMoving = false;

    if (this.world.keyboard.RIGHT && this.x < this.world.level.level_end_x) {
      this.moveRight();
      this.otherDirection = false;
      this.resetIdleTimer();
      isMoving = true;
    }

    if (this.world.keyboard.LEFT && this.x > 0) {
      this.moveLeft();
      this.otherDirection = true;
      this.resetIdleTimer();
      isMoving = true;
    }

    // --- Gehen Sound Logik ---
    if (isMoving && !this.isAboveGround()) {
      this.playWalkingSound();
    } else {
      this.walking_sound.pause();
    }

    // --- Springen Logik ---
    if (this.world.keyboard.SPACE && !this.isAboveGround()) {
      this.jump();
      this.world.playAudio(this.jump_sound);
      this.resetIdleTimer();
    }

    this.world.camera_x = -this.x + 100;
  }

  /**
   * Spielt den Walking-Sound nur ab, wenn er nicht bereits läuft.
   * Das verhindert das "Stottern" bei 60 FPS.
   */
  playWalkingSound() {
    this.walking_sound.volume = this.world.isMuted
      ? 0
      : this.world.globalVolume;
    if (this.walking_sound.paused) {
      this.walking_sound.play().catch((e) => {});
    }
  }

  hit() {
    this.energy -= 5;
    if (this.energy < 0) {
      this.energy = 0;
    } else {
      this.lastHit = new Date().getTime();
      this.world.playAudio(this.hurt_sound);
    }
  }

  resetIdleTimer() {
    this.lastActionTime = new Date().getTime();
  }

  playCharacterAnimations() {
    if (this.isDead()) {
      this.playAnimation(this.IMAGES_DEAD);
      this.hurt_sound.pause();
    } else if (this.isHurt()) {
      this.playAnimation(this.IMAGES_HURT);
      this.resetIdleTimer();
    } else if (this.isAboveGround()) {
      this.playAnimation(this.IMAGES_JUMPING);
    } else if (this.world.keyboard.RIGHT || this.world.keyboard.LEFT) {
      this.playAnimation(this.IMAGES_WALKING);
    } else {
      this.handleIdleStates();
    }
  }

  handleIdleStates() {
    let now = new Date().getTime();
    let timePassed = now - this.lastActionTime;

    if (timePassed >= 3000) {
      this.playAnimation(this.IMAGES_LONG_IDLE);
    } else {
      this.playAnimation(this.IMAGES_IDLE);
    }
  }

  jump() {
    this.speedY = 20;
  }
}
