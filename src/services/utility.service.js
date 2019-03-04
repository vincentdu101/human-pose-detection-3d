export default class UtilityService {

    static isAndroid() {
        return /Android/i.test(navigator.userAgent);
    }

    static isiOS() {
        return /iPhone|iPad|iPod/i.test(navigator.userAgent);
    }

    static isMobile() {
        return this.isAndroid() || this.isiOS();
    }

}