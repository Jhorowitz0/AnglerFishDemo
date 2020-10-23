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
var playerSpeed = 2.5;

//Vals for our world. Managed by our server
const WIDTH = 1000;
const HEIGHT = 1000;
var bounds = {
    x: { min: -3000, max: 3000},
    y: { min: -500, max: 500}
}


//Entire gamestate will consist of prebuilt objects and player objects
var gameState = {
    players: {},
    objects:{
        "amm": {x:480, y:450},
        "coral1": {x:250, y:480},
        "coral2": {x:120, y:480},
        "sub": {x:1400, y:400},
        "rock13": {x:-800, y:350},
        "rock10": {x:-600, y:425},
        "rock5": {x:-600, y:525},
    }
}

//when a client connects serve the static files in the public directory ie public/index.html
app.use(express.static('public'));

//HANDLING CLIENT FROM CONNECTION [CLIENT SPECIFIC MESSAGE HANDLING]
io.on('connection', function (socket) {
    //this appears in the terminal
    console.log('a user connected');

    //this is sent to the client
    socket.emit('message', 'You are connected!');
    
    //makes a new player on connect
    gameState.players[socket.id] = {
        x: Math.random(bounds.x.min,bounds.x.max),
        y: Math.random(bounds.y.min,bounds.y.max),
        angle: 0,
        isFlipped: false,
        wiggleRate: 0,
        vX: 0,
        vY: 0,
        emotion: [50,50,50],
        emotionF: null
    }


    socket.on('clientUpdate', function(controls) { //xDiff, yDiff, angle, isflipped, emotion
        gameState.players[socket.id].controls = controls;
    });

    socket.on('disconnect', function () {
        console.log("User disconnected");
        //delete the player object on disconnect
        delete gameState.players[socket.id];
    });
});


//on an interval, update each players position based on their controls. 
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
        if(Math.abs(x) > deadZone) {
            p.vX = x/meter*playerSpeed;

            if(p.vX > 0 && p.x > bounds.x.max)
                p.vX = 0;
            if(p.vX < 0 && p.x < bounds.x.min)
                p.vX = 0;
        }
        else 
            p.vX = 0;
        
        if(Math.abs(y) > deadZone) {
            p.vY = y/meter*playerSpeed;

            if(p.vY > 0 && p.y > bounds.y.max)
                p.vY = 0;
            if(p.vY < 0 && p.y < bounds.y.min)
                p.vY = 0;
        }
        else
            p.vY = 0;

        p.x += p.vX;
        p.y += p.vY;

        //Calculate Color shift
        p.emotionF = p.controls.emotion;

        p.angle = p.controls.angle;

        p.emotion = p.emotionF;
        
        p.isFlipped = p.controls.isFlipped;

        p.wiggleRate = p.controls.wiggleRate;
    }

    io.sockets.emit('state', gameState);

}, UPDATE_TIME);

//Calculate the rgb values indicating the change between these two colors

//listen to the port 3000
http.listen(3000, function () {
    console.log('listening on *:3000');
});