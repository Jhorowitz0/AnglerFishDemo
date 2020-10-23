
//This is a file for any helper functions or objects related to calculations and the drawing of the fish in our game


//this function takes sprites, the fish angle, the offset
//from the client, and if its flipped and draws a good lookin boi
function drawFemaleFish(sprites, angle, offset, flip, wiggleRate, numAttached){


    push();
    translate(offset.x,offset.y);

    if(flip){
        scale(-1, 1); 
        angle = ((angle < 0 ? -1 : 1) * Math.PI) - angle;
    }
    if(numAttached > 5) numAttached = 5;

    strokeWeight(2);
    stroke(255);
    noFill();


    rotate(angle);

    let wiggle = sin(wiggleRate)/2;
    angle *= wiggle;

    push();
    translate(0,20);
    rotate(angle * -1/3);
    push();
    translate(-60,5);
    rotate(angle * -1/3);
    image(sprites.tail,-40,0,50,50);//drawtail
    pop();
    image(sprites.body,-60,0,60,50);//drawbody
    pop();
    if(numAttached>0){
        if(numAttached > 5) numAttached = 5;
        image(sprites.female_head_attached[numAttached],0,0,100,100);
    }
    else image(sprites.female_head,0,0,100,100);

    push();
    translate(-20,20);
    rotate(angle/2);
    translate(-10,0);
    image(sprites.fin,0,0,20,20);
    pop();

    pop();

}

function drawMaleFish(sprites, angle, offset, flip, wiggleRate){


    push();
    translate(offset.x,offset.y);

    if(flip){
        scale(-1, 1); 
        angle = ((angle < 0 ? -1 : 1) * Math.PI) - angle;
    }

    strokeWeight(2);
    stroke(255);
    noFill();


    rotate(angle);

    let wiggle = sin(wiggleRate)/2;
    angle *= wiggle;

    push();
    translate(0,7);
    rotate(angle * -1/3);
    push();
    translate(-21,1);
    rotate(angle * -1/3);
    image(sprites.tail,-14,0,17,17);//drawtail
    pop();
    image(sprites.body,-21,0,21,17);//drawbody
    pop();
    image(sprites.male_head,0,0,35,35);

    push();
    translate(-7,7);
    rotate(angle/2);
    translate(-3,0);
    image(sprites.fin,0,0,7,7);
    pop();
    
    pop();

}

//this function takes a player and some server time stuff and returns a lerped position
function getInterpPos(player, now, lastServerUpdate, serverUpdateTime){
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

//this function is akin to the structure of getInterpPos but focuses on interpolating the color
function getInterColor(player, now, lastServerUpdate, serverUpdateTime) {
    if(player.emotion == null || player.emotionF == null)  return null;

    var timeSinceUpdate = (now - lastServerUpdate);
    var t = timeSinceUpdate / serverUpdateTime;

    console.log(player.emotion);
    console.log(player.emotionF);
    var preColor = color(player.emotion[0], player.emotion[1], player.emotion[2]);
    var afterColor = color(player.emotionF[0], player.emotionF[1], player.emotionF[2]);
    colorMode(RGB);
    return lerpColor(preColor, afterColor, t);
}

