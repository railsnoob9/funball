var app = require('express')()
  , server = require('http').createServer(app)
  , io = require('socket.io').listen(server);

server.listen(8989);

app.get('/', function (req, res) {
  res.sendfile(__dirname + '/express3index.html');
});

io.sockets.on('connection', function (socket) {
  socket.emit('news', { hello: 'world' });
  socket.on('my other event', function (data) {
  	data.my = data.my + "     I ADDED THIS SHIT FROM THE SERVER";
  	data.another = "THIS IS ANOTHER THING";
    console.log(data);
  });
});