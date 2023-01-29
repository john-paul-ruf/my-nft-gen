//Encapsulated globals are less bad...
import {getRandomIntExclusive, getRandomIntInclusive} from "./math/random.js";
import {RandomColorScheme} from "./RandomColorScheme.js";
import parseArgs from 'minimist';

const longestSideInPixels = 1980;
const shortestSideInPixels = 1080;

//--isHoz
const argv = parseArgs(process.argv)
//console.log(argv)

const isHoz = argv.hasOwnProperty('isHoz') ? argv.isHoz === 'true' : true;

const finalImageHeight = isHoz ? shortestSideInPixels : longestSideInPixels;
const finalImageWidth = isHoz ? longestSideInPixels : shortestSideInPixels;

class globalSettings {
    constructor() {
        this.randomColorScheme = new RandomColorScheme();

        //override - love me some neons
        this.randomColorScheme = new RandomColorScheme(/*possibleColorSchemes.neons*/);

        this.layerStrategy = getRandomIntInclusive(1, 1) === 0 ? 'jimp' : 'sharp'
        this.canvasStrategy = 'node-canvas';

        this.workingDirectory = `src/img/working/`;


        //For 2D palettes
        this.neutrals = [
            '#000000',/*
            '#1F1F1F',
            '#5b5b5b',
            '#7f7f7f',*/];

        //For 2D palettes
        this.backgrounds = [
            /* '#000000',*/
            '#000000',
            /* '#FFFFFF',*/
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
