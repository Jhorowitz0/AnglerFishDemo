class World{
    constructor(){
        this.offsetX = 0;
        this.offsetY = 0;
        this.objects = [];
        this.particles = [];

        this.boundsY = {min: -6000, max: 300};
        this.boundsX = {min: -1200, max: 600};
    }

    addParticle(particle){
        this.particles.push(particle);
    }

    addObject(object){
        this.objects.push(object);
    }

    update(playerX, playerY){
        this.offsetX = (playerX - (windowWidth/2)) * -1;
        this.offsetY = (playerY - (windowHeight/2)) * -1;
        this.objects.forEach(object => {
            object.update();
        });
        this.particles.forEach(particle =>{
            particle.update(playerX, playerY);
        });
    }

    draw(){
        push();
        translate(this.offsetX, this.offsetY);
        this.objects.forEach(object => {
            object.draw();
        });
        this.particles.forEach(particle => {
            particle.draw();
        });
        pop();
    }
}