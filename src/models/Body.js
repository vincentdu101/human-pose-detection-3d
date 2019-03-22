import * as THREE from "three";
import partDimensions from "../data/part-dimensions.json";
import * as posenet from "@tensorflow-models/posenet";

export default class Body {

    // x left to right => negative to positive
    // y up to down => positive to negative

    constructor(scene) {
        this.scene = scene;
        this.parts = {};
        this.joints = {};
        this.default = {};

        this.createPart = (shape, material, partObj) => {
            let part = new THREE.Mesh(shape, material);                        
            this.scene.add(part);
            this.parts[partObj.part] = part;
            this.default[partObj.part] = partObj;
        }
    
        this.createBoxShape = (part) => {
            let dim = partDimensions[part];
            return new THREE.BoxGeometry(dim.width, dim.height, dim.depth);
        }

        this.createSphereShape = () => {
            let radius = 10;
            let widthSegments = 32;
            let heightSegments = 32;
            return new THREE.SphereGeometry(radius, widthSegments, heightSegments);
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
                if (part.score > 0.95) {
                    this.updatePartPosition(part.part, "x", part.position.x);
                    this.updatePartPosition(part.part, "y", -part.position.y);
                } else {
                    this.updatePartPosition(part.part, "x", this.default[part.part].x);
                    this.updatePartPosition(part.part, "y", this.default[part.part].y);
                }
            }   
        }

        this.drawSegment = (startPoint, endPoint) => {
            let start = this.parts[startPoint];
            let end = this.parts[endPoint];
            let geometry = new THREE.Geometry();
            let material = new THREE.LineBasicMaterial({color: 0x0000ff});
            geometry.vertices.push(new THREE.Vector3(start.position.x, start.position.y, 0));
            geometry.vertices.push(new THREE.Vector3(end.position.x, end.position.y, 0));
            let line = new THREE.Line(geometry, material);
            this.joints[startPoint + "_" + endPoint] = line;
            window.joints = this.joints;
            this.scene.add(line);
        }

        this.updateSegment = (startPoint, endPoint) => {
            let start = this.parts[startPoint];
            let end = this.parts[endPoint];
            let line = this.joints[startPoint + "_" + endPoint];
            if (!!line) {
                line.geometry.vertices = [];
                line.geometry.vertices.push(new THREE.Vector3(start.position.x, start.position.y, 0));
                line.geometry.vertices.push(new THREE.Vector3(end.position.x, end.position.y, 0));

            }
        }

        this.updateJoints = () => {
            let joints = Object.keys(this.joints);
            for (let joint of joints) {
                let start = joint.split("_")[0];
                let end = joint.split("_")[0];
                this.updateSegment(start, end);
            }
        }
    }

}