class Coin extends MovableObject {
  height = 80;
  width = 80;

  // Sorgt dafür, dass Pepe die Münze "mittig" treffen muss
  offset = {
    top: 25,
    bottom: 25,
    left: 25,
    right: 25,
  };

  IMAGES = ["img/8_coin/coin_1.png", "img/8_coin/coin_2.png"];

  constructor(x, y) {
    super().loadImage("img/8_coin/coin_1.png");
    this.loadImages(this.IMAGES);
    this.x = x;
    this.y = y || 280;
    this.animate();
  }

  animate() {
    setInterval(() => {
      this.playAnimation(this.IMAGES);
    }, 300);
  }
}
