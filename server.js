//create a web application that uses the express frameworks and socket.io to communicate via http (the web protocol)
var express = require('express');
var creaturelib = require('./creaturelib.js');
var app = express();
var http = require('http').createServer(app);
var io = require('socket.io')(http);

var world = require("./public/world.json");
let xRange = world.bounds.x.max - world.bounds.x.min;
let yRange = world.bounds.y.max - world.bounds.y.min;

//State that is updated across all clients
var gameState = {
    players: {},
    creatures: require("./public/world.json").creatures,
    objects: require("./public/world.json").objects
}

gameState.creatures.forEach(creature => {
    if(creature["type"] == "kelp") creature.obj = new creaturelib.Kelp(creature.x,creature.y,creature.l);
    else if(creature["type"] == "mine") creature.obj = new creaturelib.Mine(creature.x,creature.y,creature.l);
    else if(creature["type"] == "jellyfish"){creature.obj = new creaturelib.JellyFish(creature.x,creature.y,creature.s);}
});

//A player instance is created for every client
class Player {
    constructor() {
        this.isMale = true,
        this.femaleID = null,
        this.numAttached = 0,
        this.attached = {},
        this.x = (Math.random() * xRange) - xRange/2,
        this.y = (Math.random() * yRange) - yRange/2,
        this.angle = 0,
        this.isFlipped = false,
        this.wiggleRate = 0,
        this.vX = 0,
        this.vY = 0,
        this.aX = 0,
        this.aY = 0,
        this.emotion = [50,50,50],
        this.emotionF = null
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
    gameState.players[socket.id] = new Player();


    socket.on('clientUpdate', function(controls) { //xDiff, yDiff, angle, isflipped, emotion
        gameState.players[socket.id].controls = controls;
    });

    socket.on('glowObjectUpdate', newObject => { //if sent a new glow for an object, update that glow
        let obj = gameState.objects[newObject.id];

        let lerpValue = 0.03;
        if(obj.fr < 10) lerpValue = 0.7;

        obj['glow'] = additive_lerp_triple(obj['glow'], newObject.glow, lerpValue);

        if(obj.img == 'vent'){ //if its a vent then update accel according to its glow
            obj.a = (obj['glow'][0])/255 * 2;
            if(obj.a > 2) obj.a = 2;
        }
        gameState.objects[newObject.id] = obj;
    })

    socket.on('attach', id =>{
        gameState.players[id].numAttached += 1;
        gameState.players[id].attached[socket.id] = 1;
        console.log(gameState.players[id].attached);
    });

    socket.on('clientCall', function(callName) { //callname : string
        let player = gameState.players[socket.id]
        socket.broadcast.emit('call', {name: callName, x: player.x, y: player.y } );
    });

    socket.on('disconnect', function () {
        console.log("User disconnected");
        
        let player = gameState.players[socket.id];

        if(player.femaleID != null){ //if the player was attached to another player remove it from them
            gameState.players[player.femaleID].numAttached -= 1; 
            delete gameState.players[player.femaleID].attached[socket.id];
        }

        //if the player had fish attached to them, SET THEM FREE!
        if(!player.isMale){
            for(id in player.attached){
                io.to(id).emit('unattach',player);
            }
        }
        //delete the player object on disconnect
        delete gameState.players[socket.id];
    });
});


//on an interval, update each players position based on their controls. 
setInterval(function() {

    //update the creatures
    gameState.creatures.forEach(creature => {
        creature.obj.update(creature.x, creature.y);
        if(creature["type"] == "jellyfish"){
            creature.y += 3*Math.sin(creature.obj.t);
            // console.log(Math.sin(creature.obj.t));
        }
    });

    //the code below is what dims objects that arnt illuminated
    gameState.objects.forEach(obj => {
        if('glow' in obj) {
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
                    if(p.aY < -500){
                        p.aY = -500;
                    }
                }
                else if(p.aY < 0) p.aY += 1;
                else p.aY == 0;
            }
        });

        //moves player
        if(Math.abs(x) > world.dead_zone) {
            p.vX = x/world.meter*world.player_speed;
            p.vX += p.aX; // adds acceleration

            if(p.vX > 0 && p.x > world.bounds.x.max)
                p.vX = 0;
            if(p.vX < 0 && p.x < world.bounds.x.min)
                p.vX = 0;
        }
        else 
            p.vX = 0;
        
        if(Math.abs(y) > world.dead_zone) {
            p.vY = y/world.meter*world.player_speed;
            p.vY += p.aY; // adds acceleration

            if(p.vY > 0 && p.y > world.bounds.y.max)
                p.vY = 0;
            if(p.vY < 0 && p.y < world.bounds.y.min)
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

}, world.update_time);

//listen to the port 3000
http.listen(3000, function () {
    console.log('listening on *:3000');
});

function isInSquare(x1,y1,x2,y2,w,h){
    let xMin = x2 - (world.scale * w/2);
    let xMax = x2 + (world.scale * w/2);
    let yMin = y2 - (world.scale * h/2);
    let yMax = y2 + (world.scale * h/2);
    return(x1 > xMin && x1 < xMax && y1 > yMin && y1 < yMax);
}

function additive_lerp_triple(triple1, triple2, lerp_value) { //lerp an array
    var triple3 = [0,0,0];
    triple3[0] = additive_lerp(triple1[0],triple2[0], lerp_value);
    triple3[1] = additive_lerp(triple1[1],triple2[1], lerp_value);
    triple3[2] = additive_lerp(triple1[2],triple2[2], lerp_value);
    return triple3;
  }
  
  function additive_lerp(a, b, v) {
    return a+(b*v);
  }