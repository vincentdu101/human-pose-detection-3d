import * as THREE from "three";
import TrackballControls from "three-trackballcontrols";
import grass from "../images/grasslight-big.jpg";

// https://threejs.org/examples/#webgl_animation_cloth
export default class EnvironmentService {

    static getWidth() {
        return 500;
    }

    static getHeight() {
        return 300;
    }

    static setupNewScene() {
        // create the scene
        let scene = new THREE.Scene();
        scene.background = new THREE.Color( 0xcce0ff );
        scene.fog = new THREE.Fog( 0xcce0ff, 500, 10000 );
        return scene;
    }

    static setupNewPerspectiveCamera() {
        // create the camera
        let fieldOfView = 30;
        let aspect = this.getWidth() / this.getHeight();
        let near = 1;
        let far = 10000;

        return new THREE.PerspectiveCamera (
            fieldOfView, aspect, near, far
        );
    }

    static setupNewRenderer() {
        // setup new renderer
        let renderer = new THREE.WebGLRenderer();

        // set size
        renderer.setSize(this.getWidth(), this.getHeight());
        return renderer;
    }

    static setupDefaultDirectionalLight(x, y, z, scene) {
        let color = 0xdfebff;
        let intensity = 1;
        let light = new THREE.HemisphereLight(color, color, intensity);
        light.position.set(x, y, z);
        window.light = light;
        scene.add(light);
    }

    static setupOrbitControls(camera, renderer) {
        let controls = new TrackballControls(camera, renderer);
        controls.rotateSpeed = 1.0;
        controls.zoomSpeed = 1.2;
        controls.panSpeed = 0.8;
        controls.noZoom = false;
        controls.noPan = false;
        controls.staticMoving = true;
        controls.dynamicDampingFactor = 0.3;
        controls.keys = [ 65, 83, 68 ];
        controls.maxDistance = 5000;
        controls.minDistance = 100;
        return controls;
    }

    static setupPlaneGeometry(scene) {
        let width = 20000;
        let height = 20000;
        let widthSegments = 8;
        let heightSegments = 8;
        let loader = new THREE.TextureLoader();
        let groundTexture = loader.load( grass );
        groundTexture.wrapS = groundTexture.wrapT = THREE.RepeatWrapping;
        groundTexture.repeat.set( 25, 25 );
        groundTexture.anisotropy = 16;

        let geometry = new THREE.PlaneBufferGeometry(width, height, widthSegments, heightSegments);
        let material = new THREE.MeshLambertMaterial({map: groundTexture});
        let plane = new THREE.Mesh(geometry, material);
        plane.position.y = -350;
        plane.position.x = 200;
        plane.rotation.x = -Math.PI / 2;
        plane.receiveShadow = true;
        window.plane = plane;
        scene.add(plane);
    }

}