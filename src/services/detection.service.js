import * as posenet from "@tensorflow-models/posenet";
import State from "../models/State";
import VideoService from "./video.service";

const color = "aqua";
const scale = 1;
const lineWidth = 2;

function toTuple({y, x}) {
    return [y, x];
}

export default class DetectionService {

    static drawPoint(context, y, x, r, color) {
        context.beginPath();
        context.arc(x, y, r, 0, 2 * Math.PI);
        context.fillStyle = color;
        context.fill();
    }

    static drawSegment([ay, ax], [by, bx], color, scale, context) {
        context.beginPath();
        context.moveTo(ax * scale, ay * scale);
        context.lineTo(bx * scale, by * scale);
        context.lineWidth = lineWidth;
        context.strokeStyle = color;
        context.stroke();
    }

    static drawSkeleton(keypoints, minPartConfidence, context) {
        const adjkeyPoints = posenet.getAdjacentKeyPoints(keypoints, minPartConfidence);

        adjkeyPoints.forEach((keypoints) => {
            let start = toTuple(keypoints[0].position);
            let end = toTuple(keypoints[1].position);
            this.drawSegment(start, end, color, scale, context);
        });
    }

    static drawKeypoints(keypoints, minPartConfidence, context) {
        for (let i = 0; i < keypoints.length; i++) {
            const keypoint = keypoints[i];

            if (keypoint.score < minPartConfidence) {
                continue;
            }

            const {y, x} = keypoint.position;
            this.drawKeypoints(context, y * scale, x * scale, 3, color);
        }
    }
 
    static outputPoseInVideo(pose) {
        const state = State.defaultState();

        // get canvas and context
        const canvas = document.getElementById("output");
        const context = canvas.getContext("2d");

        canvas.width = VideoService.getVideoWidth();
        canvas.height = VideoService.getVideoHeight();

        context.clearRect(0, 0, canvas.width, canvas.height);
        context.save();
        context.scale(-1, 1);
        context.translate(-canvas.width, 0);
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        context.restore();
        
        if (pose.score >= state.singlePoseDetection.minPoseConfidence) {
            let minPartConfidence = state.singlePoseDetection.minPartConfidence;
            this.drawKeypoints(pose.keypoints, minPartConfidence, context);
            this.drawSkeleton(pose.keypoints, minPartConfidence, context);
        }
    }

}