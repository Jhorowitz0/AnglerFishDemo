//create a web application that uses the express frameworks and socket.io to communicate via http (the web protocol)
var express = require('express');
var app = express();
var http = require('http').createServer(app);
var io = require('socket.io')(http);

const UPDATE_TIME = 1000/10;
var lastUpdate = Date.now();
var deltaTime = 0;

//Vals for movement of players within our canvas
var deadZone = 100;
var meter = 100;
var playerSpeed = 1;

//Vals for our world. Managed by our server
var world = new World();
//BUILD WORLD OBJECTS HERE

//Entire gamestate will consist of prebuilt objects and player objects
var gameState = {
    players: {},
}

//when a client connects serve the static files in the public directory ie public/index.html
app.use(express.static('public'));

//HANDLING CLIENT FROM CONNECTION [CLIENT SPECIFIC MESSAGE HANDLING]
io.on('connection', function (socket) {
    //this appears in the terminal
    console.log('a user connected');

    //this is sent to the client
    socket.emit('message', 'You are connected!');
    
    gameState.players[socket.id] = {
        x: random(100,WIDTH-100),
        y: random(100,HEIGHT-100),
        angle: 0,
        vX: 0,
        vY: 0,
        light: [250,250,250]
    }

    socket.on('clientUpdate', function(controls) { //xDiff, yDiff, angle, emotion
        gameState.players[socket.id].controls = controls;
    });

    socket.on('disconnect', function () {
        console.log("User disconnected");
        //delete the player object
        delete gameState.players[socket.id];
    });
});

setInterval(function() {

    var now = Date.now();
    deltaTime = (now - lastUpdate) / 1000;
    lastUpdate = now;

    //iterate through the players
    for(var playerId in gameState.players) {
        var p = gameState.players[playerId];

        if (p.controls == null) { continue; }

        var x = p.controls.xDiff;
        var y = p.controls.yDiff;

        //moves player
        if(abs(x) > deadZone || abs(y) > deadZone) {
            p.vX = x/meter*playerSpeed;
            p.vY = y/meter*playerSpeed;
        }

        p.x += p.vX;
        p.y += p.vY;
        p.angle = p.controls.angle;
        p.light = p.controls.emotion;
    }

    io.sockets.emit('state', gameState);

}, UPDATE_TIME);



//listen to the port 3000
http.listen(3000, function () {
    console.log('listening on *:3000');
});