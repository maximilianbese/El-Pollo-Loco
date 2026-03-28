/**
 * Extends DrawableObject with physics, collision detection, animation,
 * and movement capabilities for all moving game entities.
 */
class MovableObject extends DrawableObject {
  speed = 0.15;
  otherDirection = false;
  speedY = 0;
  acceleration = 2.5;
  energy = 100;
  lastHit = 0;
  offset = { top: 0, left: 0, right: 0, bottom: 0 };

  /**
   * Applies gravity to the object by reducing `speedY` each tick.
   * ThrowableObjects always fall; others only fall when above ground.
   */
  applyGravity() {
    setInterval(() => {
      if (this.isAboveGround() || this.speedY > 0) {
        this.y -= this.speedY;
        this.speedY -= this.acceleration;
      }
    }, 1000 / 25);
  }

  /**
   * Returns true if the object is above the ground level.
   * ThrowableObjects are always considered above ground.
   * @returns {boolean}
   */
  isAboveGround() {
    return this instanceof ThrowableObject ? true : this.y < 145;
  }

  /**
   * Checks AABB collision between this object and another, respecting offsets.
   * @param {MovableObject} mo - The other object to check against.
   * @returns {boolean}
   */
  isColliding(mo) {
    return (
      this.x + this.width - this.offset.right > mo.x + mo.offset.left &&
      this.y + this.height - this.offset.bottom > mo.y + mo.offset.top &&
      this.x + this.offset.left < mo.x + mo.width - mo.offset.right &&
      this.y + this.offset.top < mo.y + mo.height - mo.offset.bottom
    );
  }

  /**
   * Reduces energy by 10 and records the hit timestamp.
   * Energy is clamped to a minimum of 0.
   */
  hit() {
    this.energy -= 10;
    if (this.energy < 0) this.energy = 0;
    else this.lastHit = new Date().getTime();
  }

  /**
   * Returns true if the object was hit within the last second.
   * @returns {boolean}
   */
  isHurt() {
    return (new Date().getTime() - this.lastHit) / 1000 < 1;
  }

  /**
   * Returns true if the object has no remaining energy.
   * @returns {boolean}
   */
  isDead() {
    return this.energy <= 0;
  }

  /**
   * Advances the animation by one frame, cycling through the given images.
   * @param {string[]} images - Array of image paths to animate through.
   */
  playAnimation(images) {
    let path = images[this.currentImage % images.length];
    this.img = this.imageCache[path];
    this.currentImage++;
  }

  /** Moves the object to the right by its speed. */
  moveRight() {
    this.x += this.speed;
  }

  /** Moves the object to the left by its speed. */
  moveLeft() {
    this.x -= this.speed;
  }

  /** Launches the object upward by setting a positive vertical speed. */
  jump() {
    this.speedY = 20;
  }
}
