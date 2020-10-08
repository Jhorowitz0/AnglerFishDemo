

var faceReader = new FaceReader(); // Object for reading emotion
//create a socket connection
var socket;

//SCREEN VALS
const WIDTH = 1000;
const HEIGHT = 1000;
var CENTER;

const SERVER_UPDATE_TIME = 1000/10;

//player specific vals
var emotion = [250,250,250];
var player = new Player();

//TODO make client-side particles

//server specific vals
var gameState = {};
var lastServerUpdate = 0;

function setup() {

    createCanvas(WIDTH, HEIGHT);
    CENTER = { x: WIDTH/2, y: HEIGHT/2 }

    //I create socket but I wait to assign all the functions before opening a connection
    socket = io({
        autoConnect: false
    });

    //detects a server connection 
    socket.on('connect', onConnect);
    //handles the messages from the server, the parameter is a string
    socket.on('message', onMessage);
    //copy game state from server
    socket.on('state', function (s) {
        //copy the state locally and the time of the update
        lastServerUpdate = Date.now();
        gameState = s
    });

    socket.open();

}


function draw() {
    //paint it black
    background(0);

    //DRAW PLAYERS
    if(gameState == null || gameState.players == null) { return; }

    var myPlayer = gameState.players[socket.id];

    for (var playerId in gameState.players) {

    }

    socket.emit('clientUpdate', {
        xDiff: mouseX - center.x,
        yDiff: mouseY - center.y,
        angle: Math.atan2(mouseY-center.y
                        , mouseX-center.x),
        emotion: emotion
    });
}

setInterval(function() {
    faceReader.readFace(); //gets emotion from face on campera if there is one
    emotion = (faceReader.getEmotionColor()); //updates player emotion color
}, 400);



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