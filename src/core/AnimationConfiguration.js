import {dirname} from "path";
import {fileURLToPath} from 'url';
import {randomId} from "./math/random.js";

export class animationConfiguration {
    constructor() {

        //todo: make this so we don't have to change it every time we refactor folder structure
        const fileURLToPath1 = fileURLToPath(import.meta.url);
        const directory = dirname(fileURLToPath1).replace('/core', '');

        //For compose info
        this._INVOKER_ = 'John Ruf';
        this.runName = 'the return of the hex'

        //For testing, render every x frame.
        this.frameInc = 1;

        //Number of frames in the final output
        this.numberOfFrame = 300;

        this.finalFileName = 'Final' + randomId();
        this.fileOut = '/Users/jpr/Library/CloudStorage/OneDrive-Personal/_ZEN_/my-nft-output/' + this.finalFileName;
    }
}

