
var bgfiles = new BGfiles(); // rocks, props, etc.

var faceReader = new FaceReader(); // Object for reading emotion
//create a socket connection
var socket;

//SCREEN VALS
const WIDTH = 1000;
const HEIGHT = 1000;
var center;

const SERVER_UPDATE_TIME = 1000/10;

//player specific vals
var emotion = [250,250,250];
var pRef = new Player();

//TODO make client-side particles

//server specific vals
var gameState = {};
var lastServerUpdate = 0;

function setup() {

    createCanvas(WIDTH, HEIGHT);
    center = { x: WIDTH/2, y: HEIGHT/2 }

    // pre-load images for rocks, props, etc.
    bgfiles.setupBG();

    imageMode(CENTER);
    fishie = loadImage('sprites/angler_head2.png'); //loading an image to a variable
    fishTail = loadImage('sprites/angler_tail2.png'); //optionally assign a tail image
    lighting = loadImage('sprites/light.png');
    pRef.setImage(fishie);
    pRef.setTailImage(fishTail);
    pRef.setLighting(lighting);

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

    //Start Client player draw function
    var myPlayer = gameState.players[socket.id];

    blendMode(ADD);
    //Lerp myPlayer position
    var now = Date.now();
    var timeSinceUpdate = (now - lastServerUpdate);
    var t = timeSinceUpdate / SERVER_UPDATE_TIME;

    var myPreX = myPlayer.x + myPlayer.vX;
    var myPreY = myPlayer.y + myPlayer.vY;
    var myInterX = lerp(myPlayer.x, myPreX, t);
    var myInterY = lerp(myPlayer.y, myPreY, t);

    // drawing rocks, props, etc.
    bgfiles.drawBG("rock1");
    // ReferenceError: rock1 is not defined
    // when testing with "rock1" (instead of rock1) the image displays fine but I'm having trouble with the coordinates. the image just stays stuck at 0,0 on the client-side
    // not sure how to bring the server-side translate coordinates here

    // drawing fish body
    push();
    translate(center.x, center.y);
    // calculating angle and orientation of fish towards mouse
    let fish_angle = myPlayer.angle;
    if(mouseX < center.x) {
        scale(-1, 1);   
        // override arctan domain of [-90, 90] degrees by flipping across Y-axis
        fish_angle = ((myPlayer.angle < 0 ? -1 : 1) * Math.PI) - myPlayer.angle; 
    } 

    // draw fish body
    rotate(fish_angle * pRef.rotationDampening);
    imageMode(CENTER);
    image(pRef.image, 0, 0, 200, 180);

    // drawing fish tail (optional)
    if(pRef.tailImage != null) {
        translate(-100, 55);
        rotate(fish_angle * pRef.tailRotationDampening);
        imageMode(CENTER);
        image(pRef.tailImage, 0, 0, 200, 180); 
    }
    pop();
    blendMode(NORMAL);
    //End Client Player Draw

    for (var playerId in gameState.players) {

        if(playerId == socket.id) { continue; }

        player = gameState.players[playerId];
        blendMode(ADD);

        //Lerp position vals
        var now = Date.now();
        var timeSinceUpdate = (now - lastServerUpdate);
        var t = timeSinceUpdate / SERVER_UPDATE_TIME;

        var predictedX = player.x + player.vX;
        var predictedY = player.y + player.vY;
        var interX = lerp(player.x, predictedX, t);
        var interY = lerp(player.y, predictedY, t);
        // drawing fish body

        push();
        var displace = { x: interX - myInterX,
                         y: interY - myInterY};
        translate(center.x + displace.x, center.y + displace.y);
        // calculating angle and orientation of fish towards mouse
        let fish_angle = player.angle;

        // draw fish body
        rotate(fish_angle * pRef.rotationDampening);
        imageMode(CENTER);
        image(pRef.image, 0, 0, 200, 180);

        // drawing fish tail (optional)
        if(pRef.tailImage != null) {
            translate(-100, 55);
            rotate(fish_angle * pRef.tailRotationDampening);
            imageMode(CENTER);
            image(pRef.tailImage, 0, 0, 200, 180); 
        }
        pop();
        blendMode(NORMAL);
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