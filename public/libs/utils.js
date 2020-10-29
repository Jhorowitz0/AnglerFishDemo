var utils = {};

utils.loadJSON = async function (path, callback) {
    var xobj = new XMLHttpRequest();
    xobj.overrideMimeType("application/json");
    xobj.open('GET', path, true);
    xobj.onreadystatechange = function () {
        if (xobj.readyState == 4 && xobj.status == "200")
            callback(xobj.responseText);
    };
    xobj.send(null);
}

utils.lerp_triple = function(triple1, triple2, lerp_value) { //lerp an array
    var triple3 = [0,0,0];
    triple3[0] = lerp(triple1[0],triple2[0], lerp_value);
    triple3[1] = lerp(triple1[1],triple2[1], lerp_value);
    triple3[2] = lerp(triple1[2],triple2[2], lerp_value);
    return triple3;
  }

utils.additive_lerp_triple = function(triple1, triple2, lerp_value) { //lerp an array
  var triple3 = [0,0,0];
  triple3[0] = additive_lerp(triple1[0],triple2[0], lerp_value);
  triple3[1] = additive_lerp(triple1[1],triple2[1], lerp_value);
  triple3[2] = additive_lerp(triple1[2],triple2[2], lerp_value);
  return triple3;
}
  
utils.arrayToColor = function(array){ 
      let r = array[0];
      let g = array[1];
      let b = array[2];
      return color(r,g,b);
  }
  
utils.ColorToArray = function(color){
      let r = red(color);
      let g = green(color);
      let b = blue(color);
      return [r,g,b];
  }
  
utils.getDistance = function(x1,y1,x2,y2){
      let dX = x2-x1;
      let dY = y2-y1;
      return Math.sqrt(dX*dX + dY*dY);
  }

function lerp(a, b, v) {
  return (a+b)*v;
}

function additive_lerp(a, b, v) {
  return a+(b*v);
}

module.exports = utils;