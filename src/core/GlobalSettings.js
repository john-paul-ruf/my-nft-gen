//Encapsulated globals are less bad...
import {getRandomIntExclusive} from "./math/random.js";
import {RandomColorScheme} from "./RandomColorScheme.js";

class globalSettings {
    constructor() {
        this.randomColorScheme = new RandomColorScheme();

        this.layerStrategy = 'sharp';
        this.canvasStrategy = 'node-canvas';

        this.workingDirectory = `src/img/working/`;

        this.finalImageHeight = 1920;
        this.finalImageWidth = 1080;

        //For 2D palettes
        this.neutrals = [
            '#000000',/*
            '#1F1F1F',
            '#5b5b5b',
            '#7f7f7f',*/];

        //For 2D palettes
        this.backgrounds = [
            '#FFFFFF',
        ];

        //for three-dimensional lighting
        this.lights = [
            '#44ee44',
            '#ee4444',
            '#4444ee',
            '#ee44ee',
            '#eeee44',
            '#44eeee',]
    }
}

const globals = new globalSettings();

export const getColorFromBucket = () => {
    return globals.randomColorScheme.getColorFromBucket();
}

export const getNeutralFromBucket = () => {
    return globals.neutrals[getRandomIntExclusive(0, globals.neutrals.length)]
}

export const getBackgroundFromBucket = () => {
    return globals.backgrounds[getRandomIntExclusive(0, globals.backgrounds.length)]
}

export const getLightFromBucket = () => {
    return globals.lights[getRandomIntExclusive(0, globals.lights.length)]
}

export const getColorSchemeInfo = () => {
    return globals.randomColorScheme.getColorSchemeInfo();
}

export const getWorkingDirectory = () => {
    return globals.workingDirectory;
}

export const getFinalImageSize = () => {
    return {
        width: globals.finalImageWidth, height: globals.finalImageHeight
    }
}

export const getLayerStrategy = () => {
    return globals.layerStrategy;
}

export const getCanvasStrategy = () => {
    return globals.canvasStrategy;
}
