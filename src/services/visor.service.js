import * as tfvis from "@tensorflow/tfjs-vis";

export default class VisorService {

    static setupVisor() {
        this.setupVideoTab();
        document.querySelector("#show-visor").addEventListener("click", () => {
            const visorInstance = tfvis.visor();
            if (!visorInstance.isOpen()) {
                visorInstance.toggle();
            }
        }); 
    }

    static setupVideoTab() {
        tfvis.visor().surface({
            name: "Video Test Tab"
        });
    }

}