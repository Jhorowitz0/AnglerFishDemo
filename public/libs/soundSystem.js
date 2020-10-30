


//------------------CLASS FOR SOUNDMANAGER------------------
class SoundSystem {
    constructor() {
        this.backtrack;
        this.callBank;
        this.jellyfish;
        this.chains;
        this.radio;
    }

    preload() {
        soundFormats('wav','ogg');
        this.backtrack = loadSound('libs/sounds/underwater');
        this.chains = loadSound('libs/sounds/Chains');
        this.jellyfish = {
            1: loadSound('libs/sounds/Jellyfish_Neutral_1'),
            2: loadSound('libs/sounds/Jellyfish_Neutral_2'),
            3: loadSound('libs/sounds/Jellyfish_Neutral_3')
        }
        this.radio = {
            1: loadSound('libs/sounds/CaramelDansen_Underwater'),
            2: loadSound('libs/sounds/Ocean_Man_Underwater'),
            3: loadSound('libs/sounds/We_Like_to_Party_Underwater')
        }
        this.callBank = {
            "femaleHappy": {
                1: loadSound('libs/sounds/Female_Happy_1'),
                2: loadSound('libs/sounds/Female_Happy_2'),
                3: loadSound('libs/sounds/Female_Happy_3')
            },
            "femaleNeutral": {
                1: loadSound('libs/sounds/Female_Neutral_1'),
                2: loadSound('libs/sounds/Female_Neutral_2'),
                3: loadSound('libs/sounds/Female_Neutral_3')
            },
            "femaleAngry": {
                1: loadSound('libs/sounds/Female_Angry_1'),
                2: loadSound('libs/sounds/Female_Angry_2'),
                3: loadSound('libs/sounds/Female_Angry_3')
            },
            "femaleSad": {
                1: loadSound('libs/sounds/Female_Sad_1'),
                2: loadSound('libs/sounds/Female_Sad_2'),
                3: loadSound('libs/sounds/Female_Sad_3')
            },
            "maleCall": {
                1: loadSound('libs/sounds/Male_Call_1'),
                2: loadSound('libs/sounds/Male_Call_2'),
                3: loadSound('libs/sounds/Male_Call_3')
            }
        }
    }

    startBacktrack() {
        this.backtrack.loop();
    }

    playCall(soundName, vol, pan) {
        let index = int(Math.random()*2 + 1);
        let sound = this.callBank[soundName][index];
        let rate  = Math.random()*0.2 + 0.9;

        sound.setVolume(vol);
        sound.rate(rate);
        sound.pan(pan);
        sound.play();
    }

    
}