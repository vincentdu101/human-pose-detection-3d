import * as THREE from "three";
import partDimensions from "../data/part-dimensions.json";

export default class Body {

    constructor(scene) {
        this.scene = scene;
        this.parts = {};

        this.createPart = (shape, material, name) => {
            let part = new THREE.Mesh(shape, material);                        
            this.scene.add(part);
            this.parts[name] = part;
        }
    
        this.createBoxShape = (part) => {
            let dim = partDimensions[part];
            return new THREE.BoxGeometry(dim.width, dim.height, dim.depth);
        }
    
        this.updatePartPositions = (coords, part) => {
            this.parts[part].position = coords;
        }
    
        this.updatePartPosition = (part, positionProp, position) => {
            this.parts[part].position[positionProp] = position;
        }
    
        this.updatePartRotations = (coords, part) => {
            this.parts[part].rotation = coords;
        }
    
        this.updatePartRotation = (part, positionProp, rotation) => {
            this.parts[part].rotation[positionProp] = rotation;
        }
    
        this.getPartRotation = (part, positionProp) => {
            return this.parts[part].rotation[positionProp];
        }

        this.updatePartPositions = (parts) => {
            for (let part of parts) {
                console.log(part);
                this.updatePartPosition(part.part, "x", part.position.x);
                this.updatePartPosition(part.part, "y", part.position.y);
            }   
        }
    }

}