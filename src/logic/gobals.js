//Globals are bad, mkay...
import {getColorBucket} from "./getColorBucket.js";
import {getRandomInt} from "./random.js";

export const imageSize = 2000;
export const neutrals = ['#535353', '#5b5b5b', '#c4c4c4', '#f7f5fa', '#828282'];

const colorBucket = getColorBucket(); //sets palette for entire run... Not sure how I feel about this...
export const getColorFromBucket = () => {return '#' + colorBucket[getRandomInt(0, colorBucket.length)];}