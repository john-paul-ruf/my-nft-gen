import {randomId} from "./math/random.js";

export class animationConfiguration {
    constructor() {
        //For compose info
        this._INVOKER_ = 'John Ruf';
        this.runName = 'glitched'

        //For testing, render every x frame.
        this.frameInc = 1;

        //Number of frames in the final output
        this.numberOfFrame = 1800;

        this.finalFileName = 'remix-sku' + randomId();
        this.fileOut = '/Users/jpr/Library/CloudStorage/OneDrive-Personal/_ZEN_/my-nft-output/' + this.finalFileName;
    }
}

