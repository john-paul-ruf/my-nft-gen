//Encapsulated globals are less bad...
import {getRandomIntExclusive, getRandomIntInclusive} from "./math/random.js";
import {possibleColorSchemes, RandomColorScheme} from "./RandomColorScheme.js";
import parseArgs from 'minimist';

const longestSideInPixels = 1280;
const shortestSideInPixels = 720;

//--isHoz
const argv = parseArgs(process.argv)
//console.log(argv)

const isHoz = argv.hasOwnProperty('isHoz') ? argv.isHoz === 'true' : true;

const finalImageHeight = isHoz ? shortestSideInPixels : longestSideInPixels;
const finalImageWidth = isHoz ? longestSideInPixels : shortestSideInPixels;

class globalSettings {
    constructor() {
        this.randomColorScheme = new RandomColorScheme();

        //todo: random color scheme should take a list of possible color schemes and pick from the list.
        this.randomColorScheme = new RandomColorScheme(possibleColorSchemes.paulTovVibrant);

        this.layerStrategy = getRandomIntInclusive(1, 1) === 0 ? 'jimp' : 'sharp'
        this.canvasStrategy = 'node-canvas';

        this.workingDirectory = `src/img/working/`;


        //For 2D palettes
        this.neutrals = [
            '#0c0c0c',
        ];

        //For 2D palettes
        this.backgrounds = [
            '#0c0c0c',
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

let globals = null;

export const resetGlobalSettings = () => {
    globals = new globalSettings();
}

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
        width: finalImageWidth,
        height: finalImageHeight,
        longestSide: finalImageHeight > finalImageWidth ? finalImageHeight : finalImageWidth,
        shortestSide: finalImageHeight > finalImageWidth ? finalImageWidth : finalImageHeight,
    }
}

export const getLayerStrategy = () => {
    return globals.layerStrategy;
}

export const getCanvasStrategy = () => {
    return globals.canvasStrategy;
}
