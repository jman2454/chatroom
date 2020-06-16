
// var io = require('socket.io-client');
$(document).ready(function () {

  var socket = io.connect("http://127.0.0.1:5000")

  socket.on('connect', function () {
    socket.send('User connected!');
  })

  socket.on('message', function (msg) {
    $("#msgs").append(msg);
  })

  $("#send").click(function () {
    $("#msgs").html($("#msgs").html() + $("#msgbox").val());
  })
})