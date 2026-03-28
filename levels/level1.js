let level1;

/**
 * Creates a fresh Level 1 instance and assigns it to the global `level1` variable.
 * Called on initial load and on every game restart to reset all object state.
 */
function createLevel1() {
  level1 = new Level(
    createEnemies(),
    [new Cloud()],
    createBackgrounds(),
    createCoins(),
    createBottles(),
  );
}

/**
 * Returns all enemy instances for Level 1.
 * @returns {MovableObject[]}
 */
function createEnemies() {
  return [
    new Chicken(),
    new SmallChicken(),
    new SmallChicken(),
    new Chicken(),
    new Chicken(),
    new SmallChicken(),
    new Chicken(),
    new Chicken(),
    new Endboss(),
  ];
}

/**
 * Returns all parallax background layer tiles for Level 1.
 * @returns {BackgroundObject[]}
 */
function createBackgrounds() {
  const layers = [
    "img/5_background/layers/air.png",
    "img/5_background/layers/3_third_layer/{n}.png",
    "img/5_background/layers/2_second_layer/{n}.png",
    "img/5_background/layers/1_first_layer/{n}.png",
  ];
  const tiles = [];
  [
    [-720, 2],
    [0, 1],
    [720, 2],
    [1440, 1],
    [2160, 2],
  ].forEach(([x, n]) => {
    layers.forEach((l) =>
      tiles.push(new BackgroundObject(l.replace("{n}", n), x)),
    );
  });
  return tiles;
}

/**
 * Returns all coin instances at their fixed positions for Level 1.
 * @returns {Coin[]}
 */
function createCoins() {
  return [
    new Coin(300, 300),
    new Coin(500, 250),
    new Coin(700, 300),
    new Coin(900, 200),
    new Coin(1100, 300),
    new Coin(1300, 250),
    new Coin(1500, 300),
    new Coin(1700, 200),
    new Coin(1900, 300),
    new Coin(2100, 250),
  ];
}

/**
 * Returns all ground bottle instances at their fixed positions for Level 1.
 * @returns {BottleGround[]}
 */
function createBottles() {
  return [400, 750, 1100, 1500, 1900].map((x) => new BottleGround(x));
}

createLevel1();
