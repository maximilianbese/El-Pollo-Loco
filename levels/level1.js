function createLevel1() {
  level1 = new Level(
    // Enemies
    [
      new Chicken(),
      new SmallChicken(),
      new SmallChicken(),
      new Chicken(),
      new Chicken(),
      new SmallChicken(),
      new Chicken(),
      new Chicken(),
      new Endboss(),
    ],

    // Clouds
    [new Cloud()],

    // Background layers
    [
      new BackgroundObject("img/5_background/layers/air.png", -720),
      new BackgroundObject("img/5_background/layers/3_third_layer/2.png", -720),
      new BackgroundObject(
        "img/5_background/layers/2_second_layer/2.png",
        -720,
      ),
      new BackgroundObject("img/5_background/layers/1_first_layer/2.png", -720),

      new BackgroundObject("img/5_background/layers/air.png", 0),
      new BackgroundObject("img/5_background/layers/3_third_layer/1.png", 0),
      new BackgroundObject("img/5_background/layers/2_second_layer/1.png", 0),
      new BackgroundObject("img/5_background/layers/1_first_layer/1.png", 0),

      new BackgroundObject("img/5_background/layers/air.png", 720),
      new BackgroundObject("img/5_background/layers/3_third_layer/2.png", 720),
      new BackgroundObject("img/5_background/layers/2_second_layer/2.png", 720),
      new BackgroundObject("img/5_background/layers/1_first_layer/2.png", 720),

      new BackgroundObject("img/5_background/layers/air.png", 720 * 2),
      new BackgroundObject(
        "img/5_background/layers/3_third_layer/1.png",
        720 * 2,
      ),
      new BackgroundObject(
        "img/5_background/layers/2_second_layer/1.png",
        720 * 2,
      ),
      new BackgroundObject(
        "img/5_background/layers/1_first_layer/1.png",
        720 * 2,
      ),

      new BackgroundObject("img/5_background/layers/air.png", 720 * 3),
      new BackgroundObject(
        "img/5_background/layers/3_third_layer/2.png",
        720 * 3,
      ),
      new BackgroundObject(
        "img/5_background/layers/2_second_layer/2.png",
        720 * 3,
      ),
      new BackgroundObject(
        "img/5_background/layers/1_first_layer/2.png",
        720 * 3,
      ),
    ],

    // Coins scattered across the level
    [
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
    ],

    // Bottles on ground
    [
      new BottleGround(400),
      new BottleGround(750),
      new BottleGround(1100),
      new BottleGround(1500),
      new BottleGround(1900),
    ],
  );
}

// Initialize level on load
let level1;
createLevel1();
