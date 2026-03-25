class Level {
  enemies;
  clouds;
  backgroundObjects;
  coins;
  bottlesOnGround;
  level_end_x = 2250;

  constructor(
    enemies,
    clouds,
    backgroundObjects,
    coins = [],
    bottlesOnGround = [],
  ) {
    this.enemies = enemies;
    this.clouds = clouds;
    this.backgroundObjects = backgroundObjects;
    this.coins = coins;
    this.bottlesOnGround = bottlesOnGround;
  }
}
