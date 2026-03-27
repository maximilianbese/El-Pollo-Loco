let level1;

/**
 * Erstellt das Level-Objekt komplett neu.
 * Wird beim ersten Start und bei jedem Neustart aufgerufen.
 */
function createLevel1() {
  level1 = new Level(
    // Gegner (werden bei jedem Aufruf neu instanziiert)
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

    // Wolken
    [new Cloud()],

    // Hintergrund-Ebenen
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

    // Münzen (fixe Positionen)
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

    // Flaschen auf dem Boden (fixe Positionen)
    [
      new BottleGround(400),
      new BottleGround(750),
      new BottleGround(1100),
      new BottleGround(1500),
      new BottleGround(1900),
    ],
  );
}

// Initialer Aufruf beim Laden der Datei
createLevel1();
