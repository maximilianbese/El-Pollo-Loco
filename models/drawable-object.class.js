/**
 * Base class for all drawable game objects.
 * Handles image loading, caching, and rendering to the canvas.
 */
class DrawableObject {
  img;
  imageCache = {};
  currentImage = 0;
  x = 120;
  y = 280;
  height = 150;
  width = 100;

  /**
   * Loads a single image from the given path into `this.img`.
   * @param {string} path - Relative path to the image file.
   */
  loadImage(path) {
    this.img = new Image();
    this.img.src = path;
  }

  /**
   * Draws the object onto the canvas if the image is fully loaded.
   * @param {CanvasRenderingContext2D} ctx - The canvas rendering context.
   */
  draw(ctx) {
    if (this.img && this.img.complete && this.img.naturalWidth > 0) {
      ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
    }
  }

  /**
   * Preloads an array of images into the image cache for fast animation.
   * @param {string[]} arr - Array of image paths to preload.
   */
  loadImages(arr) {
    arr.forEach((path) => {
      let img = new Image();
      img.src = path;
      this.imageCache[path] = img;
    });
  }
}
