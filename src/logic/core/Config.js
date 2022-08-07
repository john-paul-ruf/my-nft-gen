import path, {dirname} from "path";
import {fileURLToPath} from 'url';
import {randomId} from "../math/random.js";

export class Config {
    constructor() {

        const fileURLToPath1 = fileURLToPath(import.meta.url);
        const directory = dirname(fileURLToPath1).replace('/logic/core', '');

        //For compose info
        this._INVOKER_ = 'John Ruf - Bookstore Illuminati';
        this.runName = 'scopes'

        //final color depth of image
        //Only used when frames are output to gif
        this.colorDepth = 256;

        //For testing, render every x frame.
        this.frameInc = 1;

        //Number of frames in the final output
        this.numberOfFrame = 200;

        this.finalFileName = 'Final' + randomId();
        this.fileOut = path.join(directory, '/img/output/' + this.finalFileName);
    }
}

