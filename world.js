

exports.create = function(game) {

	//just for reference { /*up*/38:0, /*down*/40:0, /*left*/37:0, /*right*/39:0 };

	//for blue
	game.players.blue.socket.on('38', function (data){
		console.log("blue says 38 (up) is " + data.directionFromClient);
		game.players.blue.keys[38] = data.directionFromClient;
	});
	game.players.blue.socket.on('40', function (data){
		console.log("blue says 40 (down) is " + data.directionFromClient);
		game.players.blue.keys[40] = data.directionFromClient;
	});
	game.players.blue.socket.on('37', function (data){
		console.log("blue says 37 (left) is " + data.directionFromClient);
		game.players.blue.keys[37] = data.directionFromClient;
	});
	game.players.blue.socket.on('39', function (data){
		console.log("blue says 39 (right) is " + data.directionFromClient);
		game.players.blue.keys[39] = data.directionFromClient;
	});

	//for red
	game.players.red.socket.on('38', function (data){
		console.log("red says 38 (up) is " + data.directionFromClient);
		game.players.red.keys[38] = data.directionFromClient;
	});
	game.players.red.socket.on('40', function (data){
		console.log("red says 40 (down) is " + data.directionFromClient);
		game.players.red.keys[40] = data.directionFromClient;
	});
	game.players.red.socket.on('37', function (data){
		console.log("red says 37 (left) is " + data.directionFromClient);
		game.players.red.keys[37] = data.directionFromClient;
	});
	game.players.red.socket.on('39', function (data){
		console.log("red says 39 (right) is " + data.directionFromClient);
		game.players.red.keys[39] = data.directionFromClient;
	});


	// game.players.blue.socket.on('clientMessage', function (data) {
	// 	console.log("blue says " + data.directionFromClient);
	// });

	// game.players.red.socket.on('clientMessage', function (data) {
	// 	console.log("red says " + data.directionFromClient);
	// });

	console.log("blue address is; " + game.players.blue.unique_address);
	console.log("red address is; " + game.players.red.unique_address);

	game.players.blue.socket.emit('HEROO', { hello: 'WELCOME TO FUNBALL, blue player' });
	game.players.red.socket.emit('HEROO', { hello: 'WELCOME TO FUNBALL, red player' });

	handleGameLoop(game);

};



function handleGameLoop(game)
{
	//while (true)
	for (var i=0;i<10;i++)
	{
		//update game space (i.e. make it smaller)
		game.space.size.width = game.space.size.width -.05;
		game.space.size.height = game.space.size.height -.05;	


		updatePlayerSpeedBasedOnInput(game);

		handlePossibleCollision(game);

		updatePlayerPositions(game);


		//check if game is over
		var isOutsideRed = outerCircleEdgeDetect(game, game.players.red.position.x,game.players.red.position.y);
		var isOutsideBlue = outerCircleEdgeDetect(game, game.players.blue.position.x,game.players.blue.position.y);

		//game is over
		if (checkIfGameOver(game, isOutsideBlue,isOutsideRed)!=0)
		{
			//DO STUFF HERE()?
			break;
		}

	}

}

function handlePossibleCollision(game)
{
	//check if players collided
	iscollision = playerEdgeDetect(game);

	if (iscollision ==1)
	{
		//2d elastic collision
		var distancex = game.players.red.position.x - game.players.blue.position.x;
		var distancey = game.players.red.position.y - game.players.blue.position.y;

		var collisionision_angle = Math.atan2(distancey, distancex);


		var magnitude_1 = Math.sqrt(game.players.red.speed.current.x*game.players.red.speed.current.x+game.players.red.speed.current.y*game.players.red.speed.current.y);
		var magnitude_2 = Math.sqrt(game.players.blue.speed.current.x*game.players.blue.speed.current.x+game.players.blue.speed.current.y*game.players.blue.speed.current.y);
		var direction_1 = Math.atan2(game.players.red.speed.current.y, game.players.red.speed.current.x);
		var direction_2 = Math.atan2(game.players.blue.speed.current.y, game.players.blue.speed.current.x);

		var new_xspeed_1 = magnitude_1*Math.cos(direction_1-collisionision_angle);
		var new_yspeed_1 = magnitude_1*Math.sin(direction_1-collisionision_angle);
		var new_xspeed_2 = magnitude_2*Math.cos(direction_2-collisionision_angle);
		var new_yspeed_2 = magnitude_2*Math.sin(direction_2-collisionision_angle);


		var final_xspeed_1 = ((game.players.red.size.mass-game.players.blue.size.mass)*new_xspeed_1+(game.players.blue.size.mass+game.players.blue.size.mass)*new_xspeed_2)/
			(game.players.red.size.mass+game.players.blue.size.mass);
		var final_xspeed_2 = ((game.players.red.size.mass+game.players.red.size.mass)*new_xspeed_1+(game.players.red.size.mass-game.players.blue.size.mass)*new_xspeed_2)/
			(game.players.red.size.mass+game.players.blue.size.mass);
		var final_yspeed_1 = new_yspeed_1;
		var final_yspeed_2 = new_yspeed_2;

		game.players.red.speed.current.x = Math.cos(collisionision_angle)*final_xspeed_1+Math.cos(collisionision_angle+Math.PI/2)*final_yspeed_1;
		game.players.red.speed.current.y = Math.sin(collisionision_angle)*final_xspeed_1+Math.sin(collisionision_angle+Math.PI/2)*final_yspeed_1;
		game.players.blue.speed.current.x = Math.cos(collisionision_angle)*final_xspeed_2+Math.cos(collisionision_angle+Math.PI/2)*final_yspeed_2;
		game.players.blue.speed.current.y = Math.sin(collisionision_angle)*final_xspeed_2+Math.sin(collisionision_angle+Math.PI/2)*final_yspeed_2;
	}
}

function updatePlayerSpeedBasedOnInput(game)
{

}

function updatePlayerPositions(game)
{

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


function checkIfGameOver(game, isOutsideBlue, isOutsideRed)
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
function playerEdgeDetect(game)
{
	var distancex = game.players.red.position.x - game.players.blue.position.x;
	var distancey = game.players.red.position.y - game.players.blue.position.y;
	
	var totaldistance = Math.sqrt(distancex*distancex + distancey*distancey);
	
	//we know it's a circle, so can just use radius
	//this also assumes that the two players are the same size 
	var radius = game.players.red.size.x;
	
	if (totaldistance <= radius)
		return 1;
	else
		return 0;
};	