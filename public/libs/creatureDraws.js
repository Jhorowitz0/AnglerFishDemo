
function drawKelpLeaf(kelp){
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
      rect(0,0+d/2,d,10);
      pop();
    }
    pop();
}

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
    //   rect(0,0+d/2,d,10);
    image(worldImages['kelp_stalk'],0,0+d/2,d*1.2,30);
      pop();
    }
    pop();
}