class World{
    constructor(){
        this.offsetX = 0;
        this.offsetY = 0;
        this.objects = [];
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