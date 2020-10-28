
//facereader object moved to faceReader.js
var soundSystem = new SoundSystem();
//create a socket connection
var socket = null;

//SCREEN VALS
var center;

//player specific vals
var isMale = false;
var femaleID = null;
var numAttached = 0;
var emotion = [255,255,255];
var new_emotion = [255,255,255];
var isFlipped = false;
var canCall = true;
let angle = 0;

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
var gameState = {objects: []};
var lastServerUpdate = 0;
const SERVER_UPDATE_TIME = 1000/10;

//TODO make client-side particles
var particleSystem = new ParticleSystem(50);
var bubbles = new BubbleSystem();
var lightingLayer = new LightingLayer();

var worldScale = 2/3;
var worldImages = {};
var objectNames = [
    "amm","amm_glow",
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
    "urchin2",
    "vent","vent_glow"
];
var displace = {x: 0, y: 0};

let sketch = function(){ //putting our p5 functions in an object allows us to initialize it only when the player is good to go

    function clientSetup(){
        createCanvas(windowWidth, windowHeight);
        center = { x: width/2, y: height/2 };
        imageMode(CENTER);
        rectMode(CENTER);

        lightingLayer.setup(width,height,lighting_sprites);

        //I create socket but I wait to assign all the functions before opening a connection
        socket = io({
            autoConnect: false
        });

        //detects a server connection 
        socket.on('connect', onConnect);
        //handles the messages from the server, the parameter is a string
        socket.on('message', onMessage);
        //handles the messages broadcasted from other clients who are making a call
        socket.on('call', onCall);
        //copy game state from server
        socket.on('state', onStateUpdate);
        //starts socket
        socket.open();
    }
    clientSetup();

    draw = function draw(){
        background(10); //paint it black
        

        emotion = lerp_triple(emotion, new_emotion, 0.1); //eases to next emotion
        
        lightingLayer.startRender();

        push();
        translate(center.x,center.y); // <---- IMPORTANT, for ease, everything in draw will draw with (0,0) as the center of the page. 

        if(gameState == null || gameState.players == null) { return; } //skip drawing if no players

        angle = Math.atan2(mouseY-height/2, mouseX-width/2);
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


        displace = {x: 0, y: 0}; //no displacement cause client

        if(!isMale){ //if theyre not male (or spectating a female), draw female fish
            drawFemaleFish(fish_sprites, myPlayer.angle, displace, isFlipped, myPlayer.wiggleRate, myPlayer.numAttached); //draw client fishie
            lightingLayer.renderLightBeam(displace,myPlayer.angle,1000,800,emotion); //draws client light beam
            lightingLayer.renderPointLight(displace,380,emotion); //draws client point light
            if(femaleID == null){ //making sure its not a male spectating a female
                updateGlow(myPlayer.x,myPlayer.y,300,arrayToColor(emotion)); //updates objects in vision
                updateGlowCone(myPlayer.x,myPlayer.y,myPlayer.angle,arrayToColor(emotion)); 
            }
        }
        else{ //if theyre male and not attached draw male fishie
            if(femaleID == null){
                emotion = [150,150,150];
                drawMaleFish(fish_sprites, myPlayer.angle, displace, isFlipped, myPlayer.wiggleRate);
                lightingLayer.renderPointLight(displace,200,emotion); //draws client point light
                updateGlow(myPlayer.x,myPlayer.y,200,arrayToColor(emotion));
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
                    drawFemaleFish(fish_sprites, player.angle, displace, player.isFlipped, player.wiggleRate, myPlayer.numAttached);
                    lightingLayer.renderLightBeam(displace,player.angle,700,500,player.emotion);
                    lightingLayer.renderPointLight(displace,50,player.emotion);
                }    
            }
        }

        //draws world objects
        for (var id in gameState.objects){
            let obj = gameState.objects[id];
            displace.x = obj.x - myInterpPos.x;
            displace.y = obj.y - myInterpPos.y;
            push();
            translate(displace.x, displace.y);
            let objImg = worldImages[obj.img]; //gets object sprite

            if(obj.img == 'vent'){ //selects the vents and adds bubbles coming out of them
                if(frameCount % 2 == 0){
                    let life = (Math.random() * 10) + 100;
                    let x = random(obj.x-obj.w/5*worldScale,obj.x+obj.w/5*worldScale);
                    let y = random(obj.y-10/2*worldScale,obj.y+10/2*worldScale);
                    bubbles.addBubble(x,y,0,obj.a*-5,life*obj.a/4);
                }
            }

            image(objImg, 0, 0, obj.w*worldScale, obj.h*worldScale); //draws object

            if('glow' in obj){//if the object glows
                objImg = worldImages[obj.img + '_glow']; //get glow image
                lightingLayer.renderImage(objImg,displace,obj.w*worldScale,obj.h*worldScale,color(obj['glow'])); //render glow
            }
            pop();  
        }


        particleSystem.update(myInterpPos);
        particleSystem.draw(myInterpPos);
        bubbles.update();
        bubbles.draw(myInterpPos);

        lightingLayer.render(); // DON'T DRAW PAST THIS POINT

        // fill(255);
        // textSize(32);
        // text(Math.floor(frameRate()), -500, -300); //fps counter
        

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

    mousePressed = function(){
        if(mouseButton == LEFT && canCall && socket) {

            var myPlayer = gameState.players[socket.id]; //get client info from server
    
            //draw some bubs when calling
            for(let i = 0; i < 3; i++){
                let vX = (Math.random() * 2) - 1;
                let vY = (Math.random() * 2) - 1;
                let life = 20 + (Math.random() * 80);
                bubbles.addBubble(myPlayer.x,myPlayer.y,vX,vY,life);
            }
    
            canCall = false;
    
            var callName;
            if(isMale || femaleID != null) callName = 'maleCall';
            else       callName = faceReader.returnDominant();
            soundSystem.playCall(callName, 1, 0);
    
            socket.emit('clientCall', callName);
    
            setTimeout( () => { canCall = true;}, 2000);
        }
    }

    


}

function initClient(){
    let myp5 = new p5(sketch);
    var loadingScreen = document.getElementById("loading");
    loadingScreen.remove();
}

function preload(){
    console.log('p5js preloaded');
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
    background(10,0,0);
    soundSystem.startBacktrack();
}


function draw() {
}

// get players face on an interval and update emotion
if(!isMale)setInterval(function() {
    faceReader.readFace(); //gets emotion from face on campera if there is one
    new_emotion = (faceReader.getEmotionColor()); //updates player emotion color
}, 500);

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

function onCall(input) {
    var myPlayer = gameState.players[socket.id]; //get client info from server
    var otherPlayer = gameState.players[input.id];

    //draw some BUBS
    for(let i = 0; i < 3; i++){
        let vX = (Math.random() * 2) - 1;
        let vY = (Math.random() * 2) - 1;
        let life = 20 + (Math.random() * 80);
        bubbles.addBubble(otherPlayer.x,otherPlayer.y,vX,vY,life);
    }

    //CALCULATE PAN VALUE
    var pan;
    let xDifference = otherPlayer.x - myPlayer.x;
    if(abs(xDifference) < 100)
        pan = 0;
    else {
        if(xDifference < 0)
            xDifference += 100;
        else /* xDifference > 0 */
            xDifference -= 100;
        pan = constrain(xDifference/150, -1, 1);
    }

    //CALCULATE VOL VALUE
    var vol;
    let distance = dist(myPlayer.x, myPlayer.y, otherPlayer.x, otherPlayer.y);
    distance = constrain(distance - 150, 0, distance);
    vol = constrain(distance/250, 0, 1);
    vol = 1 - vol;

    soundSystem.playCall(input.name, vol, pan);
}

function onStateUpdate(state) {
    if (socket.id) {
        //copy the state locally and the time of the update
        lastServerUpdate = Date.now();
        gameState = state;
    }
}

function mousePressed() {
}

function lerp_triple(triple1, triple2, lerp_value) { //lerp an array
  var triple3 = [0,0,0];
  triple3[0] = lerp(triple1[0],triple2[0], lerp_value);
  triple3[1] = lerp(triple1[1],triple2[1], lerp_value);
  triple3[2] = lerp(triple1[2],triple2[2], lerp_value);
  return triple3;
}

function arrayToColor(array){ 
    let r = array[0];
    let g = array[1];
    let b = array[2];
    return color(r,g,b);
}

function ColorToArray(color){
    let r = red(color);
    let g = green(color);
    let b = blue(color);
    return [r,g,b];
}

function getDistance(x1,y1,x2,y2){
    let dX = x2-x1;
    let dY = y2-y1;
    return Math.sqrt(dX*dX + dY*dY);
}


function updateGlow(x,y,r,glowColor){ //finds objects the player is influencing and adds player color to glow
    for(var id = 0; id<gameState.objects.length; id++){
        let obj = gameState.objects[id];
        if(objectNames.includes(obj.img + '_glow')){ //if object has a glow sprite
            let distance = getDistance(x,y,obj.x,obj.y); //if x,y close enough to object
            if(distance<r/2){

                if(obj.img == 'vent'){ //if vent
                    glowColor = color(red(glowColor),0,0); //make it only accept the red glow
                }

                socket.emit('glowObjectUpdate',{ //send new glow for that object to the server
                    glow: ColorToArray(glowColor),
                    id: id,
                    fr: frameRate()
                });
            }
        }
    }
}

function updateGlowCone(x,y,angle,glowColor){ //takes cone values and calles update glow inside that cone "roughly"
    let range = 1000;
    let freq = 4;
    for(let i = 0; i < freq; i++){
        let xpos =  x + Math.cos(angle) * range/4 * i;
        let ypos =  y + Math.sin(angle) * range/4 * i;
        let radius = Math.tan(1) * 100 * i;
        updateGlow(xpos,ypos,radius,glowColor);
    }
}