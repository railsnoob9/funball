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
var games = [];

var game = {
  space: {
    size: {
      width: 800/1.6,
      height: 800/1.6
    },
    position: {
    	x: 800/2,
		y: 600/2
    }
  },
  players: {   
    red: {
      unique_address: '0.0.0.0:0000',
      socket: 0,
      position: {
        x: 400,
        y: 120
      },
      speed: {
        x: 0,
        y: 0
      },
      // past moves
      moves: []
    },
    blue: {
      unique_address: '0.0.0.0:0000',
      socket: 0,
      position: {
       x: 400,
       y: 440
      },
      speed: {
        x: 0,
        y: 0
      },      
      moves: []
    }
  }
};

var playersAddresses = [];
var players = [];

anything = function (socket) {    
    var address = socket.handshake.address;
    var id = socket.id;
    var unique_address = address.address + ":" + address.port;
    
    // players is an array of socket ids of connected players
    // indexOf searches the array and returns -1 if not found    
    if(playersAddresses.indexOf(unique_address) == -1)
    {
      console.log("New connection from " + address.address + ":" + address.port + ", with id " + id);
        // this is a new player
        playersAddresses[playersAddresses.length] = unique_address;

        //hacky to just set up two players to test sockets n(') shit(e)
        if (players.length ==0)
        {
          players[players.length] = {
              socket: socket    
          };
          game.players.red.unique_address = unique_address;
          game.players.red.socket = socket;
        }
        else if (players.length ==1)
        {
          players[players.length] = {
              socket: socket    
          };
          game.players.blue.unique_address = unique_address;
          game.players.blue.socket = socket;
        }
    }
    else
    {
      console.log("Already connected:" + address.address + ":" + address.port + ", id " + id);
      console.log(players[playersAddresses.indexOf(unique_address)].socket.id);
    }

    if (players.length==2)
    {
      games[games.length] = require('./world').create(game);  
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