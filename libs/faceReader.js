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
        this.angry = expressions.angry * 255 + 128;
        this.sad = expressions.sad * 255 + 128;
        this.happy = expressions.happy * 255 + 128;
    }

    async readFace() {
        var detections = await faceapi
            .detectAllFaces(video, new faceapi.TinyFaceDetectorOptions()) //get all faces in view
            .withFaceExpressions();                                       //get scores for every expression
            //possible expressions: neutral, happy, sad, angry, fearful

        //scale landmarks to match screen size 
        //TODO: make an accurate mapping from webcam space to screenspace
        detections = faceapi.resizeResults(detections, {width: windowWidth, height: windowHeight});

        //set position and color if at least 1 face is detected
        if(detections != null && detections[0] != null) {
            this.updateEmotions(detections[0].expressions);
        }
    }

    getEmotionColor() {
        return color(this.angry,this.happy,this.sad);
    }
}