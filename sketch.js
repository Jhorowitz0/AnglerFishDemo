
//Map Variables
var MapRects = [newWall(600,600,55,55),
                newWall(50, 50, 40, 70),
                newWall(300,300,100,90),
                newWall(100,150,20,100),
                ];

//image assets
let anglerfish_img, ocean_img;

// Constants for expression weights
var faceReader = new FaceReader();
var center;
var player = new Player();

function setup() {
    createCanvas(windowWidth, windowWidth);
    background('black');
    center = { x: windowWidth/2, y: windowHeight/2};
}

function draw() {
    faceReader.readFace(); //gets emotion from face on campera if there is one
    background('black');
    player.update(center);
    player.draw(center);
    updateMap(player.getX(), player.getY());
}


//Map Drawing functions
function updateMap(playerX, playerY) {
    push();
    translate(-playerX,-playerY);
    for( let i = 0; i < MapRects.length; i++) {
        MapRects[i].update();
    }
    pop();
}

//MapObject Generating Functions
function newWall(x, y, width, height) {
    var wall = {
        x: x,
        y: y,
        w: width,
        h: height,
        color: [0,150,0],

        update: function() {
            fill(this.color);
            rect(x,y,width,height);
        }
    }
    return wall;
}