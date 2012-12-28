

exports.create = function(game) {

	game.players.blue.socket.on('clientMessage', function (data) {
		console.log("blue says " + data.directionFromClient);


	});

	game.players.red.socket.on('clientMessage', function (data) {
		console.log("red says " + data.directionFromClient);


	});

	console.log("blue address is; " + game.players.blue.unique_address);
	console.log("red address is; " + game.players.red.unique_address);

	game.players.blue.socket.emit('HEROO', { hello: 'WELCOME TO FUNBALL, blue player' });
	game.players.red.socket.emit('HEROO', { hello: 'WELCOME TO FUNBALL, red player' });

	handleGameLoop(game);

};



function handleGameLoop(game)
{
	//while (true)
	for (var i=0;i<100;i++)
	{
		//update game space (i.e. make it smaller)
		game.space.size.width = game.space.size.width -.05;
		game.space.size.height = game.space.size.height -.05;	

		var isOutsideRed = outerCircleEdgeDetect(game, game.players.red.position.x,game.players.red.position.y);
		var isOutsideBlue = outerCircleEdgeDetect(game, game.players.blue.position.x,game.players.blue.position.y);

		//game is over
		if (checkIfGameOver(isOutsideBlue,isOutsideRed)!=0)
		{

			break;
		}

	}

}

//determines if player has lost (i.e. outside of gamespace)
function outerCircleEdgeDetect(game, x, y)
{
	var distancex = x - game.space.position.x;
	var distancey = y - game.space.position.y;
	
	var totaldistance = Math.sqrt(distancex*distancex + distancey*distancey);
	
	//we know it's a circle, so can just use radius
	var radius = game.space.size.width/2;
	
	if (totaldistance > radius)
		return 1;
	else
		return 0;
};	


function checkIfGameOver(isOutsideBlue, isOutsideRed)
{

	//blue wins
	if (isOutsideRed && !isOutsideBlue)
	{


		return 1;
	}

	//red wins
	else if (isOutsideBlue && !isOutsideRed)
	{


		return 2;
	}

	//draw
	else if (isOutsideRed && isOutsideBlue)
	{


		return 3;
	}

	//no winner yet
	else
	{

		return 0;
	}

}


//check if players are colliding
function playerEdgeDetect()
{
	var distancex = player.position.x - player2.position.x;
	var distancey = player.position.y - player2.position.y;
	
	var totaldistance = Math.sqrt(distancex*distancex + distancey*distancey);
	
	//we know it's a circle, so can just use radius
	//this also assumes that the two players are the same size 
	var radius = player.size.x;
	
	if (totaldistance <= radius)
		return 1;
	else
		return 0;
};	