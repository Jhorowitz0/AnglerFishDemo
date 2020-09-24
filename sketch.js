/*
    Constants for the player character
*/ 
const meter = 100;
const playerSpeed = 2;

//Dani: I got an error related to the X and Y being undefined in the update function's if statement. I made them global variables for my particle/light effect too
let x=100;
let y=100;

function setup() {
    createCanvas(1280, 800);
    background('black');
}

let player = {
    x:100,       //Start Position coordinates
    y:100,
    color: [150,0,0],

    //Function used to update our player character in draw
    update() { 
        clear();
        fill(this.color);
        circle(this.x,this.y,50);

        //Give the player velocity towards a mouse
        if(mouseIsPressed && int(dist(x,y,mouseX,mouseY)) > 5) {
            x = this.x += ((mouseX-this.x)/meter)*playerSpeed;
            y = this.y += ((mouseY-this.y)/meter)*playerSpeed;
        }

    //light beam! in progress
      fill('yellow');
      noStroke();
      triangle(mouseX-10, mouseY-10, x, y, mouseX+10, mouseY+10);
    }
}

function draw() {
    player.update();
}
