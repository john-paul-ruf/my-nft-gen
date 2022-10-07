//Encapsulated globals are less bad...
import {getRandomIntExclusive, randomNumber} from "./math/random.js";
import ColorScheme from "color-scheme";

//'mono', 'contrast', 'triade', 'tetrade', 'analogic'.
const schemeBucket = ['contrast', 'triade', 'tetrade', 'analogic'];
//'default', 'pastel', 'soft', 'light', 'hard', 'pale'
const variationBucket = ['default', 'pastel', 'soft', 'light', 'hard'];

class globalSettings {
    constructor() {
        this.layerStrategy = 'sharp';
        this.canvasStrategy = 'node-canvas';
        this.workingDirectory = `src/img/working/`;
        this.finalImageHeight = 1920;
        this.finalImageWidth = 1080;
        this.neutrals = [
            '#FFFFFF',
            /*  '#1F1F1F',
              '#080808',*/
            /*    '#5b5b5b',*/
            /*  '#f7f5fa',
              '#eeeeee',
              '#F0F3F3',
              '#cbdae1'*/
        ];
        this.scheme = schemeBucket[getRandomIntExclusive(0, schemeBucket.length)];
        this.variations = variationBucket[getRandomIntExclusive(0, variationBucket.length)];
        this.hue = getRandomIntExclusive(0, 360);
        this.distance = randomNumber(0.1, 0.6);
        this.colorBucket = this.getColorBucket()
    }

    getColorBucket() {
        const bucket = new ColorScheme();
        return bucket.from_hue(this.hue)
            .scheme(this.scheme)
            .distance(this.distance)
            .variation(this.variations)
            .colors();
    }
}

const globals = new globalSettings();

export const getColorFromBucket = () => {
    return '#' + globals.colorBucket[getRandomIntExclusive(0, globals.colorBucket.length)];
}

export const getNeutralFromBucket = () => {
    return globals.neutrals[getRandomIntExclusive(0, globals.neutrals.length)]
}

export const getSchemeInfo = () => {
    return {
        scheme: globals.scheme,
        variations: globals.variations,
        hue: globals.hue,
        distance: globals.distance
    }
}

export const getWorkingDirectory = () => {
    return globals.workingDirectory;
}

export const getFinalImageSize = () => {
    return {
        width: globals.finalImageWidth,
        height: globals.finalImageHeight
    }
}

export const getLayerStrategy = () => {
    return globals.layerStrategy;
}

export const getCanvasStrategy = () => {
    return globals.canvasStrategy;
}