class Mote{
    constructor(){
        this.x = -500;
        this.y = -500;
        this.vel = [0,0]
        this.distance = 0;
    }

    update(playerX, playerY){
        this.x += this.vel[0]; //moves particles around
        this.y += this.vel[1];


        this.distance = getDistance(this.x,this.y,playerX,playerY);
        if(this.distance > 400){ //when the particle gets far away enough it moves it close to the player
            let offsetX = (Math.random() * 800) - 400;
            let offsetY = (Math.random() * 800) - 400;
            this.x = playerX + offsetX;
            this.y = playerY + offsetY;
            this.vel[0] = (Math.random() - 0.5)/2;
            this.vel[1] = (Math.random() - 0.5)/2;
            this.life = 1000;
        };


    }

    draw(){
        let alpha = map(this.distance, 0, 400, 1, 0); //particles face as they get further away
        if(alpha < 0) alpha = 0;
        fill('rgba(100, 100, 100, ' + alpha + ')');
        ellipse(this.x,this.y,3,3);
    }
}


function getDistance(x1,y1,x2,y2){
    return Math.sqrt(Math.pow(x2 - x1,2) + Math.pow(y2 - y1, 2));
}

