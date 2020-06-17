class Vector {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  dotProduct(vector2) {
    return this.x * vector2.x + this.y * vector2.y;
  }

  times(n) {
    this.x *= n;
    this.y *= n;
    return this;
  }

  add(vector2, n) {
    if (n != null) {
      this.x += vector2;
      this.y += n;
    } else {
      this.x += vector2.x;
      this.y += vector2.y;
    }
    return this;
  }

  sub(vector2, n) {
    if (n != null) {
      this.add(-vector2, -n);
    }
    this.add(-vector2.x, -vector2.y);
    return this;
  }

  setVal(vector2, n) {
    if (n != null) {
      this.x = vector2;
      this.y = n;
    } else {
      this.x = vector2.x;
      this.y = vector2.y;
    }
    return this;
  }

  getX() {
    return this.x;
  }

  getY() {
    return this.y;
  }

  length() {
    return Math.pow(this.x * this.x + this.y * this.y, 0.5);
  }

  setX(x) {
    this.x = x;
    return this;
  }

  setY(y) {
    this.y = y;
    return this;
  }

  normalize() {
    if (this.x === 0) {
      this.y = 1;
      return this;
    } else if (this.y === 0) {
      this.x = 1;
      return this;
    }
    var length = this.length();
    this.x = this.x / length;
    this.y = this.y / length;
    return this;
  }
}

export { Vector };