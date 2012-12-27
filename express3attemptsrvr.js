var app = require('express')()
  , server = require('http').createServer(app)
  , io = require('socket.io').listen(server);

server.listen(8989);

app.get('/', function (req, res) {
  res.sendfile(__dirname + '/express3index.html');
});

io.sockets.on('connection', function (socket) {
	var address = socket.handshake.address;
    console.log("New connection from " + address.address + ":" + address.port);

    socket.emit('news', { hello: 'client' });
    socket.on('my other event', function (data) {
  		data.directionFromClient = data.directionFromClient + "     Oh shit, red just bumped into you -server";
  		data.another = "THIS IS ANOTHER THING on the server";
    console.log(data);
  });
});