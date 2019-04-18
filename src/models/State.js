export default class State {

    static defaultState() {
        return {
            algorithm: "multi-pose",
            input: {
              mobileNetArchitecture: false ? "0.50" : "0.75",
              outputStride: 32,
              imageScaleFactor: 0.5,
            },
            singlePoseDetection: {
              minPoseConfidence: 0.1,
              minPartConfidence: 0.5,
            },
            multiPoseDetection: {
              maxPoseDetections: 5,
              minPoseConfidence: 0.15,
              minPartConfidence: 0.1,
              nmsRadius: 30.0,
            },
            output: {
              showVideo: true,
              showSkeleton: true,
              showPoints: true,
              showBoundingBox: false,
            },
            net: null,
          };
    }

}