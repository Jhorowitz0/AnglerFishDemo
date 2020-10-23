class ParticleSystem{
    constructor(pCount){
        this.particles = [];
        this.range = 400;
        this.lifeSpan = 50;
        this.size = 4;
        for(let i = 0; i < pCount; i++){
            this.particles.push({
                x:Math.random * this.range,
                y:Math.random * this.range,
                vx:Math.random()/4,
                vy:Math.random()/4,
                life: Math.random() * this.lifeSpan
            })
        }

        
    }

    update(pos){
        this.particles.forEach(particle => {
            if(particle.life > this.lifeSpan){
                particle.x = (Math.random()*this.range) - (this.range/2) + pos.x 
                particle.y = (Math.random()*this.range) - (this.range/2) + pos.y 
                particle.life = 0;
            }
            else{
                particle.life++;
                particle.x += particle.vx;
                particle.y += particle.vy;
            }
        });
    }

    draw(pos){

        noStroke();
        fill(255);

        this.particles.forEach(particle =>{
            let offset = {
                x: particle.x - pos.x,
                y: particle.y - pos.y
            }

            let percentLife = (particle.life / this.lifeSpan);
            let size = this.size;
            if(percentLife > 0.5){
                size = (1-percentLife) * this.size*2;
            }
            else size = percentLife * this.size*2;

            blendMode(ADD);
            ellipse(offset.x, offset.y, size, size);
            blendMode(BLEND);

        });
    }


}