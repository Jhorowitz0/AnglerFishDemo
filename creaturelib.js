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

const Tentacle = class {
    constructor(x,y){
        this.x = x;
        this.y = y;
        this.length = 10;
        this.nodes = [];
        for(let i = 0; i < this.length; i++){
            this.nodes.push({x:x,y:y});
        }
    }

    update(x,y){
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
                this.nodes[i].x = lerp(this.nodes[i].x,x2,vel);
                this.nodes[i].y= lerp(this.nodes[i].y,y2,vel);
            }
            this.nodes[i].y += 3;
        }
    }
}

const JellyFish = class{
    constructor(x,y,size){
        this.size = size;
        this.freq = 0.03;
        this.amp = size*2;
        this.t = 0;
        this.wave = 0;
        this.w = size;
        this.h = size;
        this.tents = [];
        let count = 7;
        for(let i = 0; i < count; i++){
            this.tents.push(new Tentacle(x,y));
        }
    }

    update(x,y){
        this.t += this.freq;
        this.wave = this.amp * Math.sin(this.t);
        if(this.wave < 0) this.wave = 0;
        this.w = lerp(this.w,this.wave+50,0.01);
        this.h = lerp(this.h,this.amp/5 - this.wave/5 + this.size,0.01);
        for(let i = 0;i < this.tents.length;i++){
            let x2 = ((i+0.5) * (this.w/this.tents.length * 0.7)) - (this.w/2)*0.7;
            let y2 = this.h/2;
            this.tents[i].update(x2,y2);
        }
    }
}



const creatures = {
    Kelp: Kelp,
    Mine: Mine,
    JellyFish: JellyFish,
    Tentacle: Tentacle
}

module.exports = creatures;


const lerp = function (value1, value2, amount) {
	amount = amount < 0 ? 0 : amount;
	amount = amount > 1 ? 1 : amount;
	return value1 + (value2 - value1) * amount;
};
