/**
 * Represents a decorative cloud that drifts slowly to the left.
 */
class Cloud extends MovableObject {
  y = 50;
  height = 250;
  width = 500;

  constructor() {
    super().loadImage("img/5_background/layers/4_clouds/1.png");
    this.x = Math.random() * 500;
    this.animate();
  }

  /**
   * Starts the cloud's continuous leftward drift at its base speed.
   */
  animate() {
    setInterval(() => this.moveLeft(), 1000 / 60);
  }
}
