//Encapsulated globals are less bad...

import {getRandomIntExclusive, randomNumber} from "../math/random.js";
import {getColorBucket} from "../utils/getColorBucket.js";

//'mono', 'contrast', 'triade', 'tetrade', 'analogic'.
const schemeBucket = ['contrast'];

//'default', 'pastel', 'soft', 'light', 'hard', 'pale'
const variationBucket = ['hard'];

const globals = {
    layerStrategy: 'sharp',
    canvasStrategy: 'node-canvas',

    workingDirectory: `src/img/working/`,

    finalImageHeight: 1080,
    finalImageWidth: 1920,

    neutrals: [
        '#2d2d2d',
        '#1F1F1F',
        '#080808',
        /*    '#5b5b5b',*/
        /*  '#f7f5fa',
          '#eeeeee',
          '#F0F3F3',
          '#cbdae1'*/
    ],

    scheme: schemeBucket[getRandomIntExclusive(0, schemeBucket.length)],
    variations: variationBucket[getRandomIntExclusive(0, variationBucket.length)],
    hue: getRandomIntExclusive(0, 360),
    distance: randomNumber(0.6, 1),

    colorBucket: getColorBucket(), //sets palette for entire run... Not sure how I feel about this...
}

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
    return globals.layerStrategy;
}