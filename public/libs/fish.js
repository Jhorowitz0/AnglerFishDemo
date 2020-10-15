
//This is a file for any helper functions or objects related to calculations and the drawing of the fish in our ga


//this function takes sprite(fish images), the fish angle, the offset
//from the client, and if its flipped and draws a good lookin boi
function drawFish(sprites, angle, offset, flip){

    push();
    translate(offset.x,offset.y);

    if(flip){
        scale(-1, 1); 
        angle = ((angle < 0 ? -1 : 1) * Math.PI) - angle;
    }


    //draw body
    rotate(angle * 1/2);
    image(sprites.body, 0, 0, 200, 180);

    // draw tail
    if(sprites.tail != null){
        translate(-100,55);
        rotate(angle * 2/3);
        image(sprites.tail, 0, 0, 200, 180);
    }

    pop();

}

//this function takes a player and some server time stuff and returns a lerped position
function getInterpPos(player, now, lastSeverUpdate, serverUpdateTime){
    var timeSinceUpdate = (now - lastServerUpdate);
    var t = timeSinceUpdate / serverUpdateTime;

    var preX = player.x + player.vX;
    var preY = player.y + player.vY;
    var interX = lerp(player.x, preX, t);
    var interY = lerp(player.y, preY, t);

    return {
        x: interX,
        y: interY
    }
}

