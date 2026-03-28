/**
 * Represents a game level and holds all its game objects.
 */
class Level {
  enemies;
  clouds;
  backgroundObjects;
  coins;
  bottlesOnGround;
  level_end_x = 2250;

  /**
   * @param {MovableObject[]} enemies - Array of enemy instances.
   * @param {Cloud[]} clouds - Array of cloud instances.
   * @param {BackgroundObject[]} backgroundObjects - Parallax background layers.
   * @param {Coin[]} [coins=[]] - Collectible coins placed in the level.
   * @param {BottleGround[]} [bottlesOnGround=[]] - Bottles placed on the ground.
   */
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
