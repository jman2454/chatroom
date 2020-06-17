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

  draw(player) {
    this.canvas.fillStyle = 'black';
    this.canvas.strokeStyle = 'black';
    this.canvas.beginPath();
    // this.canvas.ellipse(250, 250, 20, 20, 0, 0, 2 * Math.PI);
    // this.canvas.closePath();
    this.canvas.ellipse(parseInt(player.x), this.element.height - parseInt(player.y), 20, 20, 10, 0, 2 * Math.PI);
    this.canvas.stroke();
  }

  clear() {
    this.canvas.clearRect(0, 0, this.element.width, this.element.height);
  }
}

export { Canvas };