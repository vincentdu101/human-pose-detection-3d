import * as THREE from "three";

export default class MaterialService {

    static createWireframeMaterial() {
        // create material 
        let materialColor = 0xaaaaaa;
        let wireframe = true;
        return new THREE.MeshBasicMaterial({
            color: materialColor, wireframe
        });
    }

    static createCustomColorMaterial(color) {
        // create material 
        let materialColor = color;
        let wireframe = false;
        return new THREE.MeshBasicMaterial({
            color: materialColor, wireframe
        });
    }

}