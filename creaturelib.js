const Kelp = class {
    constructor(x,y,l){
        this.length = l;
        this.nodes = [];
        for(let i = 0; i < this.length; i++){
            this.nodes.push({x:x,y:y});
        }
        this.amp = 10;
        this.freq = 0.05;
        this.t = 0;
    }

    update(x,y){
        this.t += this.freq;
        this.nodes[0].x = x;
        this.nodes[0].y = y;
        for(let i = this.length-1; i>0; i--){
            let x1 = this.nodes[i].x;
            let y1 = this.nodes[i].y;
            let x2 = this.nodes[i-1].x;
            let y2 = this.nodes[i-1].y;
            let dx = x2-x1;
            let dy = y1 - y2;
            let distance = Math.sqrt((dx*dx) + (dy*dy));
            let vel = distance/1000;
            if(vel<0.02) vel = 0;
            if(distance > 10){
                x2 += this.amp * Math.sin(this.t+i);
                this.nodes[i].x = lerp(this.nodes[i].x,x2,vel);
                this.nodes[i].y= lerp(this.nodes[i].y,y2,vel);
            }
            this.nodes[i].y -= 8;
        }
    }
}

const Mine = class {
    constructor(x,y,l){
        this.length = l;
        this.nodes = [];
        for(let i = 0; i < this.length; i++){
            this.nodes.push({x:x,y:y});
        }
        this.amp = 10;
        this.freq = 0.05;
        this.t = 0;
    }

    update(x,y){
        this.t += this.freq;
        this.nodes[0].x = x;
        this.nodes[0].y = y;
        for(let i = this.length-1; i>0; i--){
            let x1 = this.nodes[i].x;
            let y1 = this.nodes[i].y;
            let x2 = this.nodes[i-1].x;
            let y2 = this.nodes[i-1].y;
            let dx = x2-x1;
            let dy = y1 - y2;
            let distance = Math.sqrt((dx*dx) + (dy*dy));
            let vel = distance/1000;
            if(vel<0.02) vel = 0;
            if(distance > 10){
                x2 += this.amp * Math.sin(this.t+i);
                this.nodes[i].x = lerp(this.nodes[i].x,x2,vel);
                this.nodes[i].y= lerp(this.nodes[i].y,y2,vel);
            }
            this.nodes[i].y -= 8;
        }
    }
}



const creatures = {
    Kelp: Kelp,
    Mine: Mine
}

module.exports = creatures;


const lerp = function (value1, value2, amount) {
	amount = amount < 0 ? 0 : amount;
	amount = amount > 1 ? 1 : amount;
	return value1 + (value2 - value1) * amount;
};
