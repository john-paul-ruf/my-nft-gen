import {getRandomIntInclusive} from "./math/random.js";
import parseArgs from "minimist";


const longestSideInPixels = 1920;
const shortestSideInPixels = 1080;

//--isHoz
const argv = parseArgs(process.argv)
//console.log(argv)

const isHoz = argv.hasOwnProperty('isHoz') ? argv.isHoz === 'true' : true;

const finalImageHeight = isHoz ? shortestSideInPixels : longestSideInPixels;
const finalImageWidth = isHoz ? longestSideInPixels : shortestSideInPixels;

const workingDirectory = `src/img/working/`;

const layerStrategy = getRandomIntInclusive(1, 1) === 0 ? 'jimp' : 'sharp'

export class GlobalSettings {
    constructor() {

    }

    static getWorkingDirectory () {
        return workingDirectory;
    };

    static getFinalImageSize()  {
        return {
            width: finalImageWidth,
            height: finalImageHeight,
            longestSide: finalImageHeight > finalImageWidth ? finalImageHeight : finalImageWidth,
            shortestSide: finalImageHeight > finalImageWidth ? finalImageWidth : finalImageHeight,
        }
    };

    static getLayerStrategy()  {
        return layerStrategy;
    };


}

