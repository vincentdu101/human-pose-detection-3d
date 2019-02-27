import * as THREE from "three";
import {ICoords, IPartsMap} from "../interfaces/common.interfaces";
import * as partDimensions from "../data/part-dimensions.json";

export default class Body {

    private scene: THREE.Scene;
    private parts: IPartsMap = {};

    constructor(scene: THREE.Scene) {
        this.scene = scene;
    }

    public createPart(shape: THREE.Geometry, material: THREE.Material, name: string): void {
        let part = new THREE.Mesh(shape, material);                        
        this.scene.add(part);
        this.parts[name] = part;
    }

    public createBoxShape(part: string): THREE.BoxGeometry {
        let dim = partDimensions[part];
        return new THREE.BoxGeometry(dim.width, dim.height, dim.depth);
    }

    public updatePartPositions(coords: ICoords, part: string): void {
        this.parts[part].position = coords;
    }

    public updatePartPosition(part: string, positionProp: string, position: number): void {
        this.parts[part].position[positionProp] = position;
    }

    public updatePartRotations(coords: ICoords, part: string): void {
        this.parts[part].rotation = coords;
    }

    public updatePartRotation(part: string, positionProp: string, rotation: number): void {
        this.parts[part].rotation[positionProp] = rotation;
    }

    public getPartRotation(part: string, positionProp: string): number {
        return this.parts[part].rotation[positionProp];
    }

}