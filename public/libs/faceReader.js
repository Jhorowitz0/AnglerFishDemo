//the facereader class is an interface for reading the webcam facial expressions
//var varName = new FaceReader() will make a new faceread
//call varName.readFace() when you want to read the persons emotion
//varName.getEmotionColor() returns a color where red = angry, green = happy, and blue = sad. 



//-------------------CLASS FOR OBJECT TO GET EMOTIONS-------------
class FaceReader {
    constructor() {
        this.angry = 128;
        this.sad = 128;
        this.happy = 128;  
    }

    //takes an expression and updates the emotion variables
    updateEmotions(expressions){
        this.angry = expressions.angry * 255 + 50;
        this.sad = expressions.sad * 255 + 50;
        this.happy = expressions.happy * 255 + 50;
    }

    async readFace() {
        var detections = await faceapi
            .detectAllFaces(video, new faceapi.TinyFaceDetectorOptions()) //get all faces in view
            .withFaceLandmarks()                                          //landmarks used for visual feedback
            .withFaceExpressions();                                       //get scores for every expression

        //set position and color if at least 1 face is detected
        if(detections != null && detections[0] != null) {
            show('loading', false); //disable loading screen 
            this.updateEmotions(detections[0].expressions);
          
            //setup seperate canvas to display face input feedback
            const canvas = document.getElementById('overlay');
            canvas.getContext("2d").clearRect(0,0,canvas.width, canvas.height);
            const displaySize = { width: canvas.width, height: canvas.height };
          
            //use faceapi to draw visual feedback 
            const resizedResults = faceapi.resizeResults(detections, displaySize);  
            faceapi.draw.drawFaceLandmarks(canvas, resizedResults);
            faceapi.draw.drawFaceExpressions(canvas, resizedResults, 0.05);
        }
    }

    getEmotionColor() {
        return [this.angry,this.happy,this.sad];
        // return color(this.angry,this.happy,this.sad);
    }
}

function show(id, value) {
    document.getElementById(id).style.display = value ? 'block' : 'none';
}
