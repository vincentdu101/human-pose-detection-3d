import * as THREE from "three";

export interface ICoords {
    x: number, y: number, z: number
};

export interface IPartsMap {
    nose?: THREE.Mesh
    leftEye?: THREE.Mesh
    rightEye?: THREE.Mesh
    leftEar?: THREE.Mesh
    rightEar?: THREE.Mesh
    leftShoulder?: THREE.Mesh
    rightShoulder?: THREE.Mesh
    leftElbow?: THREE.Mesh
    rightElbow?: THREE.Mesh
    leftWrist?: THREE.Mesh
    rightWrist?: THREE.Mesh
    leftHip?: THREE.Mesh
    rightHip?: THREE.Mesh
    leftKnee?: THREE.Mesh
    rightKnee?: THREE.Mesh
    leftAnkle?: THREE.Mesh
    rightAnkle?: THREE.Mesh
};