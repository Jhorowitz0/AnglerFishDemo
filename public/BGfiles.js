class BGfiles{
    setupBG(){
        imageMode(CENTER);
        rock1 = loadImage('background/rock1.png');
        rock2 = loadImage('background/rock2.png');
        rock3 = loadImage('background/rock3.png');
    }

    drawBG(){
        push();

        // draw rocks
        blendMode(NORMAL);
        imageMode(CENTER);

        image(rock1, 0, 100, 200, 180);
        image(rock2, 50, 100, 200, 180);
        image(rock3, 75, 100, 200, 180);

        pop();
    }
}