import * as THREE from "three";

export default class MaterialService {

    public static createWireframeMaterial(): THREE.Material {
        // create material 
        let materialColor = 0xaaaaaa;
        let wireframe = true;
        return new THREE.MeshBasicMaterial({
            color: materialColor, wireframe
        });
    }

}