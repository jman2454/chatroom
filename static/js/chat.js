import { Canvas } from "../js/canvas.js";

// var io = require('socket.io-client');
$(document).ready(function () {

  var canvas = new Canvas(500, 500, 'gametest');

  var room = null;

  var linkedGame = $("#linked").val().localeCompare("true") === 0;

  var socket = io.connect("http://10.0.0.25:5000");

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
    'down': false
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
    }
    if (e.keyCode >= 37 && e.keyCode <= 40) {
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
    }
    if (e.keyCode >= 37 && e.keyCode <= 40) {
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
    $("#msgs").append(msg);
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

  socket.on('joined', function (msg) {
    var obj = JSON.parse(msg);
    $("#msgs").append(obj.msg);
    room = obj.room;
    $("#name").html(`
    Current Room: ` + obj.room + ` <button id="leave">Leave Room</button>
    `);
    $("#leave").click(function () {
      socket.emit('leave room', socket.id);
    });
    $("#chat").html(`
    <input id="msgbox" placeholder="type your message here!"></input>
    `);
    $("#msgbox").on('keyup', function (e) {
      if (e.keyCode === 13) {
        socket.emit('push', socket.id, $("#msgbox").val());
        $("#msgbox").val("");
      }
    });

    gameSetup();
  });

  socket.on('disconnect', function () {
    socket.emit('leave room', socket.id);
  });

  socket.on('left', function (msg) {
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
    if ("{}".localeCompare(playerData) === 0) return;
    var players = JSON.parse(playerData);
    canvas.clear();
    for (var p in players) {
      canvas.draw(players[p]);
    }
  });
})