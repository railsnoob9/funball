var app = require('express')()
  , server = require('http').createServer(app)
  , io = require('socket.io').listen(server);

server.listen(8989);

app.get('/', function (req, res) {
  res.sendfile(__dirname + '/express3index.html');
});

// suppresses heartbeat debug log
// default is 3
io.set('log', 0);

// example of structure of global games array
// var games = [];

// var game = {
//   players: {   
//     red: {
//       address: '0.0.0.0:0000',
//       position: {
//         x: 0,
//         y: 0
//       },
//       moves: []
//     },
//     blue: {
//       address: '0.0.0.0:0000',
//       position: {
//         x: 0,
//         y: 0
//       },
//       moves: []
//     }
//   },
//   index: 1
// };

var players = [];

anything = function (socket) {
    game.players.test(2);
    var address = socket.handshake.address;
    var id = socket.id;
    var unique_address = address.address + ":" + address.port;
    
    // players is an array of socket ids of connected players
    // indexOf searches the array and returns -1 if not found    
    if(players.indexOf(unique_address) == -1)
    {
      console.log("New connection from " + address.address + ":" + address.port + ", with id " + id);
        // this is a new player
        players[players.length] = {:socket;
    }
    else
    {
      console.log("The following has already connected:" + address.address + ":" + address.port + ", with id " + id);
    }

    // sends data back to the client that just connected
    //socket.emit('news', { hello: 'client' });
    // 
    // socket.on('my other event', function (data) {
    //   data.another = "THIS IS ANOTHER THING on the server";
    //   console.log(data);
    // });
};

io.sockets.on('connection', anything);