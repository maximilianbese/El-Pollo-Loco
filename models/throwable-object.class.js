/**
 * Represents a salsa bottle thrown by the character.
 * Flies in an arc and plays a splash animation on impact.
 */
class ThrowableObject extends MovableObject {
  IMAGES_ROTATION = [
    "img/6_salsa_bottle/bottle_rotation/1_bottle_rotation.png",
    "img/6_salsa_bottle/bottle_rotation/2_bottle_rotation.png",
    "img/6_salsa_bottle/bottle_rotation/3_bottle_rotation.png",
    "img/6_salsa_bottle/bottle_rotation/4_bottle_rotation.png",
  ];
  IMAGES_SPLASH = [
    "img/6_salsa_bottle/bottle_rotation/bottle_splash/1_bottle_splash.png",
    "img/6_salsa_bottle/bottle_rotation/bottle_splash/2_bottle_splash.png",
    "img/6_salsa_bottle/bottle_rotation/bottle_splash/3_bottle_splash.png",
    "img/6_salsa_bottle/bottle_rotation/bottle_splash/4_bottle_splash.png",
    "img/6_salsa_bottle/bottle_rotation/bottle_splash/5_bottle_splash.png",
    "img/6_salsa_bottle/bottle_rotation/bottle_splash/6_bottle_splash.png",
  ];
  isSplashing = false;
  splashDone = false;
  broken_bottle_sound = new Audio("audio/bottle_splash.mp3");

  /**
   * @param {number} x - Starting horizontal position.
   * @param {number} y - Starting vertical position.
   * @param {boolean} isLeft - True if thrown to the left.
   */
  constructor(x, y, isLeft) {
    super().loadImage(this.IMAGES_ROTATION[0]);
    this.loadImages(this.IMAGES_ROTATION);
    this.loadImages(this.IMAGES_SPLASH);
    this.x = x;
    this.y = y;
    this.height = 60;
    this.width = 50;
    this.throw(isLeft);
  }

  /**
   * Launches the bottle with physics and starts rotation animation.
   * @param {boolean} isLeft - Direction of the throw.
   */
  throw(isLeft) {
    this.speedY = 25;
    this.applyGravity();
    this.moveInterval = setInterval(() => {
      if (!this.isSplashing) this.x += isLeft ? -12 : 12;
    }, 25);
    this.rotationInterval = setInterval(() => {
      if (!this.isSplashing) this.playAnimation(this.IMAGES_ROTATION);
    }, 60);
  }

  /**
   * Triggers the splash animation and plays the break sound.
   * Clears flight intervals and marks the bottle as done after animation.
   */
  splash() {
    if (this.isSplashing) return;
    this.isSplashing = true;
    clearInterval(this.moveInterval);
    clearInterval(this.rotationInterval);
    this.playSplashSound();
    this.runSplashAnimation();
  }

  /**
   * Applies current world volume settings and plays the bottle-break sound.
   */
  playSplashSound() {
    if (typeof world !== "undefined") {
      this.broken_bottle_sound.volume = world.isMuted ? 0 : world.globalVolume;
    }
    this.broken_bottle_sound.play();
  }

  /**
   * Steps through splash frames via interval and marks splashDone on completion.
   */
  runSplashAnimation() {
    let frame = 0;
    const iv = setInterval(() => {
      if (frame < this.IMAGES_SPLASH.length) {
        this.img = this.imageCache[this.IMAGES_SPLASH[frame++]];
      } else {
        clearInterval(iv);
        this.splashDone = true;
      }
    }, 80);
  }
}
