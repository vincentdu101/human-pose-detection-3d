import * as THREE from "three";
import {OrbitControls} from "three-orbitcontrols-ts";

export default class EnvironmentService {

    private static color = 0xffffff;
    private static intensity = 0.1;

    public static setupNewScene(): THREE.Scene {
        // create the scene
        return new THREE.Scene();
    }

    public static setupNewPerspectiveCamera(): THREE.PerspectiveCamera {
        // create the camera
        let fieldOfView = 75;
        let aspect = window.innerWidth / window.innerHeight;
        let near = 0.1;
        let far = 1000;

        return new THREE.PerspectiveCamera (
            fieldOfView, aspect, near, far
        );
    }

    public static setupNewRenderer(): THREE.Renderer {
        // setup new renderer
        let renderer = new THREE.WebGLRenderer();

        // set size
        renderer.setSize(window.innerWidth, window.innerHeight);
        return renderer;
    }

    public static setupDefaultDirectionalLight(x: number, y: number, z: number, scene: THREE.Scene): void {
        let light = new THREE.DirectionalLight(this.color, this.intensity);
        light.position.set(x, y, z);
        scene.add(light);
    }

    public static setupOrbitControls(camera: THREE.Camera): OrbitControls {
        let controls = new OrbitControls(camera);
        controls.target.set(0, 0, 0);
        return controls;
    }

}