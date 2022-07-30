import path from "path";
import {fileURLToPath} from 'url';
import {dirname} from 'path';
import {randomId} from "./random.js";

export class Config {
    constructor() {

        const fileURLToPath1 = fileURLToPath(import.meta.url);
        const directory = dirname(fileURLToPath1).replace('/logic', '');

        //No worries, just variable names.  It's cute, isn't it?
        //It is how I think of layers in my head when working in illustrator
        //For compose info
        this._INVOKER_ = 'John Ruf - Bookstore Illuminati';
        this.runName = 'the-mp4-run'

        //final color depth of image
        this.colorDepth = 256;

        //For testing, render every x frame.
        this.frameInc = 60;

        //Number of frames in the final gif
        this.numberOfFrame = 70;

        this.finalFileName = 'Final_' + randomId();
        this.fileOut = path.join(directory, '/img/output/' + this.finalFileName);
    }
}

