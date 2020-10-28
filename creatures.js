const creatures = {
    krillSchool: class KrillSchool{
        constructor(){
            this.x = 0;
            this.y = 0;
            this.krill = [];
            this.d = 59;
            this.count = 10;
            for(var i = 0; i < this.count; i++) this.krill.push({
                x: (Math.random() * this.d) - this.d/2,
                y: (Math.random() * this.d) - this.d/2,
                vX: (Math.random() * 2) - 1,
                vY: (Math.random() * 2) - 1,
            });
        }
    }
}

module.exports = creatures;
