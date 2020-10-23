


//------------------CLASS FOR SOUNDMANAGER------------------
class SoundSystem {
    constructor() {
        this.backtrack;
    }

    preload() {
        soundFormats('wav','ogg');
        this.backtrack = loadSound('libs/sounds/underwater');
    }

    startBacktrack() {
        this.backtrack.loop();
    }
}