class Player{
    constructor(){
        this.x = 0;
        this.y = 0;
        this.color = [150,0,0];
        this.size = 50;
        this.visual_range = 170;
        this.meter = 100;
        this.playerSpeed = 1;
        this.angle = 0;
    }

    draw(center){
        fill(this.color);
        circle(center.x, center.y, this.size);

        push();
        translate(center.x,center.y);
        rotate(this.angle);
        triangle(this.size/2, 0, this.size/2 + this.visual_range, 50 , this.size/2 + this.visual_range, -50);
        pop();
    }

    update(center){
        //MOUSE CONTROLS
        var xdiff = (mouseX - center.x);
        var ydiff = (mouseY - center.y);

        if(abs(ydiff) > this.size || abs(xdiff) > this.size) {
            this.x += xdiff/this.meter*this.playerSpeed;
            this.y += ydiff/this.meter*this.playerSpeed;
        }

        this.angle = Math.atan2(mouseY-(center.x - this.size/2)
                            , mouseX-(center.y - this.size/2));
    }

    getX(){
        return this.x;
    }

    getY(){
        return this.y;
    }
}