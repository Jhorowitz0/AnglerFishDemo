class BGfiles{
    constructor(){
        this.objects = {};
    }
    setupBG(){
        imageMode(CENTER);
        objects["rock1"] = loadImage('background/rock1.png');
    }

    drawBG(id, x, y){
        push();
        translate (x,y);
        // draw rocks
        imageMode(CENTER);

        image(rock1, 0, 0);

        pop();
    }
}