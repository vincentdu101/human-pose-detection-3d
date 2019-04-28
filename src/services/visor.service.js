import * as tfvis from "@tensorflow/tfjs-vis";

export default class VisorService {

    static setupVisor() {
        this.setupVideoTab();
        document.querySelector("#show-visor").addEventListener("click", () => {
            const visorInstance = tfvis.visor();
            this.toggleMainViewComponents("none");
            this.toggleTestVideo("");
            this.addHideListener();
            sessionStorage.setItem("detection-type", "video");

            if (!visorInstance.isOpen()) {
                visorInstance.toggle();
            }
        }); 

        document.querySelector("#hide-visor").addEventListener("click", () => {
            const visorInstance = tfvis.visor();
            visorInstance.toggle();
            this.stopTestMode();
        });
    }

    static setupVideoTab() {
        const visorInstance = tfvis.visor();
        sessionStorage.setItem("detection-type", "webcam");
        visorInstance.close();
    }

    static toggleMainViewComponents(style) {
        document.querySelector("#world").style.display = style;
        document.querySelector("#main").style.display = style;
        document.querySelector("#start-game").style.display = style;
        document.querySelector("#stop-game").style.display = style;
        document.querySelector("#show-visor").style.display = style;
        document.querySelector(".lives-left").style.display = style;
        document.querySelector(".timer-left").style.display = style;
    }

    static toggleTestVideo(style) {
        document.querySelector("#test-video").style.display = style;
        document.querySelector("#hide-visor").style.display = style;
    }

    static addHideListener() {
        document.querySelector(".css-omocl").addEventListener("click", () => {
            this.stopTestMode();
        });
    }

    static stopTestMode() {
        this.toggleMainViewComponents("");
        this.toggleTestVideo("none");
        sessionStorage.setItem("detection-type", "webcam");
    }

    static showTable(keypoints) {
        const headers = ["Part", "Score"];
        const surface = {name: "Parts Score Accuracy", tab: "Accuracy"};

        let values = [];
        for (let keypoint of keypoints) {
            values.push([keypoint.part, keypoint.score]);
        }
        tfvis.render.table(surface, {headers, values});
    }

}