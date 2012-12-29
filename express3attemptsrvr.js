var app = require('express')()
  , server = require('http').createServer(app)
  , io = require('socket.io').listen(server);

server.listen(8989);

app.get('/', function (req, res) {
  res.sendfile(__dirname + '/express3index.html');
});

app.get('/processing.js', function (req, res) {
  res.sendfile(__dirname + '/processing.js');
});

// suppresses heartbeat debug log
// default is 3
io.set('log', 0);

// example of structure of global games array
var games = [];
var sizeOfCanvasX = 800;
var sizeOfCanvasY = 600;

var globalAccel = .0173;
var globalMax = 100;
var globalMin = -100;



var game = {
  frame: 0,
  //not really necessary, but may be useful
  background: {
  	size: {
  		x: 800,
  		y: 600
  	}
  },
  space: {
    size: {
      width: sizeOfCanvasX/1.6,
      height: sizeOfCanvasX/1.6
    },
    position: {
    	x: sizeOfCanvasX/2,
		y: sizeOfCanvasY/2
    }
  },
  players: {   
    red: {
      keys: { /*up*/38:0, /*down*/40:0, /*left*/37:0, /*right*/39:0 },
      unique_address: '0.0.0.0:0000',
      socket: 0,
      position: {
        x: 400,
        y: 120
      },
	  speed: {
		acceleration: globalAccel,
		//entropy: 0.005,
		entropy:0,
		max: globalMax,
		min: globalMin,
		current: {
			x: 0,
			y: 0
		}
	},
	  size: {
		x: 50,
		y: 50,
		mass: 1
	  },
      // past moves
      moves: []
    },
    blue: {
   	  keys: { /*up*/38:0, /*down*/40:0, /*left*/37:0, /*right*/39:0 },
      unique_address: '0.0.0.0:0000',
      socket: 0,
      position: {
       x: 400,
       y: 440
      },
	  speed: {
		acceleration: globalAccel,
		//entropy: 0.005,
		entropy:0,
		max: globalMax,
		min: globalMin,
		current: {
			x: 0,
			y: 0
		}
	},      
      size: {
		x: 50,
		y: 50,
		mass: 1
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