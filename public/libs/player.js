class Player{
    constructor(){
        //this.x = 0;
        //this.y = 0;
        //this.color = [150,0,0];
        //this.size = 100;
        this.visual_range = 170;            // how far the lightbeam projects
        //this.meter = 100;
        //this.playerSpeed = 1;
        //this.angle = 0;
        //this.emotion = [250,250,250];       // color is updated via face-api
        this.image = null;
        this.setLightImage = null;
        this.tailImage = null;              // optional image used for tail
        //this.gravity = 0.1;
        this.rotationDampening = 1/2;       // how much fish body follows mouse
        this.tailRotationDampening = 2/3    // how much tail follows mouse
    }

    /*draw(center){
        blendMode(ADD);
        // drawing fish body
        if(this.image == null) {
            // default fish body if no image provided
            fill(this.color);
            circle(center.x, center.y, this.size);
        } else {
            push();
            translate(center.x, center.y);

            // calculating angle and orientation of fish towards mouse
            let fish_angle = this.angle;             
            if(mouseX < center.x) { 
                scale(-1, 1);   
                // override arctan domain of [-90, 90] degrees by flipping across Y-axis
                fish_angle = ((this.angle < 0 ? -1 : 1) * Math.PI) - this.angle; 
            } 

            // draw fish body
            rotate(fish_angle * this.rotationDampening);
            imageMode(CENTER);
            image(this.image, 0, 0, 200, 180); 

            // drawing fish tail (optional)
            if(this.tailImage != null) {
                translate(-100, 55);
                rotate(fish_angle * this.tailRotationDampening);
                imageMode(CENTER);
                image(this.tailImage, 0, 0, 200, 180); 
            }
            pop();
            blendMode(NORMAL);
        }
        
        // Drawing lightbeam triangle
        // push();
        // translate(center.x, center.y);
        // rotate(this.angle);
        // noStroke();
        // fill(this.emotion);
        // // triangle(0, 0                                   // Origin Point
        // //        , this.size/2 + this.visual_range, 50    // Endpoint 1
        // //        , this.size/2 + this.visual_range, -50); // Endpoint 2
        // if(this.lightImage != null){
        //     image(this.lightImage, 0, 0, 3000, 2000);
        // }
        // pop();
    }

    drawLight(center, lightness){
        push();
        translate(center.x, center.y);
        rotate(this.angle);
        noStroke();
        fill(this.emotion);
        blendMode(MULTIPLY);
        ellipse(0,0,3000,3000);
        if(this.lightImage != null){
            blendMode(NORMAL);
            image(this.lightImage, 0, 0, 3000, 2000);
        }
        ellipse(0,0,15,15);
        pop();
    }

    update(center,world) {
        //MOUSE CONTROLS
        var xdiff = (mouseX - center.x);
        var ydiff = (mouseY - center.y);

        //moves player
        if(abs(ydiff) > this.size || abs(xdiff) > this.size) {
            this.x += xdiff/this.meter*this.playerSpeed;
            this.y += ydiff/this.meter*this.playerSpeed;
        }
        this.y += this.gravity; //pull of gravity on player
        this.y = min(this.y,world.boundsY.max);
        this.y = max(this.y,world.boundsY.min);
        this.x = min(this.x,world.boundsX.max);
        this.x = max(this.x,world.boundsX.min);


        //updates angle
        this.angle = (Math.atan2(mouseY-center.y
                               , mouseX-center.x));
    }*/

    setImage(image) {
        this.image = image;
    }

    setTailImage(tailImage) {
        this.tailImage = tailImage
    }

    setLighting(image){
        this.lightImage = image;
    }

    /*setEmotion(color) {
        this.emotion = color;
    }

    getX() {
        return this.x;
    }

    getY() {
        return this.y;
    }*/
}