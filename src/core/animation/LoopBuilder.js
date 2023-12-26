import {generateFinalImageEffects, generatePrimaryEffects} from "../effect/generateEffect.js";
import {ComposeInfo} from "../utils/composeInfo.js";
import {timeLeft} from "../utils/timeLeft.js";
import {writeArtistCard} from "../output/writeArtistCard.js";
import {writeToMp4} from "../output/writeToMp4.js";
import {writeScreenCap} from "../output/writeScreenCap.js";
import fs from "fs";
import {GlobalSettings as GlobalSettings} from "../GlobalSettings.js";
import {LayerFactory} from "../factory/layer/LayerFactory.js";

export class LoopBuilder {
    constructor(settings) {
        this.settings = settings
        this.finalFileName = settings.config.finalFileName;
        this.config = settings.config;
    }


    //This function creates a new image (layer) for each main effect
    async #getLayers(w, h, context) {
        const extraLayers = [];
        for (let i = 0; i < context.effects.length; i++) { //effect is found in the outermost layer of this function
            extraLayers.push(await LayerFactory.getNewLayer(h, w, '#00000000'))
        }
        return extraLayers;
    }

    /////////////////////////////
    //Process the main and secondary effects
    ////////////////////////////
    async #processFrame(frameNumber, context) {
        return new Promise(async (resolve) => {

            const mainLayeredEffects = []; //will be an array of promises

            for (let i = 0; i < context.layers.length; i++) {
                /////////////////////////////////////////////////////////////////////
                // invokes one effect, which returns a promise
                // In this promise
                //      main effect occurs
                //      main effect then awaits attached secondary effects in order
                // effect promise is added to array
                /////////////////////////////////////////////////////////////////////
                mainLayeredEffects.push(context.effects[i].invokeEffect(context.layers[i], frameNumber, context.numberOfFrame));
            }

            //when all effect promises complete
            Promise.all(mainLayeredEffects).then(() => {
                //resolve process frame promise
                resolve(); //we have completed a single frame
            });
        });
    }

    /**
     * @param frameNumber - The current frame we are on.
     * @param context - holds information relevant to creating the animation
     * @returns {Promise<void>}
     *
     * This function, in general, creates an empty jimp image for each main layer effect
     * Each effect is then applied to the image
     * Then based on their order in the effects array they are composed into a single image
     */
    async #createSingleFrame(frameNumber, context) {
        return new Promise(async (resolve) => {
            ////////////////////////
            //get fresh files every loop
            ////////////////////////
            const background = await LayerFactory.getNewLayer(context.finalImageSize.height, context.finalImageSize.width, context.backgroundColor);
            context.layers = await this.#getLayers(context.finalImageSize.width, context.finalImageSize.height, context)

            /////////////////////////////
            //run all effects for frame
            ////////////////////////////
            await this.#processFrame(frameNumber, context);

            ////////////////////////
            //COMPOSE
            //Secondary Magic:  this composites the layers into one image, in order they are in the layers array.
            //Last is on top
            ///////////////////////
            for (let i = 0; i < context.layers.length; i++) {
                await background.compositeLayerOver(context.layers[i]);
            }

            ////////////////////////
            // apply final image effects one at a time
            ////////////////////////
            for (let e = 0; e < context.finalImageEffects.length; e++) {
                await context.finalImageEffects[e].invokeEffect(background, frameNumber, context.numberOfFrame);
            }

            //////////////////////
            // write to disk
            // still can run multiple instances at once
            /////////////////////
            const filename = context.workingDirectory + context.finalFileName + '-frame-' + frameNumber.toString() + '.png';
            await background.toFile(filename);
            context.frameFilenames.push(filename);

            resolve();
        });
    }

    async constructLoop() {

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

            this.composeInfo = new ComposeInfo({
                config: this.config,
                effects: context.effects,
                finalImageEffects: context.finalImageEffects,
                settings: this.settings
            });

            //For console info
            console.log(await this.composeInfo.composeInfo());

            ////////////////////////
            //ANIMATE - start here
            //Outer most layer of the function
            //Here we create all the frames in order
            ////////////////////////
            for (let f = 0; f < this.config.numberOfFrame; f = f + this.config.frameInc) {
                await this.#createSingleFrame(f, context);
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