
// var io = require('socket.io-client');
$(document).ready(function () {

  var socket = io.connect("http://10.0.0.25:5000")

  $.ajax(
    {
      url: window.location.href + "user",
      socketid: socket.id,
      success: function (response) {
        if (response === "") {
          $("#name").html(
            '<input id="namebox" placeholder="enter a username"></input>'
          );
          $("#namebox").on('keyup', function (e) {
            if (e.keyCode === 13) {
              socket.emit('new user', socket.id, $("#namebox").val());
            }
          });
        } else {
          $("#name").html(
            "<p>Welcome, " + response + "!</p>"
          );
        }
      }
    }
  );


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
  });

  socket.on('joined', function (msg) {
    var obj = JSON.parse(msg);
    $("#msgs").append(obj.msg);
    $("#name").html(`
    Current Room: ` + obj.room + `<button id="leave">Leave Room</button>
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
  });

  socket.on('someone else left', function (msg) {
    $("#msgs").append(msg);
  });


})