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
    this.INDICATOR_WIDTH = width/5;
    this.INDICATOR_HEIGHT = height/15;
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
    if (obj.indicators) {
      // for (const [idx, ind] in obj.indicators) { // this might not have a deterministic order so would have to fix that later
      //   console.log('test1-----------------------------------------');
      //   var offset = idx*this.INDICATOR_WIDTH
      //   this.drawIndicators(idx, ind);
      // }
      this.drawIndicators(obj.indicators.dash, 'Dash: ', 0);
      this.drawIndicators(obj.indicators.mode, 'Mode: ', 1);
    }
    // console.log('test2-----------------------------------------');
    this.drawDot(obj.x, obj.y, obj.radius, undefined, true);

    if (obj.shield && obj.shield.active === true) {
      this.drawDot(obj.x, obj.y, obj.shield.radius, undefined, undefined,
        {
          'start': obj.shield.angle - obj.shield.arc / 2,
          'end': obj.shield.angle + obj.shield.arc / 2
        });
    }

    if (obj.melee && obj.melee.active === true) {
      this.drawDot(obj.x, obj.y, obj.melee.radius, undefined, true,
        {
          'start': obj.melee.angle - obj.melee.arc / 2,
          'end': obj.melee.angle + obj.melee.arc / 2
        }, true);
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

  drawDot(x, y, radius, color = 'black', fill = false, angles, tri = false) {
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
    if (fill) {
      this.canvas.arc(x, this.element.height - y, radius, -startAngle,
        -endAngle, true);
      this.canvas.fill();
    } else {
      this.canvas.ellipse(x, this.element.height - y, radius, radius,
        0, -startAngle, -endAngle, true);
      this.canvas.stroke();
    }

    if (tri) {
      this.canvas.beginPath();
      this.canvas.moveTo(x, this.element.height - y);
      this.canvas.lineTo(x + radius * Math.cos(startAngle), this.element.height - (y + radius * Math.sin(startAngle)));
      this.canvas.lineTo(x + radius * Math.cos(endAngle), this.element.height - (y + radius * Math.sin(endAngle)));
      // this.canvas.lineTo(x, this.element.height - y);
      this.canvas.closePath();
      this.canvas.fill();
    }
    // this.canvas.stroke();
    // if (fill) {
    //   this.canvas.fill();
    // }
  }

  drawIndicators(indicator, string, idx) {
    if (string === 'Dash: ') {
      this.drawRect(idx*4*this.INDICATOR_WIDTH, 0, this.INDICATOR_WIDTH, this.INDICATOR_HEIGHT, undefined, undefined, indicator);
      if (indicator) {
        string = string + 'ready';
      } else {
        string = string + 'not ready';
      }
      this.drawText(this.INDICATOR_WIDTH/2, this.INDICATOR_HEIGHT/2, string, 'orange');
    } else if (indicator==='shooting') {
      this.drawRect(idx*4*this.INDICATOR_WIDTH, 0, this.INDICATOR_WIDTH, this.INDICATOR_HEIGHT, 'red', true);
      this.drawText((idx*4*this.INDICATOR_WIDTH) + (this.INDICATOR_WIDTH/2), this.INDICATOR_HEIGHT/2, string+indicator, 'white');
    } else {
      this.drawRect(idx*4*this.INDICATOR_WIDTH, 0, this.INDICATOR_WIDTH, this.INDICATOR_HEIGHT, 'blue', true);
      this.drawText((idx*4*this.INDICATOR_WIDTH) + (this.INDICATOR_WIDTH/2), this.INDICATOR_HEIGHT/2, string+indicator, 'white');
    }
  }

  // resetCanvasSettings() {
  //   this.canvas.lineWidth = 1;
  //   this.canvas.strokeStyle = 'black';
  //   this.fillStyle = 'black';
  // }

  drawText(x,y,string,color) {
    this.canvas.font = "10px Comic Sans MS";
    this.canvas.fillStyle = color;
    this.canvas.textAlign = "center";
    this.canvas.fillText(string, x, y);
  }

  drawRect(x, y, w, h, color = 'gray', fill = true, grad = false) {
    // this.canvas.beginPath();
    // console.log("why diss bish not work");
    // console.log(x);
    // console.log(y);
    // console.log(w);
    // console.log(h);
    // this.canvas.strokeStyle = 'black';
    // this.canvas.strokeRect(x, y, w, h);
    if (grad) {
      var gradient = this.canvas.createLinearGradient(0, 0, w, 0);
      gradient.addColorStop("0", "magenta");
      gradient.addColorStop("0.5" ,"blue");
      gradient.addColorStop("1.0", "red");
      // this.canvas.strokeStyle = gradient;
      // this.canvas.lineWidth = 5;
      this.canvas.fillStyle = gradient;
      fill = true;
      // this.canvas.stroke();
    } else {
      this.canvas.strokeStyle = 'black';
      this.canvas.fillStyle = color;
      // this.canvas.stroke();
    }
    // this.canvas.strokeStyle = 'black';
    this.canvas.stroke();
    if (fill) {
      this.canvas.fillRect(x, y, w, h);
    } else {
    this.canvas.strokeRect(x, y, w, h);
    }
    // this.resetCanvasSettings();
  }

  clear() {
    this.canvas.clearRect(0, 0, this.element.width, this.element.height);
  }

  getHtmlElement() {
    return this.element
  }
}

export { Canvas };