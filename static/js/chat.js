
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

  socket.on('pull', function (msg) {
    $("#msgs").append(msg);
  });

  $("#msgbox").on('keyup', function (e) {
    if (e.keyCode === 13) {
      socket.emit('push', socket.id, $("#msgbox").val());
      $("#msgbox").val("");
    }
  });

  $("#name").on('keyup', function (e) {
    if (e.keyCode === 13) {
      socket.emit('new user', socket.id, $("#namebox").val());
    }
  });

  socket.on('already registered', function (msg) {
    alert(msg);
  });

  socket.on('new user success', function () {
    $("#name").html("");
  });
})