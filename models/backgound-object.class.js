/**
 * Represents a static background layer tile used for parallax scrolling.
 */
class BackgroundObject extends MovableObject {
  width = 720;
  height = 480;

  /**
   * @param {string} imagePath - Path to the background layer image.
   * @param {number} x - Horizontal start position of the tile.
   */
  constructor(imagePath, x) {
    super().loadImage(imagePath);
    this.x = x;
    this.y = 480 - this.height;
  }
}
