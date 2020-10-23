//This file just loads the webcam, puts the video stream into a readable
//html element, and initializes the faceapi stuff, loading from /models and all that.

//HTML ElEMENT TO STORE WEBCAM DATA IN
const video = document.getElementById("video");

//Function that asks for webcam data and streams it to video element
function startVideo(){
    navigator.mediaDevices.getUserMedia( //<--asks for camera
        {video : true}
    ) 
    .then(function(stream) {
        video.srcObject = stream; //If it succeeds it streams it the html element
    })
    .catch(function(err) {
        faceReader.disableLoading();
        isMale = true;
    });
}

//list of face-api models to load before using webcam input
Promise.all([
    faceapi.nets.tinyFaceDetector.loadFromUri("/models"),
    faceapi.nets.faceLandmark68Net.loadFromUri("/models"),
    faceapi.nets.faceRecognitionNet.loadFromUri("/models"),
    faceapi.nets.faceExpressionNet.loadFromUri("/models")
]).then(startVideo);

