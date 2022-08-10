//Globals are bad, mkay...

import {getRandomIntExclusive, randomNumber} from "../math/random.js";
import {getColorBucket} from "../utils/getColorBucket.js";

export const LAYERSTRATEGY = 'sharp';
export const CANVASTRATEGY = 'node-canvas';

export const WORKINGDIRETORY = `src/img/working/`;

export const IMAGEHEIGHT = 1080;
export const IMAGEWIDTH = 1920;

export const NEUTRALS = [
    /*'#2d2d2d',*/
    '#5b5b5b',
    '#f7f5fa',
    '#eeeeee',
    '#F0F3F3',
    '#cbdae1'
];

//'mono', 'contrast', 'triade', 'tetrade', 'analogic'.
const schemeBucket = ['mono', 'contrast', 'triade', 'tetrade', 'analogic'];

//'default', 'pastel', 'soft', 'light', 'hard', 'pale'
const variationBucket = ['default', 'pastel', 'soft', 'light', 'hard', 'pale'];

export const SCHEME = schemeBucket[getRandomIntExclusive(0, schemeBucket.length)];
export const VARIATION = variationBucket[getRandomIntExclusive(0, variationBucket.length)];
export const HUE = getRandomIntExclusive(0, 360);
export const DISTANCE = randomNumber(0.6, 1);


const colorBucket = getColorBucket(); //sets palette for entire run... Not sure how I feel about this...

export const getColorFromBucket = () => {
    return '#' + colorBucket[getRandomIntExclusive(0, colorBucket.length)];
}
export const getNeutralFromBucket = () => {
    return NEUTRALS[getRandomIntExclusive(0, NEUTRALS.length)]
}

