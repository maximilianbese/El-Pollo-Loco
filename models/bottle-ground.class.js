class BottleGround extends MovableObject {
  height = 80;
  width = 60;

  // Schlankere Box für die Flasche
  offset = {
    top: 10,
    bottom: 10,
    left: 25,
    right: 12,
  };

  IMAGES = [
    "img/6_salsa_bottle/1_salsa_bottle_on_ground.png",
    "img/6_salsa_bottle/2_salsa_bottle_on_ground.png",
  ];

  constructor(x) {
    super().loadImage("img/6_salsa_bottle/1_salsa_bottle_on_ground.png");
    this.loadImages(this.IMAGES);
    this.x = x;
    this.y = 360;
  }
}
