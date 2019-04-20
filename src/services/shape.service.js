import * as THREE from "three";
import MaterialService from "./material.service";
import GameService from "./game.service";

let shapes = [];
let speed = 25;

export default class ShapeService {

    static makeBoxShape(scene) {
        let geometry = new THREE.BoxGeometry(50, 50, 50);
        let material = MaterialService.createCustomColorMaterial("black");
        let cube = new THREE.Mesh(geometry, material);
        cube.position.x = Math.floor(Math.random(1000) * 1000);
        cube.position.y = -200;
        cube.position.z = Math.floor(Math.random(1000) * 1000);
        shapes.push(cube);
        scene.add(cube);
    }

    static moveShapesToTarget(target, scene) {
        let buffer = 6;
        target.x = Math.random(100) * 100;

        for (let i = 0; i < shapes.length; i++) {
            let shape = shapes[i];
            let xReached = shape.position.x + buffer - target.x < 2;
            let zReached = shape.position.z + buffer - target.z < 2; 

            if (xReached && zReached) {
                shapes.splice(i, 1);
                scene.remove(shape);
                return;
            } else {
                let xDirection = (shape.position.x + buffer) - target.x > 0 ? -speed : speed;
                let zDirection = (shape.position.z + buffer) - target.z > 0 ? -speed : speed;
                
                shapes[i].position.x += xDirection;
                shapes[i].position.z += zDirection;
            }
        }
    }

    static didCollisionOccur(target) {
        for (let vertexIndex = 0; vertexIndex < target.geometry.vertices.length; vertexIndex++) {
            let localVertex = target.geometry.vertices[vertexIndex].clone();
            let globalVertex = localVertex.applyMatrix4(target.matrix);
            let directionVector = globalVertex.sub(target.position);
            let ray = new THREE.Raycaster(target.position.clone(), directionVector.clone());
            let collisionResults = ray.intersectObjects(shapes);
            
            if (collisionResults.length > 0 && collisionResults[0].distance < directionVector.length()) {
                GameService.hitOccurred();
            }
        }
    }

    static removeAllShapes(scene) {
        for (let shape of shapes) {
            scene.remove(shape);
        }
        shapes = [];
    }

    static makeBoxes(scene) {
        let interval = setInterval(() => {
            if (GameService.hasGameStarted()) {
                ShapeService.makeBoxShape(scene);
            } else {
                clearInterval(interval);
            }
        }, 3000);
    }

}