import { Canvas } from "../js/canvas.js";

const COOLDOWN = 5;

$("#typing").hide();
$("#readyButton").hide();

// var io = require('socket.io-client');
$(document).ready(function () {

  var canvas = new Canvas(500, 500, 'gametest');

  var typingcooldown = COOLDOWN;

  var room = null;

  var linkedGame = $("#linked").val().localeCompare("true") === 0;

  var socket = io.connect(window.location.href.match(/.*:5000/));

  // $.ajax(
  //   {
  //     url: window.location.href + "user",
  //     socketid: socket.id,
  //     success: function (response) {
  //       if (response === "") {
  //         $("#name").html(
  //           '<input id="namebox" placeholder="enter a username"></input>'
  //         );
  //         $("#namebox").on('keyup', function (e) {
  //           if (e.keyCode === 13) {
  //             socket.emit('new user', socket.id, $("#namebox").val());
  //           }
  //         });
  //       } else {
  //         $("#name").html(
  //           "<p>Welcome, " + response + "!</p>"
  //         );
  //       }
  //     }
  //   }
  // );

  $("#name").html(
    '<input id="namebox" placeholder="enter a username"></input>'
  );
  $("#namebox").on('keyup', function (e) {
    if (e.keyCode === 13) {
      socket.emit('new user', socket.id, $("#namebox").val());
    }
  });

  var keyInput = {
    'left': false,
    'right': false,
    'up': false,
    'down': false,
    'shot': false,
    'shield': false,
    'dash': false
  }

  var mouseInput = {
    'mouseX': 0,
    'mouseY': 0
  }

  var mouseDown = function (e) {
    keyInput['shot'] = true
    socket.emit('keypress', socket.id, room, keyInput);
  }

  var mouseUp = function (e) {
    keyInput['shot'] = false
    socket.emit('keypress', socket.id, room, keyInput);
  }

  var down = function (e) {
    switch (e.keyCode) {
      case 65:
        keyInput['left'] = true;
        keyInput['right'] = false;
        break;
      case 87:
        keyInput['up'] = true;
        keyInput['down'] = false;
        break;
      case 68:
        keyInput['right'] = true;
        keyInput['left'] = false;
        break;
      case 83:
        keyInput['down'] = true;
        keyInput['up'] = false;
        break;
      case 32:
        keyInput['dash'] = true;
        break;
      case 16:
        keyInput['shield'] = true;
        break;
    }
    if (e.keyCode === 32 || e.keyCode === 83 || e.keyCode === 87 || e.keyCode === 65
      || e.keyCode === 68 || e.keyCode === 16) {
      socket.emit('keypress', socket.id, room, keyInput);
    }
  }

  var up = function (e) {
    switch (e.keyCode) {
      case 65:
        keyInput['left'] = false;
        break;
      case 87:
        keyInput['up'] = false;
        break;
      case 68:
        keyInput['right'] = false;
        break;
      case 83:
        keyInput['down'] = false;
        break;
      case 32:
        keyInput['dash'] = false;
        break;
      case 16:
        keyInput['shield'] = false;
        break;
    }
    if (e.keyCode === 32 || e.keyCode === 83 || e.keyCode === 87 || e.keyCode === 65
      || e.keyCode === 68 || e.keyCode === 16) {
      socket.emit('keypress', socket.id, room, keyInput);
    }
  }

  function getMousePos(e) {
    var bounds = canvas.getHtmlElement().getBoundingClientRect();
    var x = e.pageX - bounds.x - scrollX;
    var y = e.pageY - bounds.y - scrollY;
    x *= canvas.getHtmlElement().width / bounds.width;
    y *= canvas.getHtmlElement().height / bounds.height;
    mouseInput['mouseX'] = x;
    mouseInput['mouseY'] = y;
  }

  var interval = 0;

  function emitMousePos(mousePos) {
    socket.emit('mousemove', socket.id, room, mousePos);
  }

  function gameSetup() {
    window.addEventListener('keydown', down);
    window.addEventListener('keyup', up);
    window.addEventListener("mousedown", mouseDown);
    window.addEventListener("mouseup", mouseUp);
    $("#gametest").on('mousemove', getMousePos);
    interval = window.setInterval(function () { emitMousePos(mouseInput) }, 50);
  }

  function leaveGame() {
    $("#readyup").html("");
    window.removeEventListener('keyup', up);
    window.removeEventListener('keydown', down);
    window.removeEventListener("mousedown", mouseDown);
    window.removeEventListener("mouseup", mouseUp);
    $("#gametest").off();
    clearInterval(interval);
    socket.emit('leave room', socket.id, room);
    room = null;
  }

  socket.on('connect', function () {
    console.log("connected");
    // socket.emit('new user', socket.id);
  });

  // socket.on('remove handlers', function (id) {
  //   if (id === socket.id) {
  //     leaveGame()
  //   }
  // });

  $("#create").click(function () {
    socket.join($("#sessionid").val());
  })

  socket.on('pull', function (msg) {
    $("#typing").hide();
    $("#msgs").append(msg);
  });

  socket.on('client typing', function (id) {
    if (socket.id.localeCompare(id) !== 0) {
      $("#typing").show();
    }
  });

  socket.on('already registered', function (msg) {
    alert(msg);
  });

  socket.on('new user success', function () {
    if (linkedGame) {
      socket.emit('new room', socket.id, $("#roomid").val());
      linkedGame = false;
    } else {
      $("#name").html(`<div id='session'>
    <input id='sessionid' placeholder="Enter a room ID!"></input>
    <button id='create'>Create/Join Room</button>
  </div>`);
      $("#sessionid").on('keydown', function (e) {
        if (e.keyCode === 13) {
          socket.emit('new room', socket.id, $("#sessionid").val());
        }
      });
      $("#create").click(function () {
        socket.emit('new room', socket.id, $("#sessionid").val());
      });
    }
  });

  // TODO: make easing functions/fade in for speed of dots

  socket.on('joined', function (msg) {
    var obj = JSON.parse(msg);
    var gameLink = window.location.href.match(/.*:5000/);
    $("#msgs").append(obj.msg);
    room = obj.room;
    $("#name").html(`
    Current Room: ` + obj.room + `<br>Game Link: ` + gameLink + `/game/` + room + `<br><button id="leave">Leave Room</button>
    `);
    if (obj.isRunning === false) {
      $("#readyup").html(obj.ready[0] + " / " + obj.ready[1] + " players ready");
      $("#readyButton").html("Ready Up");
      console.log(typeof obj.newUser);
      console.log(typeof socket.id);
      if (obj.newUser === socket.id) {
        $("#readyButton").show();
      }
    }
    $("#leave").click(function () {
      leaveGame();
    });
    $("#txt").html(`
    <input id="msgbox" placeholder="type your message here!"></input>
    `);
    $("#msgbox").on('keydown', function (e) {
      if (e.keyCode >= 65 && e.keyCode <= 90) {
        socket.emit('typing', socket.id, room);
      }
    });
    $("#msgbox").on('keyup', function (e) {
      if (e.keyCode === 13) {
        socket.emit('push', socket.id, $("#msgbox").val());
        $("#msgbox").val("");
      }
    });
    $("#readyButton").click(function () {
      socket.emit('readyup', socket.id, room);
      $("#readyButton").hide();
      // $("#readyButton").click(function () {
      //   socket.emit('unready', socket.id, room);
      //   $("#readyButton").html("Ready Up");
      // });
    });
    gameSetup();
  });

  socket.on('readied', function (msg) {
    var obj = JSON.parse(msg);
    $("#readyup").html(obj.ready + " / " + obj.total + " players ready");
  });

  // socket.on('unreadied', function (msg) {
  //   var obj = JSON.parse(msg);
  //   $("#readyup").html(obj.ready + " / " + obj.total + " players ready");
  //   $("#readyButton").click(function () {
  //     socket.emit('readyup', socket.id, room);
  //     $("#readyButton").html("Unready");
  //     $("#readyButton").click(function () {
  //       socket.emit('unready', socket.id, room);
  //       $("#readyButton").html("Ready Up");
  //     });
  //   });
  // });

  socket.on('game start', function () {
    $("#readyup").html("");
    $("#readyButton").hide();
  });

  // socket.on('disconnect', function () {
  //   socket.emit('leave room', socket.id, room);
  // });

  socket.on('left', function (msg) {
    canvas.clear();
    $("#chat").html("");
    $("#msgs").html(msg);
    $("#name").html(`<div id='session'>
    <input id='sessionid' placeholder="Enter a room ID!"></input>
    <button id='create'>Create/Join Room</button>
  </div>`);
    $("#sessionid").on('keyup', function (e) {
      if (e.keyCode === 13) {
        socket.emit('new room', socket.id, $("#sessionid").val());
      }
    });
    $("#create").click(function () {
      socket.emit('new room', socket.id, $("#sessionid").val());
    });
    // leaveGame();
  });

  socket.on('someone else left', function (msg) {
    $("#msgs").append(msg);
  });

  socket.on('update', function (gameData) {
    var game = JSON.parse(gameData);
    var players = game['players'];
    var ring = game['ring'];
    typingcooldown = Math.max(0, typingcooldown - 0.01666);
    if (typingcooldown === 0) {
      $("#typing").hide();
      typingcooldown = COOLDOWN;
    }
    canvas.clear();
    canvas.drawRing(ring);
    if (room !== null && (players[socket.id]).active === false) {
      leaveGame();
    }
    for (var p in players) {
      if ((players[p]).active === true) {
        canvas.drawObj(players[p]);
      }
    }
  });
})