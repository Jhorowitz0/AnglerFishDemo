var faceReader = new FaceReader(); // Object for reading emotion
//create a socket connection
var socket;

//SCREEN VALS
var center;

//player specific vals
var emotion = [250,250,250];
var isFlipped = false;

//images
var fish_sprites = {body: null, tail: null};


//server specific vals
var gameState = {};
var lastServerUpdate = 0;
const SERVER_UPDATE_TIME = 1000/10;

//TODO make client-side particles

function preload(){
    // load images into variable fish_sprites
    fish_sprites.body = loadImage('sprites/angler_head.png');
    fish_sprites.tail = loadImage('sprites/angler_tail.png');
}

function setup() {
    createCanvas(windowWidth, windowHeight);
    center = { x: width/2, y: height/2 };
    imageMode(CENTER);

    //I create socket but I wait to assign all the functions before opening a connection
    socket = io({
        autoConnect: false
    });

    //detects a server connection 
    socket.on('connect', onConnect);
    //handles the messages from the server, the parameter is a string
    socket.on('message', onMessage);
    //copy game state from server
    socket.on('state', onStateUpdate);
    //starts socket
    socket.open();
}


function draw() {
    background(0); //paint it black

    push();
    translate(center.x,center.y); // <---- IMPORTANT, for ease, everything in draw will draw with (0,0) as the center of the page. 

    if(gameState == null || gameState.players == null) { return; } //skip drawing if no players

    var myPlayer = gameState.players[socket.id]; //get client info from server

    //fixes some rotational math
    isFlipped = mouseX < center.x; 
    let displace = {x: 0, y: 0}; //no displacement cause client
    drawFish(fish_sprites, myPlayer.angle, displace, isFlipped); //draw client fishie

    var myInterpPos = getInterpPos(myPlayer, Date.now(), lastServerUpdate, SERVER_UPDATE_TIME); //interp client values

    for (var playerId in gameState.players) { //loop through players
        
        if(playerId == socket.id) { continue; } //skip if client

        player = gameState.players[playerId];

        var interpPos = getInterpPos(player, Date.now(), lastServerUpdate, SERVER_UPDATE_TIME); //interp player values
        displace.x = interpPos.x - myInterpPos.x; //change displacement per other player
        displace.y = interpPos.y - myInterpPos.y;


        drawFish(fish_sprites, player.angle, displace, player.isFlipped);
    }

    //send client info to server
    socket.emit('clientUpdate', {
        xDiff: mouseX - center.x,
        yDiff: mouseY - center.y,
        angle: Math.atan2(mouseY-center.y
                        , mouseX-center.x),
        isFlipped: isFlipped,
        emotion: emotion
    });

    pop(); //pop the translate to center
}

//get players face on an interval and update emotion
// setInterval(function() {
//     faceReader.readFace(); //gets emotion from face on campera if there is one
//     emotion = (faceReader.getEmotionColor()); //updates player emotion color
// }, 400);



//connected to the server
function onConnect() {
    if (socket.id) {
        console.log("Connected to the server");
    }
}

//a message from the server
function onMessage(msg) {
    if (socket.id) {
        console.log("Message from server: " + msg);
    }
}

function onStateUpdate(state) {
    if (socket.id) {
        //copy the state locally and the time of the update
        lastServerUpdate = Date.now();
        gameState = state;
    }
}