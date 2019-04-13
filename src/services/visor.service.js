import * as tfvis from "@tensorflow/tfjs-vis";

export default class VisorService {

    static setupVisor() {
        this.setupVideoTab();
        document.querySelector("#show-visor").addEventListener("click", () => {
            const visorInstance = tfvis.visor();
            this.toggleMainViewComponents("none");
            this.toggleTestVideo("block");
            this.addHideListener();
            sessionStorage.setItem("detection-type", "video");

            if (!visorInstance.isOpen()) {
                visorInstance.toggle();
            }
        }); 
    }

    static setupVideoTab() {
        tfvis.visor().surface({
            name: "Video Test Tab"
        });
        const visorInstance = tfvis.visor();
        sessionStorage.setItem("detection-type", "webcam");
        visorInstance.close();
    }

    static toggleMainViewComponents(style) {
        document.querySelector("#world").style.display = style;
        document.querySelector("#main").style.display = style;
        document.querySelector(".bar-chart").style.display = style;
    }

    static toggleTestVideo(style) {
        document.querySelector("#test-video").style.display = style;
    }

    static addHideListener() {
        document.querySelector(".css-omocl").addEventListener("click", () => {
            this.toggleMainViewComponents("block");
            this.toggleTestVideo("none");
            sessionStorage.setItem("detection-type", "webcam");
        });
    }

    static showTable(keypoints) {
        const headers = ["Part", "Score"];
        const surface = {name: "Table", tab: "Charts"};

        let values = [];
        for (let keypoint of keypoints) {
            values.push([keypoint.part, keypoint.score]);
        }
        tfvis.render.table(surface, {headers, values});
    }

}