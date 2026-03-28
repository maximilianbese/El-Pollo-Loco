/**
 * Displays a HUD status bar (health, bottle, coin, or endboss) on the canvas.
 */
class StatusBar extends DrawableObject {
  IMAGES_HEALTH = [
    "img/7_statusbars/1_statusbar/2_statusbar_health/blue/0.png",
    "img/7_statusbars/1_statusbar/2_statusbar_health/blue/20.png",
    "img/7_statusbars/1_statusbar/2_statusbar_health/blue/40.png",
    "img/7_statusbars/1_statusbar/2_statusbar_health/blue/60.png",
    "img/7_statusbars/1_statusbar/2_statusbar_health/blue/80.png",
    "img/7_statusbars/1_statusbar/2_statusbar_health/blue/100.png",
  ];
  IMAGES_BOTTLE = [
    "img/7_statusbars/1_statusbar/3_statusbar_bottle/orange/0.png",
    "img/7_statusbars/1_statusbar/3_statusbar_bottle/orange/20.png",
    "img/7_statusbars/1_statusbar/3_statusbar_bottle/orange/40.png",
    "img/7_statusbars/1_statusbar/3_statusbar_bottle/orange/60.png",
    "img/7_statusbars/1_statusbar/3_statusbar_bottle/orange/80.png",
    "img/7_statusbars/1_statusbar/3_statusbar_bottle/orange/100.png",
  ];
  IMAGES_COIN = [
    "img/7_statusbars/1_statusbar/1_statusbar_coin/blue/0.png",
    "img/7_statusbars/1_statusbar/1_statusbar_coin/blue/20.png",
    "img/7_statusbars/1_statusbar/1_statusbar_coin/blue/40.png",
    "img/7_statusbars/1_statusbar/1_statusbar_coin/blue/60.png",
    "img/7_statusbars/1_statusbar/1_statusbar_coin/blue/80.png",
    "img/7_statusbars/1_statusbar/1_statusbar_coin/blue/100.png",
  ];
  IMAGES_ENDBOSS = [
    "img/7_statusbars/2_statusbar_endboss/green/green0.png",
    "img/7_statusbars/2_statusbar_endboss/green/green20.png",
    "img/7_statusbars/2_statusbar_endboss/green/green40.png",
    "img/7_statusbars/2_statusbar_endboss/green/green60.png",
    "img/7_statusbars/2_statusbar_endboss/green/green80.png",
    "img/7_statusbars/2_statusbar_endboss/green/green100.png",
  ];
  percentage = 100;

  /**
   * @param {'health'|'bottle'|'coin'|'endboss'} type - Which bar type to render.
   * @param {number} [yPos=0] - Vertical position (ignored for endboss bar).
   */
  constructor(type = "health", yPos = 0) {
    super();
    this.type = type;
    const map = {
      health: this.IMAGES_HEALTH,
      bottle: this.IMAGES_BOTTLE,
      coin: this.IMAGES_COIN,
      endboss: this.IMAGES_ENDBOSS,
    };
    this.IMAGES = map[type];
    this.loadImages(this.IMAGES);
    this.height = 60;
    this.width = 200;
    if (type === "endboss") {
      this.x = 490;
      this.y = 0;
    } else {
      this.x = 30;
      this.y = yPos;
    }
    this.setPercentage(100);
  }

  /**
   * Updates the bar image to reflect the given percentage value.
   * @param {number} percentage - Value between 0 and 100.
   */
  setPercentage(percentage) {
    this.percentage = percentage;
    this.img = this.imageCache[this.IMAGES[this.resolveImageIndex()]];
  }

  /**
   * Maps a percentage to one of six image indices (0–5).
   * @returns {number} Index into the IMAGES array.
   */
  resolveImageIndex() {
    if (this.percentage >= 100) return 5;
    if (this.percentage >= 80) return 4;
    if (this.percentage >= 60) return 3;
    if (this.percentage >= 40) return 2;
    if (this.percentage >= 20) return 1;
    return 0;
  }
}
