import { Canvas } from "../js/canvas.js";

const COOLDOWN = 5;

$("#typing").hide();

// var io = require('socket.io-client');
$(document).ready(function () {

  var canvas = new Canvas(500, 500, 'gametest');

  var typingcooldown = COOLDOWN;

  var room = null;

  var linkedGame = $("#linked").val().localeCompare("true") === 0;

  var socket = io.connect("http://127.0.0.1:5000");

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

  var myInput = {
    'left': false,
    'right': false,
    'up': false,
    'down': false,
    'shot': false
  }

  var down = function (e) {
    switch (e.keyCode) {
      case 37:
        myInput['left'] = true;
        myInput['right'] = false;
        break;
      case 38:
        myInput['up'] = true;
        myInput['down'] = false;
        break;
      case 39:
        myInput['right'] = true;
        myInput['left'] = false;
        break;
      case 40:
        myInput['down'] = true;
        myInput['up'] = false;
        break;
      case 32:
        myInput['shot'] = true;
        break;
    }
    if (e.keyCode === 32 || (e.keyCode >= 37 && e.keyCode <= 40)) {
      socket.emit('keypress' + room, socket.id, myInput, room);
    }
  }

  var up = function (e) {
    switch (e.keyCode) {
      case 37:
        myInput['left'] = false;
        break;
      case 38:
        myInput['up'] = false;
        break;
      case 39:
        myInput['right'] = false;
        break;
      case 40:
        myInput['down'] = false;
        break;
      case 32:
        myInput['shot'] = false;
        break;
    }
    if (e.keyCode === 32 || (e.keyCode >= 37 && e.keyCode <= 40)) {
      socket.emit('keypress' + room, socket.id, myInput, room);
    }
  }

  function gameSetup() {
    window.addEventListener('keydown', down);
    window.addEventListener('keyup', up);
  }

  function leaveGame() {
    window.removeEventListener('keyup', up);
    window.removeEventListener('keydown', down);
  }

  socket.on('connect', function () {
    console.log("connected");
    // socket.emit('new user', socket.id);
  });

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
    $("#msgs").append(obj.msg);
    room = obj.room;
    $("#name").html(`
    Current Room: ` + obj.room + `<br><button id="leave">Leave Room</button>
    `);
    $("#leave").click(function () {
      socket.emit('eep');
      socket.emit('leave room', socket.id, obj.room);
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

    gameSetup();
  });

  // socket.on('disconnect', function () {
  //   socket.emit('leave room', socket.id, room);
  // });

  socket.on('left', function (msg) {
    canvas.clear();
    room = null;
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
    leaveGame();
  });

  socket.on('someone else left', function (msg) {
    $("#msgs").append(msg);
  });

  socket.on('update', function (playerData) {
    typingcooldown = Math.max(0, typingcooldown - 0.01666);
    if (typingcooldown === 0) {
      $("#typing").hide();
      typingcooldown = COOLDOWN;
    }
    if ("{}".localeCompare(playerData) === 0) return;
    var players = JSON.parse(playerData);
    canvas.clear();
    for (var p in players) {
      canvas.draw(players[p]);
    }
  });
})