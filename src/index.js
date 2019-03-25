import "babel-polyfill";
import "./style.css";
import * as THREE from "three";
import EnvironmentService from "./services/environment.service";
import MaterialService from "./services/material.service";
import VideoService from "./services/video.service";
import DetectionService from "./services/detection.service";
import State from "./models/State";
import Body from "./models/Body";
import * as models from "./data/sample-models.json";
import * as posenet from "@tensorflow-models/posenet";

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

let video;

// setup floor 
EnvironmentService.setupPlaneGeometry(scene);

// add canvas to dom
document.body.appendChild(renderer.domElement);

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

camera.position.x = 1000;
camera.position.y = 50;
camera.position.z = 1500;

camera.lookAt(scene.position);
controls.addEventListener("change", render);
document.body.addEventListener("keydown", onKeyDown, false);

async function poseDetectionFrame() {   
    let frameDelay = 1000 / 30;
    let state = State.defaultState();
    let net = await posenet.load();
    let imageScaleFactor = state.input.imageScaleFactor;
    let flipHorizontal = true;
    let outputStride = state.input.outputStride;
    let pose = await net.estimateSinglePose(
        video, imageScaleFactor, flipHorizontal, outputStride
    );
    body.updatePartsPositions(pose.keypoints);
    body.updateJoints(pose, state.singlePoseDetection.minPartConfidence);
    controls.update();
    render();
    setTimeout(() => {
        requestAnimationFrame(poseDetectionFrame);
    }, frameDelay);
}


function render() {
    let timer = 0.002 * Date.now();
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

// create video webcam
try {
    VideoService.loadVideo().then((loadVideo) => {
        video = loadVideo;
        poseDetectionFrame();
    });
} catch (e) {
    let info = document.getElementById('info');
    info.textContent = 'this browser does not support video capture,' +
      'or this device does not have a camera';
    info.style.display = 'block';
    throw e;
}
