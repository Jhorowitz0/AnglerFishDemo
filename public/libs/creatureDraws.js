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