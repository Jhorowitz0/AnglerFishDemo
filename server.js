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
    objects:[
        {img:"amm", x:480, y:450, w:450, h:600, 'glow': [0,0,0]},
        {img:"coral1", x:250, y:480, w:330, h:520},
        {img:"coral2", x:120, y:480, w:330, h:560},
        {img:"rock13", x:-800, y:350, w:750, h:750},
        {img:"rock10", x:-300, y:545, w:500, h:200},
        {img:"rock5", x:-600, y:525, w:200, h:200},
        {img:"sub", x:1400, y:400, w:900, h:800},
        {img:"vent", x:0, y:500, w:300, h:2000, a:0, 'glow': [0,0,0]} //a is vents shooting acceleration
    ]
}
var worldScale = 2/3;

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
        isMale: false,
        femaleID: null,
        numAttached: 0,
        x: Math.random(bounds.x.min,bounds.x.max),
        y: Math.random(bounds.y.min,bounds.y.max),
        angle: 0,
        isFlipped: false,
        wiggleRate: 0,
        vX: 0,
        vY: 0,
        aX: 0,
        aY: 0,
        emotion: [50,50,50],
        emotionF: null
    }


    socket.on('clientUpdate', function(controls) { //xDiff, yDiff, angle, isflipped, emotion
        gameState.players[socket.id].controls = controls;
    });

    socket.on('glowObjectUpdate', newObject => { //if sent a new glow for an object, update that glow
        let obj = gameState.objects[newObject.id];

        let lerpValue = 0.03;
        if(obj.fr < 10) lerpValue = 0.5;

        let curGlow = obj['glow']
        let r = curGlow[0] + (newObject.glow[0]) * lerpValue;
        let g = curGlow[1] + (newObject.glow[1]) * lerpValue;
        let b = curGlow[2] + (newObject.glow[2]) * lerpValue;
        if(r > 255) r = 255;
        if(g > 255) g = 255;
        if(b > 255) b = 255;
        obj['glow'] = [r,g,b];

        if(obj.img == 'vent'){ //if its a vent then update accel according to its glow
            obj.a = r/255 * 2;
            if(obj.a > 2) obj.a = 2;
        }
        gameState.objects[newObject.id] = obj;
    })

    socket.on('attach', id =>{
        gameState.players[id].numAttached += 1;
        console.log('player now has ' + gameState.players[id].numAttached + ' fish attached!');
    });

    socket.on('clientCall', function(callName) { //callname : string
        socket.broadcast.emit('call', {name: callName, id: socket.id});
    });

    socket.on('disconnect', function () {
        console.log("User disconnected");
        
        let player = gameState.players[socket.id];
        if(player.femaleID != null){ //if the player was attached
            gameState.players[player.femaleID].numAttached -= 1; //remove it from female
        }
        //delete the player object on disconnect
        delete gameState.players[socket.id];
    });
});


//on an interval, update each players position based on their controls. 
setInterval(function() {

    //the code below is what dims objects that arnt illuminated
    gameState.objects.forEach(obj => {
        if('glow' in obj){
            let glow = obj['glow'];
            let r = (glow[0] - 5)
            if(r < 0) r = 0;
            let g = (glow[1] - 5)
            if(g < 0) g = 0;
            let b = (glow[2] - 5)
            if(b < 0) b = 0;
            obj['glow'] = [r,g,b];

            if(obj.img == 'vent'){
                obj.a = r/255 * 2;
                if(obj.a > 2) obj.a = 2;
            }
        }
    });

    //update each players position based on their controls. 
    var now = Date.now();
    deltaTime = (now - lastUpdate) / 1000;
    lastUpdate = now;

    //iterate through the players
    for(var playerId in gameState.players) {
        var p = gameState.players[playerId];

        if (p.controls == null) { continue; }

        var x = p.controls.xDiff;
        var y = p.controls.yDiff;

        //if there is a vent add acceleration
        gameState.objects.forEach(obj =>{
            if(obj.img == "vent"){
                if(isInSquare(p.x,p.y,obj.x,obj.y,obj.w/2,500)){
                    p.aY -= obj.a;
                }
                else if(p.aY < 0) p.aY += 1;
                else p.aY == 0;
            }
        });

        //moves player
        if(Math.abs(x) > deadZone) {
            p.vX = x/meter*playerSpeed;
            p.vX += p.aX; // adds acceleration

            if(p.vX > 0 && p.x > bounds.x.max)
                p.vX = 0;
            if(p.vX < 0 && p.x < bounds.x.min)
                p.vX = 0;
        }
        else 
            p.vX = 0;
        
        if(Math.abs(y) > deadZone) {
            p.vY = y/meter*playerSpeed;
            p.vY += p.aY; // adds acceleration

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

        p.isMale = p.controls.isMale;

        p.femaleID = p.controls.femaleID;

        p.angle = p.controls.angle;

        p.emotion = p.emotionF;
        
        p.isFlipped = p.controls.isFlipped;

        p.wiggleRate = p.controls.wiggleRate;
    }

    io.sockets.emit('state', gameState);

}, UPDATE_TIME);

//listen to the port 3000
http.listen(3000, function () {
    console.log('listening on *:3000');
});


function getDistance(x1,y1,x2,y2){
    let dX = x2-x1;
    let dY = y2-y1;
    return Math.sqrt(dX*dX + dY*dY);
}

function isInSquare(x1,y1,x2,y2,w,h){
    let xMin = x2 - (worldScale * w/2);
    let xMax = x2 + (worldScale * w/2);
    let yMin = y2 - (worldScale * h/2);
    let yMax = y2 + (worldScale * h/2);
    return(x1 > xMin && x1 < xMax && y1 > yMin && y1 < yMax);
}