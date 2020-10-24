var faceReader = new FaceReader(); // Object for reading emotion
var soundSystem = new SoundSystem();
//create a socket connection
var socket;

//SCREEN VALS
var center;

//player specific vals
var isMale = false;
var femaleID = null;
var numAttached = 0;
var emotion = [250,250,250];
var new_emotion = [250,250,250];
var isFlipped = false;
var canCall = true;

//images
var fish_sprites = {
    female_head:null,
    male_head:null,
    body:null,
    fin:null,
    tail:null,
    female_head_attached:[]
};
var lighting_sprites ={beam: null, point: null};


//server specific vals
var gameState = {};
var lastServerUpdate = 0;
const SERVER_UPDATE_TIME = 1000/10;

//TODO make client-side particles
var particleSystem = new ParticleSystem(50);
var lightingLayer = new LightingLayer();


var worldImages = {};
var objectNames = [
    "amm",
    "coral1",
    "coral2",
    "rock1",
    "rock2",
    "rock3",
    "rock4",
    "rock5",
    "rock6",
    "rock7",
    "rock8",
    "rock9",
    "rock10",
    "rock11",
    "rock12",
    "rock13",
    "starfish",
    "sub",
    "torpedo",
    "urchin1",
    "urchin2"
];

function preload(){

    objectNames.forEach(name =>{
        worldImages[name] = loadImage('background/' + name + '.png');
    });

    soundSystem.preload();
    
    // load images into variable fish_sprites
    fish_sprites.female_head = loadImage('./sprites/fish/fish_head_female.png');
    fish_sprites.male_head = loadImage('./sprites/fish/fish_head_male.png');
    fish_sprites.body = loadImage('sprites/fish/fish_body.png');
    fish_sprites.tail = loadImage('sprites/fish/fish_tail.png');
    fish_sprites.fin = loadImage('sprites/fish/fish_fin.png');
    lighting_sprites.beam = loadImage('https://cdn.glitch.com/919c548a-dc12-455f-9f6c-4742a40eff49%2Flight_beam.jpg?v=1602857969217');
    lighting_sprites.point = loadImage('https://cdn.glitch.com/919c548a-dc12-455f-9f6c-4742a40eff49%2Flight_point.jpg?v=1602857533800');

    fish_sprites.female_head_attached.push(loadImage('./sprites/fish/fish_head_female.png'));

    for(let i = 1; i <= 5; i++){
        fish_sprites.female_head_attached.push(
            loadImage('./sprites/fish/fish_head_female_' + i + '.png')
        );
    }

}

function setup() {
    createCanvas(windowWidth, windowHeight);
    center = { x: width/2, y: height/2 };
    imageMode(CENTER);
    rectMode(CENTER);

    soundSystem.startBacktrack();

    lightingLayer.setup(width,height,lighting_sprites);

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
    background(10); //paint it black
    emotion = lerp_triple(emotion, new_emotion, 0.1);

    lightingLayer.startRender();

    push();
    translate(center.x,center.y); // <---- IMPORTANT, for ease, everything in draw will draw with (0,0) as the center of the page. 

    if(gameState == null || gameState.players == null) { return; } //skip drawing if no players

    isFlipped = mouseX < center.x;  //flips orientation when needed
    var myPlayer = gameState.players[socket.id]; //get client info from server

    //if the player is attached to a female, this code basically makes them that female for viewing purposes
    //except they cant control her only watch
    if(femaleID != null){ 

        if(gameState.players[femaleID] != null){
            female = gameState.players[femaleID];
            myPlayer.x = female.x;
            myPlayer.y = female.y;
            myPlayer = gameState.players[femaleID]; //to get the data
            isMale = false; //to draw as female
            emotion = myPlayer.emotion; //to set emotion
            isFlipped = myPlayer.isFlipped; //to set orientation
        }
        else{
            isMale = true;
            femaleID = null;
            myPlayer = gameState.players[socket.id];
        }
    }

    //this wiggles the player based on mouse distance
    let velX = Math.abs(mouseX- center.x);
    let velY = Math.abs(mouseY- center.y);
    let vel = Math.sqrt(Math.pow(velX,2) + Math.pow(velY,2));
    let wiggleRate = lerp(myPlayer.wiggleRate,myPlayer.wiggleRate + (vel/2),0.5); 


    let displace = {x: 0, y: 0}; //no displacement cause client

    if(!isMale){ //if theyre not male (or spectating a female), draw female fish
        drawFemaleFish(fish_sprites, myPlayer.angle, displace, isFlipped, myPlayer.wiggleRate, myPlayer.numAttached); //draw client fishie
        lightingLayer.renderLightBeam(displace,myPlayer.angle,1000,800,emotion); //draws client light beam
        lightingLayer.renderPointLight(displace,380,emotion); //draws client point light
    }
    else{ //if theyre male and not attached draw male fishie
        if(femaleID == null){
            drawMaleFish(fish_sprites, myPlayer.angle, displace, isFlipped, myPlayer.wiggleRate);
            lightingLayer.renderPointLight(displace,200,150); //draws client point light
        }
    }


    var myInterpPos = getInterpPos(myPlayer, Date.now(), lastServerUpdate, SERVER_UPDATE_TIME); //interp client values

    for (var playerId in gameState.players) { //loop through players
        if(playerId == socket.id || playerId == femaleID) { continue; } //skip if client or spectated female
        player = gameState.players[playerId];
        if(player.femaleID != null) {continue;} //if the player is an attached male, dont draw them
        var interpPos = getInterpPos(player, Date.now(), lastServerUpdate, SERVER_UPDATE_TIME); //interp player values
        displace.x = interpPos.x - myInterpPos.x; //change displacement per other player
        displace.y = interpPos.y - myInterpPos.y;


        if(player.isMale){ //if other player is male...draw them
            drawMaleFish(fish_sprites, player.angle, displace, player.isFlipped, player.wiggleRate);
        }
        else{
            if(isMale && femaleID == null){ //if we're a male and were not attached yet...
                let dist = Math.sqrt(Math.pow(displace.x,2) + Math.pow(displace.y,2)); //distance to us
                if(dist < 100){
                    femaleID = playerId;
                    socket.emit('attach',playerId);
                }
            }
            if(player.femaleID == null){ //if theyre a female and not attached to anyone..draw them
                console.log(player.femaleID);
                drawFemaleFish(fish_sprites, player.angle, displace, player.isFlipped, player.wiggleRate, myPlayer.numAttached);
                lightingLayer.renderLightBeam(displace,player.angle,700,500,player.emotion);
                lightingLayer.renderPointLight(displace,50,player.emotion);
            }
        
        }

        
    
    }

    var worldScale = 1.5;

    for (var obj in gameState.objects){
        let name = obj;

        push();
    
        displace.x = gameState.objects[name].x - myInterpPos.x;
        displace.y = gameState.objects[name].y - myInterpPos.y;
        translate(displace.x, displace.y);

        image(worldImages[name], 0, 0, worldImages[name].width /worldScale, worldImages[name].width /worldScale);
        pop();  
    }

    particleSystem.update(myInterpPos);
    particleSystem.draw(myInterpPos);
    lightingLayer.render(); // DON'T DRAW PAST THIS POINT

    //send client info to server
    if(myPlayer.femaleID == null) { //this disables updating if theyre attached to a female THEY LOSE ALL CONTROL
        socket.emit('clientUpdate', {
            isMale: isMale,
            femaleID: femaleID,
            xDiff: mouseX - center.x,
            yDiff: mouseY - center.y,
            angle: Math.atan2(mouseY-center.y
                            , mouseX-center.x),
            isFlipped: isFlipped,
            emotion: emotion,
            wiggleRate: wiggleRate
        });
    }

    pop(); //pop the translate to center
}

// get players face on an interval and update emotion
if(!isMale)setInterval(function() {
    faceReader.readFace(); //gets emotion from face on campera if there is one
    new_emotion = (faceReader.getEmotionColor()); //updates player emotion color
    
}, 200);



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

function mousePressed() {
    if(mouseButton == LEFT && canCall) {
        canCall = false;

        var callName;
        if(isMale) callName = 'maleCall';
        else       callName = faceReader.returnDominant();
        soundSystem.playCall(callName, 1, 0);

        socket.emit('clientCall', callName);

        setTimeout( () => { canCall = true;}, 2000);
    }
}

function lerp_triple(triple1, triple2, lerp_value) {
  var triple3 = [0,0,0];
  triple3[0] = lerp(triple1[0],triple2[0], lerp_value);
  triple3[1] = lerp(triple1[1],triple2[1], lerp_value);
  triple3[2] = lerp(triple1[2],triple2[2], lerp_value);
  return triple3;
}