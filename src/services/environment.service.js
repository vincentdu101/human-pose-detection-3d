import * as THREE from "three";
import TrackballControls from "three-trackballcontrols";
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
        let fieldOfView = 75;
        let aspect = this.getWidth() / this.getHeight();
        let near = 0.1;
        let far = 1000;

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
        let light = new THREE.DirectionalLight(color, intensity);
        light.position.set(x, y, z);
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
        return controls;
    }

    static setupPlaneGeometry(scene) {
        let width = 2000;
        let height = 3000;
        let widthSegments = 8;
        let heightSegments = 8;
        let geometry = new THREE.PlaneBufferGeometry(width, height, widthSegments, heightSegments);
        let material = new THREE.MeshBasicMaterial({color: 0x000000, side: THREE.DoubleSide});
        let plane = new THREE.Mesh(geometry, material);
        plane.position.y = 0;
        scene.add(plane);
    }

}