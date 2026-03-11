class MovableObject {
  x = 120;
  y = 280;
  img;
  height = 150;
  width = 100;
  imageCache = [];

  loadImage(path) {
    this.img = new Image();
    this.img.src = path;
  }

  @param {Array} arr - []

  loadImages(arr) {
    arr.forEach((path) => {
      let img = new Image();
      img.src = path;
      imageCache[path] = path;
    });
  }

  moveRight() {
    console.log("Moving right");
  }
}
