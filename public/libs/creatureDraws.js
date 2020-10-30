function drawKelp(kelp){
    strokeWeight(3);
    stroke(0,255,0);
    noFill();
    push();
    translate(-1 * kelp.nodes[0].x,-1 * kelp.nodes[0].y);
    for(var i = 1; i < kelp.length; i++){
      let dy = kelp.nodes[i].y - kelp.nodes[i-1].y;
      let dx = kelp.nodes[i].x - kelp.nodes[i-1].x;
      let theta = atan(dy/dx);
      if(theta < 0) theta = PI-abs(theta);
      let d = dist(kelp.nodes[i].x,kelp.nodes[i].y,kelp.nodes[i-1].x,kelp.nodes[i-1].y);
      push();
      translate(kelp.nodes[i].x,kelp.nodes[i].y);
      rotate(abs(theta));
    image(worldImages['kelp_stalk'],0,0+d/2,d*1.2,30);
      pop();
    }
    pop();
}

function drawMine(mine){
    strokeWeight(3);
    stroke(255,0,0);
    noFill();
    push();
    translate(-1 * mine.nodes[0].x,-1 * mine.nodes[0].y);
    for(var i = 1; i < mine.length; i++){
      let dy = mine.nodes[i].y - mine.nodes[i-1].y;
      let dx = mine.nodes[i].x - mine.nodes[i-1].x;
      let theta = atan(dy/dx);
      if(theta < 0) theta = PI-abs(theta);
      let d = dist(mine.nodes[i].x,mine.nodes[i].y,mine.nodes[i-1].x,mine.nodes[i-1].y);
      push();
      translate(mine.nodes[i].x,mine.nodes[i].y);
      rotate(theta + Math.PI/2);
      image(worldImages['chain'],0,0+d/2,d,d*1.6);
      pop();
    }
    image(worldImages['mine'], mine.nodes[mine.nodes.length-1].x, mine.nodes[mine.nodes.length-1].y,900,700);
    pop();
}

function drawTentacle(tent){
    strokeWeight(3);
    stroke(255);
    noFill();
    push();
    translate(-1 * tent.nodes[0].x,-1 * tent.nodes[0].y);
    beginShape();
    for(var i = 1; i < tent.length; i++){
    curveVertex(tent.nodes[i].x,tent.nodes[i].y)
      //translate(tent.nodes[i].x,tent.nodes[i].y);
    }
    endShape();
    pop();
}

function drawJellyFish(jelly){
    image(worldImages['jelly_body'],0,jelly.size,jelly.size*0.4,jelly.size);
    for(let i = 0;i < jelly.tents.length;i++){
        let x = (jelly.x + 
            (i+0.5) * (jelly.w/jelly.tents.length * 1)) - (jelly.w/2)*1;
        let y = jelly.y+jelly.h/2;
        drawTentacle(jelly.tents[i]);
    }
    if(jelly.wave > 0){
        image(worldImages['jelly_fin_1'],0,jelly.h/2+jelly.size/8,jelly.w*0.8,jelly.size/4);
        image(worldImages['jelly_head_1'],0,0,jelly.w,jelly.h*1.2);
    }
    else{
        image(worldImages['jelly_fin_2'],0,jelly.h/2+jelly.size/8,jelly.w*0.8,jelly.size/4);
        image(worldImages['jelly_head_2'],0,0,jelly.w,jelly.h*1.2);
    }
}