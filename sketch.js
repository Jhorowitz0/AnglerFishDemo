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


//------------------SETUP AND DRAW--------------------

function setup() {
    createCanvas(windowWidth, windowWidth);
    background('black');
    center = { x: windowWidth/2, y: windowHeight/2}; //sets center to the middle of screen

    //--------image loading------------
    imageMode(CENTER);
    fishie = loadImage('sprites/fishie.PNG'); //loading an image to a variable
    player.setImage(fishie); //see line 20 in the player file for how to draw images
}

function mousePressed() {
    faceReader.readFace(); //gets emotion from face on campera if there is one
    player.setEmotion(faceReader.getEmotionColor()); //updates player emotion color
}

function draw() {
    let lightness = 100 - map(player.getY(), -1000, 1000, 80, 100);
    background('hsl(234, 67%, ' + lightness + '%)');

    //faceReader.readFace(); //gets emotion from face on campera if there is one
    //player.setEmotion(faceReader.getEmotionColor()); //updates player emotion color

    player.update(center); //updates player info
    player.draw(center); //draws the player on the screen

    world.update( player.getX(),player.getY() );
    world.draw();
}
