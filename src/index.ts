import "./style.css";
import * as THREE from "three";

// create the scene
let scene = new THREE.Scene();

// create the camera
let fieldOfView = 75;
let aspect = window.innerWidth / window.innerHeight;
let near = 0.1;
let far = 1000;

let camera = new THREE.PerspectiveCamera(
    fieldOfView, aspect, near, far
);

let renderer = new THREE.WebGLRenderer();

// set size
renderer.setSize(window.innerWidth, window.innerHeight);

// add canvas to dom
document.body.appendChild(renderer.domElement);

// add axis to the scene
let axis = new THREE.AxesHelper(10);
scene.add(axis);

// add lights
let color = 0xffffff;
let intensity = 0.1;

let light = new THREE.DirectionalLight(color, intensity);
light.position.set(100, 100, 100);
scene.add(light);

let light2 = new THREE.DirectionalLight(color, intensity);
light2.position.set(-100, 100, -100);
scene.add(light2);

// create material 
let materialColor = 0xaaaaaa;
let wireframe = true;
let material = new THREE.MeshBasicMaterial({
    color: materialColor, wireframe
});

// create a box and add it to the scene
let box = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), material);
scene.add(box);

box.position.x = 0.5;
box.rotation.y = 0.5;

camera.position.x = 5;
camera.position.y = 5;
camera.position.z = 5;

camera.lookAt(scene.position);

function render(): void {
    let timer = 0.002 * Date.now();
    box.position.y = 0.5 + 0.5 * Math.sin(timer);
    box.rotation.x += 0.1;
    renderer.render(scene, camera);
}

function animate(): void {
    requestAnimationFrame(animate);
    render();
}

animate();
