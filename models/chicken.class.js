/**
 * Represents a standard chicken enemy that walks left until stomped or hit.
 */
class Chicken extends MovableObject {
  y = 350;
  height = 80;
  width = 80;
  IMAGES_WALKING = [
    "img/3_enemies_chicken/chicken_normal/1_walk/1_w.png",
    "img/3_enemies_chicken/chicken_normal/1_walk/2_w.png",
    "img/3_enemies_chicken/chicken_normal/1_walk/3_w.png",
  ];
  IMAGES_DEAD = ["img/3_enemies_chicken/chicken_normal/2_dead/dead.png"];

  constructor() {
    super().loadImage("img/3_enemies_chicken/chicken_normal/1_walk/1_w.png");
    this.loadImages(this.IMAGES_WALKING);
    this.loadImages(this.IMAGES_DEAD);
    this.x = 400 + Math.random() * 1800;
    this.speed = 0.15 + Math.random() * 0.5;
    this.animate();
  }

  /**
   * Starts movement and animation loops for the chicken.
   * Switches to the dead image when energy reaches zero.
   */
  animate() {
    setInterval(() => {
      if (!this.isDead()) this.moveLeft();
    }, 1000 / 60);
    setInterval(() => {
      this.playAnimation(
        this.isDead() ? this.IMAGES_DEAD : this.IMAGES_WALKING,
      );
    }, 1000 / 10);
  }
}
