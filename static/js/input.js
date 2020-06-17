class Input {

  constructor(canvas) {
    this.up = false;
    this.down = false;
    this.left = false;
    this.right = false;
    // canvas.element.addEventListener('keydown', (key) => { this.handleKeyPress(key) });
    // canvas.element.addEventListener('keyup', (key) => { this.handleKeyPress(key) });
    window.addEventListener('keydown', (key) => { this.handleKeyPress(key) });
    window.addEventListener('keyup', (key) => { this.handleKeyUp(key) });
  }

  handleKeyPress(key) {
    switch (key.keyCode) {
      case 37:
        this.left = true;
        break;
      case 38:
        this.up = true;
        break;
      case 39:
        this.right = true;
        break;
      case 40:
        this.down = true;
        break;
    }
  }

  handleKeyUp(key) {
    switch (key.keyCode) {
      case 37:
        this.left = false;
        break;
      case 38:
        this.up = false;
        break;
      case 39:
        this.right = false;
        break;
      case 40:
        this.down = false;
        break;
    }
  }

  isUp() {
    return this.up && !this.down;
  }

  isDown() {
    return this.down && !this.up;
  }

  isLeft() {
    return this.left && !this.right;
  }

  isRight() {
    return this.right && !this.left;
  }
}

export { Input };