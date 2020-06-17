import { Dot } from './dot.js';
import { Vector } from './vector.js';

class CollisionHandler {
  constructor(width, height) {
    this.width = width;
    this.height = height;
    this.norm = new Vector(0, 0);
  }

  handleBounds(dot) {
    var v1 = dot.getVelocity();
    if (dot.pos.getX() + dot.radius > this.width) {
      dot.setX(this.width - dot.radius);
      dot.setVelocity(-v1.getX(), v1.getY());
    } else if (dot.pos.getX() - dot.radius < 0) {
      dot.setX(dot.radius);
      dot.setVelocity(-v1.getX(), v1.getY());
    }

    if (dot.pos.getY() + dot.radius > this.height) {
      dot.setY(this.height - dot.radius);
      dot.setVelocity(v1.getX(), -v1.getY());
    } else if (dot.pos.getY() - dot.radius < 0) {
      dot.setY(dot.radius);
      dot.setVelocity(v1.getX(), -v1.getY());
    }
  }

  dotCollisions(dots, player) {
    var dist = 0;
    var tot = 0;
    dots.forEach(
      function (dot) {
        if (player.isActive() && dot.collides(player)) {
          this.bounceBack(player, dot);
          dot.setVelocity(this.newVelocity(dot, player));
        }
        dots.forEach(
          function (dot2) {
            if (dot.collides(dot2)) {

              this.bounceBack(dot, dot2);

              var newV1 = this.newVelocity(dot, dot2);
              var newV2 = this.newVelocity(dot2, dot);
              dot.setVelocity(newV1);
              dot2.setVelocity(newV2);

            }
          }, this);
      }, this);
  }

  newVelocity(dot, dot2) {
    var newVelX1 = (dot.getVelocity().getX() * (dot.mass - dot2.mass) + (2 * dot2.mass * dot2.getVelocity().getX())) / (dot.mass + dot2.mass);
    var newVelY1 = (dot.getVelocity().getY() * (dot.mass - dot2.mass) + (2 * dot2.mass * dot2.getVelocity().getY())) / (dot.mass + dot2.mass);
    return new Vector(newVelX1, newVelY1)
  }

  bounceBack(dot, dot2) {
    var tot = dot.radius + dot2.radius;
    this.norm.setVal(dot.getPos());
    this.norm.sub(dot2.getPos());
    var dist = tot - this.norm.length();
    this.norm.normalize();
    this.norm.times(dist * dot2.mass / (dot.mass + dot2.mass));
    dot.getPos().add(this.norm);
    this.norm.normalize();
    this.norm.times(dist * dot.mass / (dot.mass + dot2.mass));
    dot2.getPos().sub(this.norm);
  }
}

export { CollisionHandler };