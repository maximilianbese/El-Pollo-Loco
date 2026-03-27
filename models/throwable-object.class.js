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

  constructor(x, y, isLeft) {
    super().loadImage(this.IMAGES_ROTATION[0]);
    this.loadImages(this.IMAGES_ROTATION);
    this.loadImages(this.IMAGES_SPLASH);
    this.x = x;
    this.y = y;
    this.height = 60;
    this.width = 50;
    this.throw(isLeft); // Wir geben die Richtung an die throw-Funktion weiter
  }

  throw(isLeft) {
    this.speedY = 30;
    this.applyGravity();

    // Flugbewegung (X-Achse) basierend auf der Richtung
    this.moveInterval = setInterval(() => {
      if (!this.isSplashing) {
        if (isLeft) {
          this.x -= 12; // Fliegt nach links
        } else {
          this.x += 12; // Fliegt nach rechts
        }
      }
    }, 25);

    // Rotations-Animation
    this.rotationInterval = setInterval(() => {
      if (!this.isSplashing) {
        this.playAnimation(this.IMAGES_ROTATION);
      }
    }, 60);
  }

  splash() {
    if (this.isSplashing) return;
    this.isSplashing = true;

    // Stoppe Bewegung und Rotation sofort
    clearInterval(this.moveInterval);
    clearInterval(this.rotationInterval);

    let frame = 0;
    const splashInterval = setInterval(() => {
      if (frame < this.IMAGES_SPLASH.length) {
        let path = this.IMAGES_SPLASH[frame];
        this.img = this.imageCache[path];
        frame++;
      } else {
        clearInterval(splashInterval);
        this.splashDone = true;
      }
    }, 80);
  }
}
