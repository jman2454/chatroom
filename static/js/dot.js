import { Vector } from './vector.js';

class Dot {
  constructor(x, y, r) {
    this.pos = new Vector(x, y);
    this.radius = r;
    this.vel = new Vector(0, 0);
    this.style = "green";
    this.mass = Math.pow(1.2, r);
  }

  draw(canvas) {
    var oldstyle = canvas.canvas.fillStyle;
    canvas.canvas.fillStyle = this.style;
    canvas.canvas.strokeStyle = oldstyle;
    canvas.canvas.beginPath();
    canvas.canvas.ellipse(this.pos.getX(), canvas.height - this.pos.getY(), this.radius, this.radius, 0, 0, 2 * Math.PI);
    canvas.canvas.stroke();
    canvas.canvas.fillStyle = oldstyle;
    canvas.canvas.strokeStyle = oldstyle;
  }

  setStyle(style) {
    this.style = style;
  }

  getStyle() {
    return this.style;
  }

  setVelocity(vx, vy) {
    this.vel.setVal(vx, vy);
    if (vx == vy && vx === 0) {
      this.mass = 1000000000000000000000;
    }
  }

  getVelocity() {
    return this.vel;
  }

  stationary() {
    return this.vel.getX() === 0 && this.vel.getY() === 0;
  }

  setX(x) {
    this.pos.x = x;
  }

  setY(y) {
    this.pos.y = y;
  }

  setPos(vector2, y) {
    this.pos.setVal(vector2, y);
  }

  getPos() {
    return this.pos;
  }

  update(delta) {
    var m = new Vector(0, 0);
    m.setVal(this.vel).times(delta * 60);
    this.pos.add(m);
  }

  goBack(delta) {
    this.pos.sub(this.vel);
  }

  distance(dot2) {
    var res = new Vector(0, 0);
    res.setVal(this.pos);
    res.sub(dot2.pos);
    return res.length();
  }

  collides(dot2) {
    return (dot2 != this && this.distance(dot2) <= this.radius + dot2.radius);
  }
}

export { Dot };