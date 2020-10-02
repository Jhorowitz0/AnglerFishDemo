let anglerfish_img, ocean_img; // image assets

var faceReader = new FaceReader(); // Object for reading emotion

var world = new World();// Object for world
world.addObject(new Wall(600,600,55,55)); //added walls
world.addObject(new Wall(50, 50, 40, 70));
world.addObject(new Wall(300,300,100,90));
world.addObject(new Wall(100,150,20,100));

var center; //used to situate eveything on the screen

var player = new Player();//makes a new player object

//image loading:
var fishie = null;
var fishTail = null;


//------------------SETUP AND DRAW--------------------

//Dani: I got an error related to the X and Y being undefined in the update function's if statement. I made them global variables for my particle/light effect too
let x=100;
let y=100;

function setup() {
    createCanvas(windowWidth, windowWidth);
    background('black');
    center = { x: windowWidth/2, y: windowHeight/2}; //sets center to the middle of screen

    //--------image loading------------
    imageMode(CENTER);
    fishie = loadImage('sprites/angler_head.png'); //loading an image to a variable
    fishTail = loadImage('sprites/angler_tail.png') //optionally assign a tail image
    player.setImage(fishie); //see line 20 in the player file for how to draw images
    player.setTailImage(fishTail);
}

//this interval executes every 200ms
setInterval(function() {
    faceReader.readFace(); //gets emotion from face on campera if there is one
    player.setEmotion(faceReader.getEmotionColor()); //updates player emotion color
}, 400);

function draw() {
    clear();
    blendMode(ADD);
    let lightness = 100 - map(player.getY(), -1000, 1000, 90, 100);
    background('hsl(234, 67%, ' + lightness + '%)');

    player.update(center,world); //updates player info
    player.draw(center); //draws the player on the screen

    world.update( player.getX(),player.getY() );
    world.draw();
}