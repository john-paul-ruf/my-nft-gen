import {ComposeInfo} from "../utils/composeInfo.js";
import {timeLeft} from "../utils/timeLeft.js";
import {writeArtistCard} from "../output/writeArtistCard.js";
import {writeToMp4} from "../output/writeToMp4.js";
import {writeScreenCap} from "../output/writeScreenCap.js";
import fs from "fs";
import {GlobalSettings as GlobalSettings} from "../GlobalSettings.js";
import {LayerFactory} from "../factory/layer/LayerFactory.js";
import {getRandomIntExclusive} from "../math/random.js";
import {Effect} from "../effect/Effect.js";

export class LoopBuilder {
    constructor(settings) {
        this.settings = settings
        this.finalFileName = settings.config.finalFileName;
        this.config = settings.config;

        this.context = {
            numberOfFrame: this.config.numberOfFrame,
            finalImageSize: GlobalSettings.getFinalImageSize(),
            workingDirectory: GlobalSettings.getWorkingDirectory(),
            layerStrategy: GlobalSettings.getLayerStrategy(),

            frameFilenames: [], //will be a collection of png images filenames that in the end gets converted to a MP4

            //This determines the final image contents
            //The effect array is super important
            //Understanding effects is key to running this program.
            effects: this.#generatePrimaryEffects(this.settings),
            finalImageEffects: this.#generateFinalImageEffects(this.settings),
            finalFileName: this.config.finalFileName,
        }

        //order in array represents layer order of final image
        this.allPrimaryEffects = settings.allPrimaryEffects;
        this.allSecondaryEffects = settings.allPrimaryEffects;
        this.allFinalImageEffects = settings.allPrimaryEffects

    }

    #generateEffects(possibleEffectList) {
        const effectList = [];

        //For each effect in the possible effects list.
        possibleEffectList.forEach(obj => {
            const chance = getRandomIntExclusive(0, 100) //roll the dice
            if (obj.effectChance > chance) { //if the roll was below the chance of hit
                effectList.push(new Effect(obj.effect, this.settings, obj.ignoreAdditionalEffects, this.#applySecondaryEffects()));
            }
        })

        return effectList;
    }

    #generatePrimaryEffects() {
        return this.#generateEffects(this.settings.allPrimaryEffects)
    }

    #applySecondaryEffects() {
        return this.#generateEffects(this.settings.allSecondaryEffects)
    }


    #generateFinalImageEffects() {
        return this.#generateEffects(this.settings.allFinalImageEffects)
    }


    //This function creates a new image (layer) for each main effect
    async #getLayers(w, h) {
        const extraLayers = [];
        for (let i = 0; i < this.context.effects.length; i++) { //effect is found in the outermost layer of this function
            extraLayers.push(await LayerFactory.getNewLayer(h, w, '#00000000'))
        }
        return extraLayers;
    }

    /////////////////////////////
    //Process the main and secondary effects
    ////////////////////////////
    async #processFrame(frameNumber) {
        return new Promise(async (resolve) => {

            const mainLayeredEffects = []; //will be an array of promises

            for (let i = 0; i < this.context.layers.length; i++) {
                /////////////////////////////////////////////////////////////////////
                // invokes one effect, which returns a promise
                // In this promise
                //      main effect occurs
                //      main effect then awaits attached secondary effects in order
                // effect promise is added to array
                /////////////////////////////////////////////////////////////////////
                mainLayeredEffects.push(this.context.effects[i].invokeEffect(this.context.layers[i], frameNumber, this.context.numberOfFrame));
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
            const background = await LayerFactory.getNewLayer(this.context.finalImageSize.height, this.context.finalImageSize.width, this.context.backgroundColor);
            this.context.layers = await this.#getLayers(this.context.finalImageSize.width, this.context.finalImageSize.height, context)

            /////////////////////////////
            //run all effects for frame
            ////////////////////////////
            await this.#processFrame(frameNumber, context);

            ////////////////////////
            //COMPOSE
            //Secondary Magic:  this composites the layers into one image, in order they are in the layers array.
            //Last is on top
            ///////////////////////
            for (let i = 0; i < this.context.layers.length; i++) {
                await background.compositeLayerOver(this.context.layers[i]);
            }

            ////////////////////////
            // apply final image effects one at a time
            ////////////////////////
            for (let e = 0; e < this.context.finalImageEffects.length; e++) {
                await this.context.finalImageEffects[e].invokeEffect(background, frameNumber, this.context.numberOfFrame);
            }

            //////////////////////
            // write to disk
            // still can run multiple instances at once
            /////////////////////
            const filename = this.context.workingDirectory + this.context.finalFileName + '-frame-' + frameNumber.toString() + '.png';
            await background.toFile(filename);
            this.context.frameFilenames.push(filename);

            resolve();
        });
    }

    async constructLoop() {

        return new Promise(async (resolve) => {

            this.config.startTime = new Date();
            this.context.backgroundColor = await this.settings.getBackgroundFromBucket();

            for (let i = 0; i < this.context.effects.length; i++) {
                await this.context.effects[i].init();
            }

            this.composeInfo = new ComposeInfo({
                config: this.config,
                effects: this.context.effects,
                finalImageEffects: this.context.finalImageEffects,
                settings: this.settings
            });

            console.log(await this.composeInfo.composeInfo())

            ////////////////////////
            //ANIMATE - start here
            //Outer most layer of the function
            //Here we create all the frames in order
            ////////////////////////
            for (let f = 0; f < this.config.numberOfFrame; f = f + this.config.frameInc) {
                await this.#createSingleFrame(f, this.context);
                console.log(`${this.finalFileName} - ${f.toString()} - ${timeLeft(this.config.startTime, f + 1, this.config.frameInc, this.config.numberOfFrame)}`);
            }

            ////////////////////////
            //WRITE TO FILE
            ////////////////////////
            await writeArtistCard(this.config, this.composeInfo);
            await writeToMp4(this.context.workingDirectory + this.config.finalFileName + '-frame-%d.png', this.config);
            await writeScreenCap(this.context.frameFilenames[0], this.config);

            for (let f = 0; f < this.context.frameFilenames.length; f++) {
                //delete files
                fs.unlinkSync(this.context.frameFilenames[f]);
            }

            resolve();
        });
    }
}