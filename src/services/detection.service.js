import * as posenet from "@tensorflow-models/posenet";
import State from "../models/State";
import VideoService from "./video.service";
import * as d3 from "d3";

const color = "aqua";
const scale = 1;
const lineWidth = 2;
const state = State.defaultState();
const width = VideoService.getVideoWidth();
const height = VideoService.getVideoHeight();
const margin = {top: 20, right: 10, bottom: 30, left: 30};

let detectionType = "webcam";

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

    static drawKeypoints(keypoints, minPartConfidence, ctx) {
        for (let i = 0; i < keypoints.length; i++) {
            const keypoint = keypoints[i];

            if (keypoint.score < minPartConfidence) {
                continue;
            }

            const {y, x} = keypoint.position;
            this.drawPoint(ctx, y * scale, x * scale, 3, color);
        }
    }

    static drawPose(pose, context) {
        if (pose.score >= state.singlePoseDetection.minPoseConfidence) {
            let minPartConfidence = state.singlePoseDetection.minPartConfidence;
            this.drawKeypoints(pose.keypoints, minPartConfidence, context);
            this.drawSkeleton(pose.keypoints, minPartConfidence, context);
        }
    }

    static updateContext(context, video) {
        context.clearRect(0, 0, width, height);
        context.save();
        context.scale(-1, 1);
        context.translate(-width, 0);
        
        if (!!video) {
            context.drawImage(video, 0, 0, width, height);
        }
        context.restore();
   
    }

    static drawAxes() {
        let axes = this.isWebCamDetection() ? "#skeleton-axes" : "#skeleton-test-axes";
        let svg = d3.select(axes)
                    .attr("width", width - 1)
                    .attr("height", height - 1)
                    .append("g")
                    .style("transform", "translate(" + margin.left + ", " + margin.top + ")");
    
        let xScale = d3.scaleLinear()
            .domain([0, 300])
            .range([0, width]);

        let yScale = d3.scaleLinear() 
            .domain([0, 300])
            .range([height, 0]);

        let xAxis = d3.axisBottom(xScale)
            .ticks(20)
            .tickSize(-width);

        let yAxis = d3.axisLeft(yScale)
            .ticks(20)
            .tickSize(-height * 2);

        let xAxisSvg = svg.append("g")
            .attr("class", "x-axis grid")
            .attr("transform", "translate(0, " + (height - margin.bottom)  + ")")
            .call(xAxis);

        let yAxisSvg = svg.append("g")
            .attr("class", "y-axis grid")
            .attr("transform", "translate(" + margin.left + ", 0)")
            .call(yAxis);

    }

    static outputPureSkeleton(pose, output) {
        // get canvas and context
        const canvas = document.getElementById(output);
        const context = canvas.getContext("2d");

        canvas.width = width;
        canvas.height = height;
        
        this.updateContext(context);
        this.drawPose(pose, context);

        this.drawAxes();
    }

    static outputVideoSkeleton(pose, video, output) {
        // get canvas and context
        const canvas = document.getElementById(output);
        const context = canvas.getContext("2d");

        canvas.width = width;
        canvas.height = height;

        this.updateContext(context, video);
        this.drawPose(pose, context);
    }

    static outputVideoBasedSkeleton(keypoints, output, scale = 1) {
        const canvas = document.getElementById(output);
        const context = canvas.getContext("2d");

        const adjKeyPoints = posenet.getAdjacentKeyPoints(keypoints, state.singlePoseDetection.minPartConfidence);
        
        adjKeyPoints.forEach((keypoints) => {
            this.drawSegment(
                toTuple(keypoints[0].position), 
                toTuple(keypoints[1].position), 
                "aqua", 
                scale, 
                context
            );
        });
    }
 
    static outputPoseInVideo(pose, video) {
        if (this.isWebCamDetection()) {
            this.outputPureSkeleton(pose, "skeleton-output");
            this.outputVideoSkeleton(pose, video, "webcam-output");   
        } else {
            const videoTest = "video-test-output";
            const canvas = document.getElementById(videoTest);
            const ctx = canvas.getContext("2d");

            this.drawKeypoints(pose.keypoints, state.singlePoseDetection.minPartConfidence, ctx);
            this.outputVideoSkeleton(pose, video, videoTest);             
            this.outputVideoBasedSkeleton(pose.keypoints, videoTest);
        }
    }

    static isWebCamDetection() {
        return sessionStorage.getItem("detection-type") === "webcam";
    }

}