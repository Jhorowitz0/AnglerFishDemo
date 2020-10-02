class World{
    constructor(){
        this.offsetX = 0;
        this.offsetY = 0;
        this.objects = [];

        this.boundsY = {min: -6000, max: 300};
        this.boundsX = {min: -1200, max: 600};
    }

    addObject(object){
        this.objects.push(object);
    }

    update(playerX, playerY){
        this.offsetX = playerX * -1;
        this.offsetY = playerY * -1;
        this.objects.forEach(object => {
            object.update();
        });
    }

    draw(){
        push();
        translate(this.offsetX, this.offsetY);
        this.objects.forEach(object => {
            object.draw();
        });
        pop();
    }
}