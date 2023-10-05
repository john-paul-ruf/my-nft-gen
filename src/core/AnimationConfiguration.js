import {getRandomFromArray, randomId} from "./math/random.js";

export class animationConfiguration {
    constructor() {
        //For compose info
        this._INVOKER_ = 'John Ruf';
        this.runName = 'drifting'

        //For testing, render every x frame.
        this.frameInc = 1;

        //Number of frames in the final output
        this.numberOfFrame = getRandomFromArray([1800, /*1800 * 2, 1800 * 3, 1800 * 4*/]);

        this.finalFileName = 'remix-sku' + randomId();
        this.fileOut = '/Users/jpr/Library/CloudStorage/OneDrive-Personal/_ZEN_/my-nft-output/' + this.finalFileName;
    }
}

