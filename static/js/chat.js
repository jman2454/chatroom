const io = require('socket.io-client');

$(document).ready(function () {
  $("#send").click(function () {
    $("#msgs").html($("#msgs").html() + $("#msgbox").val());
  })
})