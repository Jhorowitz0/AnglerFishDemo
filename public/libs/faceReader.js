//the facereader class is an interface for reading the webcam facial expressions
//var varName = new FaceReader() will make a new faceread
//call varName.readFace() when you want to read the persons emotion
//varName.getEmotionColor() returns a color where red = angry, green = happy, and blue = sad. 



//-------------------CLASS FOR OBJECT TO GET EMOTIONS-------------
class FaceReader {
    constructor() {
        //primary emotions
        this.angry = 128;
        this.sad = 128;
        this.happy = 128;  
      
        //secondary emotions
        this.surprised = 0;
        this.disgusted = 0;
        this.fearful = 0;
    }

    //takes an expression and updates the emotion variables
    updateEmotions(expressions){
        this.angry = expressions.angry * 255 + 50;
        this.sad = expressions.sad * 255 + 50;
        this.happy = expressions.happy * 255 + 50;
      
        //secondary emotions do not have a minimum weight
        this.surprised = expressions.surprised * 255;
        this.disgusted = expressions.disgusted * 255;
        this.fearful = expressions.fearful * 255;
        
    }

    async readFace() {
        var detections = await faceapi
            .detectAllFaces(video, new faceapi.TinyFaceDetectorOptions()) //get all faces in view
            .withFaceLandmarks()                                          //landmarks used for visual feedback
            .withFaceExpressions();                                       //get scores for every expression

        //set position and color if at least 1 face is detected
        if(detections != null && detections[0] != null) {
            initClient();
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
        let red = this.angry + this.disgusted;
        let blue = this.sad + this.fearful;
        let green = this.happy + this.surprised;
        return([red,green,blue]);
        // return color(red,green,blue);
    }

    returnDominant() {
        if(this.angry > this.sad + 32 && this.angry > this.happy + 32)
            return "femaleAngry";
        else if(this.happy > this.angry + 32 && this.happy > this.sad + 32)
            return "femaleHappy";
        else if(this.sad > this.angry + 32 && this.sad > this.happy + 32)
            return "femaleSad";
        else
            return "femaleNeutral";
    }

    disableLoading(){
        initClient();
    }
}


var faceReader = new FaceReader(); // Object for reading emotion
