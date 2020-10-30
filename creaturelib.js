const creatures = {

    KelpLeaf: class KelpLeaf{
        constructor(x,y){
            this.length = 3;
            this.nodes = [];
            for(i = 0; i < this.length; i++){
                this.nodes.push({x:x,y:y});
            }
            this.amp = 10;
            this.freq = 0.025;
            this.t = 0;
        }

        update(x,y){
            this.t += this.freq;
            this.nodes[0].x = x;
            this.nodes[0].y = y;
            for(var i = this.length-1; i>0; i--){
                let x1 = this.nodes[i].x;
                let y1 = this.nodes[i].y;
                let x2 = this.nodes[i-1].x;
                let y2 = this.nodes[i-1].y;
                let distance = dist(x1,y1,x2,y2);
                let vel = distance/1000;
                if(vel<0.02) vel = 0;
                if(distance > 10){
                    x2 += this.amp * sin(this.t+i);
                    this.nodes[i].x = lerp(this.nodes[i].x,x2,vel);
                    this.nodes[i].y= lerp(this.nodes[i].y,y2,vel);
                }
                this.nodes[i].y -= 0.6;
            }
        }
    },

    Kelp: class Kelp{
        constructor(x,y,l){
            this.length = l;
            this.nodes = [];
            this.leaves = [];
            for(i = 0; i < this.length; i++){
                this.leaves.push(new this.KelpLeaf(x,y));
                this.nodes.push({x:x,y:y});
            }
            this.amp = 10;
            this.freq = 0.01;
            this.t = 0;
        }

        update(x,y){
            this.t += this.freq;
            this.nodes[0].x = x;
            this.nodes[0].y = y;
            for(var i = this.length-1; i>0; i--){
                let x1 = this.nodes[i].x;
                let y1 = this.nodes[i].y;
                let x2 = this.nodes[i-1].x;
                let y2 = this.nodes[i-1].y;
                let distance = dist(x1,y1,x2,y2);
                let vel = distance/1000;
                if(vel<0.02) vel = 0;
                if(distance > 10){
                    x2 += this.amp * sin(this.t+i);
                    this.nodes[i].x = lerp(this.nodes[i].x,x2,vel);
                    this.nodes[i].y= lerp(this.nodes[i].y,y2,vel);
                }
                this.nodes[i].y -= 0.6;
                this.leaves[i].update(this.nodes[i].x,this.nodes[i].y);
            }
        }
    }
}

module.exports = creatures;
