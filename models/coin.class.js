/**
 * Represents a collectible coin placed at a fixed position in the level.
 * Animates by cycling between two images.
 */
class Coin extends MovableObject {
  height = 80;
  width = 80;
  offset = { top: 25, bottom: 25, left: 25, right: 25 };
  IMAGES = ["img/8_coin/coin_1.png", "img/8_coin/coin_2.png"];

  /**
   * @param {number} x - Horizontal position of the coin.
   * @param {number} [y=280] - Vertical position of the coin.
   */
  constructor(x, y = 280) {
    super().loadImage("img/8_coin/coin_1.png");
    this.loadImages(this.IMAGES);
    this.x = x;
    this.y = y;
    this.animate();
  }

  /**
   * Cycles through coin images to create a spinning effect.
   */
  animate() {
    setInterval(() => this.playAnimation(this.IMAGES), 300);
  }
}
