//Globals are bad, mkay...
import {getColorBucket} from "./getColorBucket.js";
import {getRandomIntExclusive} from "./random.js";

export const IMAGESIZE = 2000;
export const NEUTRALS = ['#2d2d2d', '#5b5b5b', '#f7f5fa'];

//'mono', 'contrast', 'triade', 'tetrade', and 'analogic'.
const schemeBucket = ['contrast', 'triade', 'tetrade', 'analogic'];

//'default', 'pastel', 'soft', 'light', 'hard', 'pale'
const variationBucket = ['default', 'hard' ];

export const SCHEME = schemeBucket[getRandomIntExclusive(0, schemeBucket.length)];
export const VARIATION = variationBucket[getRandomIntExclusive(0, variationBucket.length)];
export const HUE = getRandomIntExclusive(0,360);


const colorBucket = getColorBucket(); //sets palette for entire run... Not sure how I feel about this...

export const getColorFromBucket = () => {return '#' + colorBucket[getRandomIntExclusive(0, colorBucket.length)];}
export const getNeutralFromBucket = () => {return NEUTRALS[getRandomIntExclusive(0, NEUTRALS.length)]}

