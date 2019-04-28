import "babel-polyfill";
import "./style.css";
import "bootstrap/dist/css/bootstrap.css";
import * as THREE from "three";
import EnvironmentService from "./services/environment.service";
import MaterialService from "./services/material.service";
import VideoService from "./services/video.service";
import DetectionService from "./services/detection.service";
import BarService from "./services/bar.service";
import VisorService from "./services/visor.service";
import State from "./models/State";
import Body from "./models/Body";
import * as models from "./data/sample-models.json";
import * as posenet from "@tensorflow-models/posenet";
import testVideoSrc from "./videos/photographer.mp4"; 
import ShapeService from "./services/shape.service";
import GameService from "./services/game.service";

let upKey = 83;
let downKey = 87;
let leftKey = 65;
let rightKey = 68;

// create the scene
let scene = EnvironmentService.setupNewScene();

// create the camera
let camera = EnvironmentService.setupNewPerspectiveCamera();

// setup new renderer
let renderer = EnvironmentService.setupNewRenderer();

// create controls
let controls = EnvironmentService.setupOrbitControls(camera);

let testVideo;
let video;

// setup floor 
EnvironmentService.setupPlaneGeometry(scene);

// add canvas to dom
document.getElementById("world").appendChild(renderer.domElement);

// add axis to the scene
let axis = new THREE.AxesHelper(10);
scene.add(axis);
 
// add lights
scene.add( new THREE.AmbientLight( 0x666666 ) );
EnvironmentService.setupDefaultDirectionalLight(50, 200, 100, scene);
EnvironmentService.setupDefaultDirectionalLight(-100, -100, -100, scene);

// create a box and add it to the scene
let body = new Body(scene);
for (let part of models["default-model"]) {
    body.createPart(
        body.createSphereShape(),
        MaterialService.createCustomColorMaterial(part.color),
        part
    );
    body.updatePartPosition(part.part, "x", part.x);
    body.updatePartPosition(part.part, "y", part.y);
}

body.resetSegments();
window.body = body;
VisorService.setupVisor();

camera.position.x = 1000;
camera.position.y = 50;
camera.position.z = 1500;
camera.lookAt(scene.position);

window.camera = camera;
controls.addEventListener("change", render);
document.body.addEventListener("keydown", onKeyDown, false);
document.querySelector("#hide-visor").style.display = "none"
document.querySelector("#start-game").addEventListener("click", () => {
    GameService.startGame();
    ShapeService.makeBoxes(scene);
    document.querySelector("#show-visor").style.display = "none";
}); 

document.querySelector("#stop-game").addEventListener("click", () => {
    resetGameState();
    alert("Game Stopped, play again!");
}); 


function updateGameInfo() {
    document.querySelector(".lives-left").textContent = "Lives: " + GameService.getLives();
    document.querySelector(".timer-left").textContent = "Time Left in Round: " + GameService.getTimeLeft();
}

function resetGameState() {
    document.querySelector("#show-visor").style.display = "";
    GameService.stopGame();
    ShapeService.removeAllShapes(scene);
    updateGameInfo();
}

function trackCollisionDetection() {
    if (GameService.hasGameStarted()) {
        ShapeService.moveShapesToTarget(models["target-position"], scene);
        ShapeService.didCollisionOccur(body.getPart("nose"));
        ShapeService.didCollisionOccur(body.getPart("leftShoulder"));
        ShapeService.didCollisionOccur(body.getPart("rightShoulder"));
    }
}

function updateBodyPositions(pose, state) {
    if (GameService.hasGameStarted()) {
        body.updatePartsPositions(pose.keypoints);
        body.updateJoints(pose, state.singlePoseDetection.minPartConfidence);
    }
}

function notifyGameMessages() {
    if (GameService.getLives() === 0) {
        resetGameState();
        alert("GAME OVER! You got hit too many times, try again!");
    } else if (GameService.getTimeLeft() === 0) {
        resetGameState();
        alert("You survived the round, you won!");
    }
}

function updatePerFrameUpdates(state, videoSource, pose) {
    trackCollisionDetection();
    updateBodyPositions(pose, state);
    DetectionService.outputPoseInVideo(pose, videoSource);
    BarService.createBarChart(pose.keypoints);
    VisorService.showTable(pose.keypoints);
    updateGameInfo();
}

function render() {
    renderer.render(scene, camera);
}

function onKeyDown(event) {
    switch (event.keyCode) {
        // up
        case upKey: 
            camera.position.z += 50;
            break;
        case downKey:
            camera.position.z -= 50;
            break;
        case leftKey: 
            camera.position.x -= 50;
            break;
        case rightKey:
            camera.position.x += 50;
            break;
    }
}

async function poseDetectionFrame() {   
    let state = State.defaultState();
    let videoSource = video;
    let imageScaleFactor = state.input.imageScaleFactor;
    let flipHorizontal = true;
    let outputStride = state.input.outputStride;

    notifyGameMessages();    
    if (!DetectionService.isWebCamDetection()) {
        videoSource = testVideo;
        testVideo.play();
    } 
    
    if (GameService.hasGameStarted() || !DetectionService.isWebCamDetection()) {     
        let pose = await net.estimateSinglePose(
            videoSource, imageScaleFactor, flipHorizontal, outputStride
        );
        updatePerFrameUpdates(state, videoSource, pose);
    }

    controls.update();
    render();
    requestAnimationFrame(poseDetectionFrame);
}

let net; 

posenet.load().then((value) => {
    net = value;
    // create video webcam
    try {
        Promise.all([VideoService.loadWebcam(), VideoService.loadVideo()]).then((videos) => {
            video = videos[0];
            testVideo = videos[1];
            poseDetectionFrame();
        });
    } catch (e) {
        throw e;
    }
});
