class Player {
    constructor() {
        this.isMale = true,
        this.femaleID = null,
        this.numAttached = 0,
        this.attached = {},
        this.x = Math.random(world.bounds.x.min,world.bounds.x.max),
        this.y = Math.random(world.bounds.y.min,world.bounds.y.max),
        this.angle = 0,
        this.isFlipped = false,
        this.wiggleRate = 0,
        this.vX = 0,
        this.vY = 0,
        this.aX = 0,
        this.aY = 0,
        this.emotion = [50,50,50],
        this.emotionF = null
    }
}

module.exports = Player;