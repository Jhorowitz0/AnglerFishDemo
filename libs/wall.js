class Wall{
    constructor(x,y,width,height,color=[0,150,0]){
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.color = color;
    }

    update(){
        //if we want anything to change about the walls
    }

    draw(){
        fill(this.color);
        rect(this.x,this.y,this.width,this.height);
    }
}