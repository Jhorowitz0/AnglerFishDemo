class BGfiles{
    constructor(){
        this.objects = {};
    }
    setupBG(){
        imageMode(CENTER);
        this.objects["rock1"] = loadImage('background/rock1.png');
    }

    drawBG(id, x, y){
        push();
        translate (x,y);
        // draw rocks
        imageMode(CENTER);

        image(this.objects["rock1"], 0, 0, 100, 80); // for some reason just using "rock1" doesn't work / display anything
        

        pop();
    }
}