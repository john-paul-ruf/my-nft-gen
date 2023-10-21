//Encapsulated globals are less bad...
import {getRandomFromArray, getRandomIntExclusive, getRandomIntInclusive} from "./math/random.js";
import parseArgs from 'minimist';
import {NeonColorScheme, NeonColorSchemeFactory} from "./color/NeonColorSchemeFactory.js";

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

        const availableColorSchemes = [NeonColorScheme.neons, NeonColorScheme.blueNeons, NeonColorScheme.redNeons, NeonColorScheme.greenNeons];

        this.colorScheme = NeonColorSchemeFactory.getColorScheme(getRandomFromArray(availableColorSchemes));

        this.layerStrategy = getRandomIntInclusive(1, 1) === 0 ? 'jimp' : 'sharp'
        this.canvasStrategy = 'node-canvas';

        this.workingDirectory = `src/img/working/`;


        //For 2D palettes
        this.neutrals = [
            '#000000',
        ];

        //For 2D palettes
        this.backgrounds = [
            '#2d2d2d',
        ];

        //for three-dimensional lighting
        this.lights = [
            '#FFFF00',
            '#FF00FF',
            '#00FFFF',
            '#FF0000',
            '#00FF00',
            '#0000FF',
        ]
    }
}

let globals = null;

export const resetGlobalSettings = () => {
    globals = new globalSettings();
}

export const getColorFromBucket = () => {
    return globals.colorScheme.getColorFromBucket();
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
    return globals.colorScheme.getColorSchemeInfo();
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
