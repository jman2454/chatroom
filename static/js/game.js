import { Vector } from './vector.js';
import { Dot } from './dot.js';
import { Input } from './input.js';
import { CollisionHandler } from './physics.js';

class Game {
  constructor(canvas) {
    this.lastFrame = 0;
    this.currentFrame = 0;
    this.dots = [];
    this.height = canvas.height;
    this.width = canvas.width;
    this.canvas = canvas.canvas;
    this.canvasobj = canvas;
    this.input = new Input(canvas);
    this.physics = new CollisionHandler(this.width, this.height);
  }

  update(thisFrame) {
    var delta = (thisFrame - this.lastFrame) / 1000;
    this.lastFrame = thisFrame;
    this.handleInput();

    this.dots.forEach(dot => {
      var update = dot.update(delta);
    });

    // this.physics.handleBounds(this.player);
    this.dots.forEach(this.physics.handleBounds, this.physics);
  }

  handleInput() {
    // if (this.input.isUp()) {
    //   this.player.setVelocity(this.player.getVelocity().getX(), 1);
    // } else if (this.input.isDown()) {
    //   this.player.setVelocity(this.player.getVelocity().getX(), -1);
    // } else {
    //   this.player.setVelocity(this.player.getVelocity().getX(), 0);
    // }

    // if (this.input.isLeft()) {
    //   this.player.setVelocity(-1, this.player.getVelocity().getY());
    // } else if (this.input.isRight()) {
    //   this.player.setVelocity(1, this.player.getVelocity().getY());
    // } else {
    //   this.player.setVelocity(0, this.player.getVelocity().getY());
    // }
  }

  draw() {
    this.canvas.clearRect(0, 0, this.width, this.height);
    this.dots.forEach(dot => dot.draw(this.canvasobj));
  }

  loop(thisFrame) {
    this.update(thisFrame);
    this.draw();
    this.currentFrame = window.requestAnimationFrame(this.loop.bind(this));
  }

  start() {
    if (this.currentFrame === 0) {
      this.currentFrame = window.requestAnimationFrame(this.loop.bind(this));
    }
  }

  stop() {
    if (this.currentFrame !== 0) {
      this.graph.restart();
      this.player = null;
      window.cancelAnimationFrame(this.currentFrame);
      this.currentFrame = 0;
    }
  }
}

export { Game };