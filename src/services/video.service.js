import UtilityService from "../services/utility.service";

export default class VideoService {

    static getVideoWidth() {
        return 400;
    }

    static getVideoHeight() {
        return 300;
    }

    static isNavigatorAPINotReady() {
        return !navigator || !navigator.mediaDevices.getUserMedia;
    }

    static setupCamera() {
        if (this.isNavigatorAPINotReady()) {
            throw new Error("Browser API Navigator not ready");
        }

        const video = document.getElementById("video");
        const mobile = UtilityService.isMobile();
        video.width = this.getVideoWidth();
        video.height = this.getVideoHeight();

        // getting webcam video feed
        navigator.mediaDevices.getUserMedia({
            "audio": false,
            "video": {
                facingMode: "user",
                width: mobile ? undefined : this.getVideoWidth(),
                height: mobile ? undefined : this.getVideoHeight()
            }
        }).then((stream) => {
            // load webcam stream into video src
            video.srcObject = stream;
        });

        return new Promise((resolve) => {
            video.onloadedmetadata = () => {
                resolve(video);
            }
        });
    }

    static loadVideo() {
        return new Promise((resolve) => {
            this.setupCamera().then((video) => {
                video.play();
                return resolve(video);
            }); 
        });
    }

}
