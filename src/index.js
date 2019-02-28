import "./style.css";
import * as THREE from "three";
import EnvironmentService from "./services/environment.service";
import MaterialService from "./services/material.service";
import Body from "./models/Body";
import * as models from "./data/sample-models.json";
import * as posenet from "@tensorflow-models/posenet";

// create the scene
let scene = EnvironmentService.setupNewScene();

// create the camera
let camera = EnvironmentService.setupNewPerspectiveCamera();

// setup new renderer
let renderer = EnvironmentService.setupNewRenderer();

// create controls
let controls = EnvironmentService.setupOrbitControls(camera);

// add canvas to dom
document.body.appendChild(renderer.domElement);

// add axis to the scene
let axis = new THREE.AxesHelper(10);
scene.add(axis);
 
// add lights
EnvironmentService.setupDefaultDirectionalLight(100, 100, 100, scene);
EnvironmentService.setupDefaultDirectionalLight(-100, 100, -100, scene);

// create a box and add it to the scene
let body = new Body(scene);
console.log(models);
for (let part of models["model1"]) {
    console.log(part);
    body.createPart(
        body.createBoxShape(part.part),
        MaterialService.createWireframeMaterial(),
        part.part
    );
    body.updatePartPosition(part.part, "x", part.x);
    body.updatePartPosition(part.part, "y", part.y);
}

camera.position.x = 100;
camera.position.y = 500;
camera.position.z = 0;

camera.lookAt(scene.position);
controls.addEventListener("change", render);

function render() {
    let timer = 0.002 * Date.now();
    // body.updatePartPosition("nose", "y", 0.5 + 0.5 * Math.sin(timer));
    // body.updatePartRotation("nose", "x", body.getPartRotation("nose", "x") + 0.1);
    renderer.render(scene, camera);
}

function animate() {
    requestAnimationFrame(animate);
    controls.update();
    render();
}

animate();
