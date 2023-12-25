import {randomId} from "../math/random.js";
import {generateFinalImageEffects, generatePrimaryEffects} from "../effect/generateEffect.js";
import {ComposeInfo} from "../utils/composeInfo.js";
import {createSingleFrame} from "./createSingleFrame.js";
import {timeLeft} from "../utils/timeLeft.js";
import {writeArtistCard} from "../output/writeArtistCard.js";
import {writeToMp4} from "../output/writeToMp4.js";
import {writeScreenCap} from "../output/writeScreenCap.js";
import fs from "fs";
import {GlobalSettings as GlobalSettings} from "../GlobalSettings.js";

export class LoopBuilder {
    constructor(settings) {
        this.settings = settings
        this.finalFileName = 'remix-sku' + randomId();
        this.config = settings.config;
    }

    async animate() {

        return new Promise(async (resolve) => {
            this.config.startTime = new Date();

            const context = {
                numberOfFrame: this.config.numberOfFrame,
                finalImageSize: GlobalSettings.getFinalImageSize(),
                workingDirectory: GlobalSettings.getWorkingDirectory(),
                layerStrategy: GlobalSettings.getLayerStrategy(),

                backgroundColor: await this.settings.getBackgroundFromBucket(),

                frameFilenames: [], //will be a collection of png images filenames that in the end gets converted to a MP4

                //This determines the final image contents
                //The effect array is super important
                //Understanding effects is key to running this program.
                effects: generatePrimaryEffects(this.settings),
                finalImageEffects: generateFinalImageEffects(this.settings),
                finalFileName: this.config.finalFileName,
            }

            for (let i = 0; i < context.effects.length; i++) {
                await context.effects[i].init();
            }

            this.composeInfo = new ComposeInfo({config: this.config, effects: context.effects, finalImageEffects: context.finalImageEffects, settings: this.settings});

            //For console info
            console.log(await this.composeInfo.composeInfo());

            ////////////////////////
            //ANIMATE - start here
            //Outer most layer of the function
            //Here we create all the frames in order
            ////////////////////////
            for (let f = 0; f < this.config.numberOfFrame; f = f + this.config.frameInc) {
                await createSingleFrame(f, context);
                console.log(`${this.finalFileName} - ${f.toString()} - ${timeLeft(this.config.startTime, f + 1, this.config.frameInc, this.config.numberOfFrame)}`);
            }

            ////////////////////////
            //WRITE TO FILE
            ////////////////////////
            await writeArtistCard(this.config, this.composeInfo);
            await writeToMp4(context.workingDirectory + this.config.finalFileName + '-frame-%d.png', this.config);
            await writeScreenCap(context.frameFilenames[0], this.config);

            for (let f = 0; f < context.frameFilenames.length; f++) {
                //delete files
                fs.unlinkSync(context.frameFilenames[f]);
            }

            resolve();
        });
    }
}