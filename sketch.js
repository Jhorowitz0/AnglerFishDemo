


var MapRects = [
    new Wall(600,600,55,55),
    new Wall(50, 50, 40, 70),
    new Wall(300,300,100,90),
    new Wall(100,150,20,100)
];

// image assets

let anglerfish_img, ocean_img;

// Constants for expression weights
var faceReader = new FaceReader();
var center; //used to situate eveything on the screen
var player = new Player();//makes a new player object

function setup() {
    createCanvas(windowWidth, windowWidth);
    background('black');
    center = { x: windowWidth/2, y: windowHeight/2}; //csets center to the middle of screen
}

function draw() {
    background('black');
    //faceReader.readFace(); //gets emotion from face on campera if there is one
    player.setEmotion(faceReader.getEmotionColor()); //updates player emotion color
    player.update(center); //updates player info
    player.draw(center); //draws the player on the screen
    updateMap(player.getX(), player.getY());
}


//Map Drawing functions
function updateMap(playerX, playerY) {
    push();
    translate(-playerX,-playerY);
    for( let i = 0; i < MapRects.length; i++) {
        MapRects[i].draw();
    }
    pop();
}

