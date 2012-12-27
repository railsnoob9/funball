var app = require('express')()
  , server = require('http').createServer(app)
  , io = require('socket.io').listen(server);

server.listen(8989);

app.get('/', function (req, res) {
  res.sendfile(__dirname + '/express3index.html');
});

io.set('log', 0);

var games = [];

var game = {
  players: {
    red: {
      address: '0.0.0.0:0000',
      position: {
        x: 0,
        y: 0
      },
      moves: []
    },
    blue: {
      address: '0.0.0.0:0000',
      position: {
        x: 0,
        y: 0
      },
      moves: []
    }
  },
  index: 1
};

io.sockets.on('connection', function (socket) {
    var address = socket.handshake.address;
    var id = socket.id;
    var unique_address = address.address + ":" + address.port;
    console.log("New connection from " + address.address + ":" + address.port + ", with id " + id);

    socket.emit('news', { hello: 'client' });
    socket.on('my other event', function (data) {
  		data.directionFromClient = data.directionFromClient;
  		data.another = "THIS IS ANOTHER THING on the server";
      console.log(data);
    });
});