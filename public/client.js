
//facereader object moved to faceReader.js
var soundSystem = new SoundSystem();
//create a socket connection
var socket = null;

//SCREEN VALS
var center;

//player specific vals
var myPlayer = null;
var isMale = true;
var femaleID = null;
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
    "bounds",
    "background_1",
    "background_2",
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
        //unattach player
        socket.on('unattach', onUnattach);
        //starts socket
        socket.open();
    }
    clientSetup();

    draw = function draw(){
        background(10); //paint it black
        
        emotion = utils.lerp_triple(emotion, new_emotion, 0.1); //eases to next emotion
        
        lightingLayer.startRender();

        push();
        translate(center.x,center.y); // <---- IMPORTANT, for ease, everything in draw will draw with (0,0) as the center of the page. 

        if(gameState == null || gameState.players == null) { return; } //skip drawing if no players

        angle = Math.atan2(mouseY-center.y, mouseX-center.x);
        isFlipped = mouseX < center.x;  //flips orientation when needed
        myPlayer = gameState.players[socket.id]; //get client info from server
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

        var myInterpPos = getInterpPos(myPlayer, Date.now(), lastServerUpdate, SERVER_UPDATE_TIME); //interp client values



        let backgroundSize = {x:7800,y:2000};

        //draws bacground
        displace.x = (0 - myInterpPos.x) * 0.8;
        displace.y = (0 - myInterpPos.y) * 0.8;
        image(worldImages["background_2"],displace.x,displace.y,7800 * 0.8 ,2000 * 0.8);

        //draws bacground
        displace.x = (0 - myInterpPos.x) * 0.9;
        displace.y = (0 - myInterpPos.y) * 0.9;
        image(worldImages["background_1"],displace.x,displace.y,7800 * 0.9 ,2000 * 0.9);


        displace = {x: 0, y: 0};

        if(!isMale){ //if theyre not male (or spectating a female), draw female fish
            drawFemaleFish(fish_sprites, myPlayer.angle, displace, isFlipped, myPlayer.wiggleRate, myPlayer.numAttached); //draw client fishie
            lightingLayer.renderLightBeam(displace,myPlayer.angle,1000,800,emotion); //draws client light beam
            lightingLayer.renderPointLight(displace,380,emotion); //draws client point light
            if(femaleID == null){ //making sure its not a male spectating a female
                updateGlow(myPlayer.x,myPlayer.y,300,utils.arrayToColor(emotion)); //updates objects in vision
                updateGlowCone(myPlayer.x,myPlayer.y,myPlayer.angle,utils.arrayToColor(emotion)); 
            }
        }
        else{ //if theyre male and not attached draw male fishie
            if(femaleID == null){
                emotion = [150,150,150];
                drawMaleFish(fish_sprites, myPlayer.angle, displace, isFlipped, myPlayer.wiggleRate);
                lightingLayer.renderPointLight(displace,200,emotion); //draws client point light
                updateGlow(myPlayer.x,myPlayer.y,200,utils.arrayToColor(emotion));
            }
        }

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
                    drawFemaleFish(fish_sprites, player.angle, displace, player.isFlipped, player.wiggleRate, player.numAttached);
                    lightingLayer.renderLightBeam(displace,player.angle,700,500,player.emotion);
                    lightingLayer.renderPointLight(displace,50,player.emotion);
                }    
            }
        }

        //draws world objects
        for (var id in gameState.objects){
            let obj = gameState.objects[id];
            let objImg = worldImages[obj.img]; //gets object sprite
            
            //OCCLUSION CHECK HERE: If image o.o.b., don't draw it!
            let dist2Obj = dist(obj.x,obj.y,myInterpPos.x,myInterpPos.y) - max(obj.w*worldScale,obj.h*worldScale) - 100;
            if(dist2Obj > max(windowWidth,windowHeight)) {
                continue;
            }

            displace.x = obj.x - myInterpPos.x;
            displace.y = obj.y - myInterpPos.y;
            push();
            translate(displace.x, displace.y);
            

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

        //draws foreground
        displace.x = 0 - myInterpPos.x;
        displace.y = 0 - myInterpPos.y;
        image(worldImages["bounds"],displace.x,displace.y,7800,2000);

        lightingLayer.render(); // Anything drawn past this point goes over lighting!
        fill(255,0,0);
        ellipse(100,0,20,20);
        
        //send client info to server
        if(femaleID == null) { //this disables updating if theyre attached to a female THEY LOSE ALL CONTROL
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

            myPlayer = gameState.players[socket.id]; //get client info from server
    
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

function spawnAsFemale(){
    isMale = false; 
    initFaceApi();
    var buttons = document.getElementById("button_wrapper");
    buttons.remove();
}

function spawnAsMale(){
    isMale = true; 
    initClient();
}

function initClient(){
    let myp5 = new p5(sketch);
    var loadingScreen = document.getElementById("loading");
    loadingScreen.remove();
}

function preload(){
    console.log('p5js preloaded');
    
    objectNames.forEach(name => {
        worldImages[name] = loadImage(sprite_paths[name]);
    });
  
    soundSystem.preload();

    // load images into variable fish_sprites
    fish_sprites.female_head = loadImage(sprite_paths.fish_sprites.female_head);
    fish_sprites.male_head = loadImage(sprite_paths.fish_sprites.male_head);
    fish_sprites.body = loadImage(sprite_paths.fish_sprites.body);
    fish_sprites.tail = loadImage(sprite_paths.fish_sprites.tail);
    fish_sprites.fin = loadImage(sprite_paths.fish_sprites.fin);
    lighting_sprites.beam = loadImage(sprite_paths.lighting_sprites.beam);
    lighting_sprites.point = loadImage(sprite_paths.lighting_sprites.point);

    for(var i=0; i<6; i++) {
        fish_sprites.female_head_attached.push(loadImage(sprite_paths.fish_sprites.female_head_attached[i]));
    }
}

function setup() {
    createCanvas(windowWidth, windowHeight);
    background(10,0,0);
    soundSystem.startBacktrack();
}

function draw() {
}

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
    let minPan = 800;   //Distances for where panning occurs
    let panDist = 500;
    let minVol = 1000;  //Distances for where volume change occurs
    let volDist = 600;

    myPlayer = gameState.players[socket.id]; //get client info from server
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
    if(abs(xDifference) < minPan)
        pan = 0;
    else {
        if(xDifference < 0)
            xDifference += minPan;
        else /* xDifference > 0 */
            xDifference -= minPan;
        pan = constrain(xDifference/panDist, -1, 1);
    }

    //CALCULATE VOL VALUE
    var vol;
    let distance = dist(myPlayer.x, myPlayer.y, otherPlayer.x, otherPlayer.y);
    distance = constrain(distance - minVol, 0, distance);
    vol = constrain(distance/volDist, 0, 1);
    vol = 1 - vol;

    soundSystem.playCall(input.name, vol, pan);
}

function onUnattach(id){
    console.log('youre FREE!');
    myPlayer = gameState.players[socket.id];
    let female = gameState.players[femaleID];
    isMale = true;
    myPlayer.x = female.x;
    myPlayer.y = female.y;
    myPlayer.femaleID = null;
    socket.emit('clientUpdate', {
        isMale: true,
        femaleID: null,
        xDiff: mouseX - center.x,
        yDiff: mouseY - center.y,
        angle: Math.atan2(mouseY-center.y
                        , mouseX-center.x),
        isFlipped: isFlipped,
        emotion: emotion,
        wiggleRate: wiggleRate
    });
    isMale = true;
    femaleID = null;
}

function onStateUpdate(state) {
    if (socket.id) {
        //copy the state locally and the time of the update
        lastServerUpdate = Date.now();
        gameState = state;
    }
}

function updateGlow(x,y,r,glowColor){ //finds objects the player is influencing and adds player color to glow
    for(var id = 0; id<gameState.objects.length; id++){
        let obj = gameState.objects[id];
        if(objectNames.includes(obj.img + '_glow')){ //if object has a glow sprite
            let distance = utils.getDistance(x,y,obj.x,obj.y); //if x,y close enough to object
            if(distance<r/2){

                if(obj.img == 'vent'){ //if vent
                    glowColor = color(red(glowColor),0,0); //make it only accept the red glow
                }

                socket.emit('glowObjectUpdate',{ //send new glow for that object to the server
                    glow: utils.ColorToArray(glowColor),
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