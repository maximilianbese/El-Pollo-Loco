/**
 * Represents the player character "Pepe".
 * Handles movement input, physics, animation states, and sound playback.
 */
class Character extends MovableObject {
  height = 280;
  width = 120;
  y = 145;
  speed = 3;
  offset = { top: 120, bottom: 10, left: 30, right: 30 };
  lastActionTime = new Date().getTime();

  walking_sound = new Audio("audio/walking.mp3");
  jump_sound = new Audio("audio/jump.mp3");
  hurt_sound = new Audio("audio/hurt.mp3");

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

  /**
   * Starts the movement and animation update intervals.
   */
  animate() {
    setInterval(() => this.moveCharacter(), 1000 / 60);
    setInterval(() => this.playCharacterAnimations(), 100);
  }

  /**
   * Processes keyboard input each frame: handles horizontal movement,
   * walking sound, jumping, and camera tracking.
   */
  moveCharacter() {
    if (this.isDead()) {
      this.walking_sound.pause();
      return;
    }
    const isMoving = this.handleHorizontalMovement();
    isMoving && !this.isAboveGround()
      ? this.playWalkingSound()
      : this.walking_sound.pause();
    this.handleJump();
    this.world.camera_x = -this.x + 100;
  }

  /**
   * Moves the character left or right based on keyboard input.
   * @returns {boolean} True if the character moved this frame.
   */
  handleHorizontalMovement() {
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
    return isMoving;
  }

  /**
   * Triggers a jump when SPACE is pressed and the character is on the ground.
   */
  handleJump() {
    if (this.world.keyboard.SPACE && !this.isAboveGround()) {
      this.jump();
      this.world.playAudio(this.jump_sound);
      this.resetIdleTimer();
    }
  }

  /**
   * Plays the walking sound loop, respecting mute and volume settings.
   */
  playWalkingSound() {
    this.walking_sound.volume = this.world.isMuted
      ? 0
      : this.world.globalVolume;
    if (this.walking_sound.paused) this.walking_sound.play().catch(() => {});
  }

  /**
   * Reduces character energy by 5 on a normal hit and plays the hurt sound.
   */
  hit() {
    this.energy -= 5;
    if (this.energy < 0) this.energy = 0;
    else {
      this.lastHit = new Date().getTime();
      this.world.playAudio(this.hurt_sound);
    }
  }

  /** Resets the idle timer to the current time. */
  resetIdleTimer() {
    this.lastActionTime = new Date().getTime();
  }

  /**
   * Chooses the correct animation set based on the character's current state.
   * Priority: dead > hurt > jumping > walking > idle.
   */
  playCharacterAnimations() {
    if (this.isDead()) {
      this.playAnimation(this.IMAGES_DEAD);
      this.hurt_sound.pause();
    } else if (this.isHurt()) {
      this.playAnimation(this.IMAGES_HURT);
      this.resetIdleTimer();
    } else if (this.isAboveGround()) this.playJumpAnimation();
    else if (this.world.keyboard.RIGHT || this.world.keyboard.LEFT)
      this.playAnimation(this.IMAGES_WALKING);
    else this.handleIdleStates();
  }

  /**
   * Selects the jump animation frame matching the current vertical speed.
   * Maps speedY ranges to one of 9 jump frames for smooth visual feedback.
   */
  playJumpAnimation() {
    const thresholds = [15, 10, 5, 0, -5, -10, -15, -20];
    const i = thresholds.findIndex((t) => this.speedY > t);
    this.img = this.imageCache[this.IMAGES_JUMPING[i === -1 ? 8 : i]];
  }

  /**
   * Plays the short idle or long idle animation based on inactivity duration.
   * Long idle triggers after 3 seconds of no movement.
   */
  handleIdleStates() {
    const timePassed = new Date().getTime() - this.lastActionTime;
    this.playAnimation(
      timePassed >= 3000 ? this.IMAGES_LONG_IDLE : this.IMAGES_IDLE,
    );
  }

  /** Sets the vertical speed for a jump. */
  jump() {
    this.speedY = 20;
  }
}
