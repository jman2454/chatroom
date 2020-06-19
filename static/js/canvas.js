class Canvas {
  constructor(width, height, name) {
    var c = document.createElement("canvas");
    this.element = c;
    this.canvas = c.getContext("2d");
    c.height = height;
    c.width = width;
    c.id = name;
    c.style.border = "1px solid black";
    this.name = name;
    this.width = width;
    this.height = height;
    document.getElementById("sim").append(c);
  }

  drawObj(obj) {
    // this.canvas.fillStyle = 'black';
    // this.canvas.strokeStyle = 'black';
    // this.canvas.beginPath();
    // // this.canvas.ellipse(250, 250, 20, 20, 0, 0, 2 * Math.PI);
    // // this.canvas.closePath();
    // this.canvas.ellipse(parseInt(player.x), this.element.height - parseInt(player.y), 20, 20, 10, 0, 2 * Math.PI);
    // this.canvas.stroke();
    this.drawDot(obj.x, obj.y, obj.radius, undefined, true);

    if (obj.shield && obj.shield.active === true) {
      this.drawDot(obj.x, obj.y, obj.shield.radius, undefined, undefined,
        {
          'start': obj.shield.angle - obj.shield.arc / 2,
          'end': obj.shield.angle + obj.shield.arc / 2
        });
    }
    // this.drawDot(player.mouseX, player.mouseY, 10);
    if (obj.bullets) {
      obj.bullets.forEach(b => this.drawDot(b.x, b.y, b.radius, undefined, undefined));
    }
  }

  drawRing(obj) {
    this.drawDot(obj.x, obj.y, obj.radius, 'red', true);
  }

  // made this function since I didn't know how to check if the object was a ring or something else,
  // but if we could do that it would prob be mkore efficient (note, would also have to change back in chat.js)
  // drawRing(ring) {
  //   ring.radius = 50;
  //   //this.drawDot(ring.x, ring.y, ring.radius, 'red', true);
  // }

  drawDot(x, y, radius, color = 'black', fill = false, angles) {
    this.canvas.fillStyle = color;
    this.canvas.strokeStyle = 'black';
    this.canvas.beginPath();
    // this.canvas.ellipse(250, 250, 20, 20, 0, 0, 2 * Math.PI);
    // this.canvas.closePath();
    var startAngle = 0;
    var endAngle = 2 * Math.PI;
    if (angles) {
      startAngle = angles.start;
      endAngle = angles.end;
    }
    this.canvas.ellipse(x, this.element.height - y, radius, radius,
      0, -startAngle, -endAngle, true);
    console.log(startAngle);
    console.log(endAngle);
    this.canvas.stroke();
    if (fill) {
      this.canvas.fill();
    }
  }

  clear() {
    this.canvas.clearRect(0, 0, this.element.width, this.element.height);
  }

  getHtmlElement() {
    return this.element
  }
}

export { Canvas };