//------------------CLASS FOR SOUNDMANAGER------------------
class SoundSystem {
    constructor() {
        this.backtrack;
        this.callBank;
        this.jellyfish;
        this.chains;
        this.radio;
        this.vent;
    }

    preload() {
        soundFormats('wav','ogg');
        this.backtrack = loadSound(sound_paths.backtrack);
        this.chains = loadSound(sound_paths.chains);
        this.jellyfish = {
            1: loadSound(sound_paths.jellyfish[0]),
            2: loadSound(sound_paths.jellyfish[1]),
            3: loadSound(sound_paths.jellyfish[2])
        }
        this.radio = {
            1: loadSound(sound_paths.radio[0]),
            2: loadSound(sound_paths.radio[1]),
            3: loadSound(sound_paths.radio[2])
        }
        this.vent = {
            "rumble": loadSound(sound_paths.vent.rumble),
            "bubble": loadSound(sound_paths.vent.bubble)
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

    //Calculate pan and vol
    distanceEffects(xDifference, distance) {
        let minPan = 800;   //Distances for where panning occurs
        let panDist = 500;
        let minVol = 1000;  //Distances for where volume change occurs
        let volDist = 600;

        //CALCULATE PAN VALUE
        var pan;
        if(abs(xDifference) < minPan)
            pan = 0;
        else {
            if(xDifference < 0)
                xDifference += minPan;
            else /* xDifference > 0 */
                xDifference -= minPan;
            pan = constrain(xDifference/panDist, -1, 1);
        }

        //CALCULATE VOL VALUE
        var vol;
        distance = constrain(distance - minVol, 0, distance);
        vol = constrain(distance/volDist, 0, 1);
        vol = 1 - vol;

        return { vol : vol, pan : pan};
    }

    
}