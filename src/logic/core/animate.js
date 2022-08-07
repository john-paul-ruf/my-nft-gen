import {generateFinalImageEffects, generatePrimaryEffects} from "../../effects/control/generateEffect.js";
import {composeInfo} from "./composeInfo.js";
import {getNeutralFromBucket, IMAGESIZE, LAYERSTRATEGY, WORKINGDIRETORY} from "./gobals.js";
import {writeArtistCard} from "../../output/writeArtistCard.js";
import fs from "fs";
import {writeToMp4} from "../../output/writeToMp4.js";
import {LayerFactory} from "../../layer/LayerFactory.js";
import {timeLeft} from "../utils/timeLeft.js";

/**
 * @param config - Responsible for filename of gif, total number of frames, gif color depth, and if to skip frames ( frameInc )
 * @returns {Promise<void>} - return nothing, just await it
 */
export const animate = async (config) => {
    const backgroundColor = getNeutralFromBucket();

    const frameFilenames = []; //will be a collection of jimp images filenames that in the end gets converted to a gif

    config.startTime = new Date();

    //This determines the final image contents
    //The effect array is super important
    //Understanding effects is key to running this program.
    const effects = generatePrimaryEffects();
    const finalImageEffects = generateFinalImageEffects();

    console.log(composeInfo(config, effects, finalImageEffects));

    /**
     * @param frameNumber - The current frame we are on.
     * @returns {Promise<void>}
     *
     * This function, in general, creates an empty jimp image for each main layer effect
     * Each effect is then applied to the image
     * Then based on their order in the effects array they are composed into a single image
     */
    const createAnimation = async (frameNumber) => {
        //This function creates a new jimp image (layer) for each main effect
        const getLayers = async (w, h) => {
            const extraLayers = [];
            for (let i = 0; i < effects.length; i++) { //effect is found in the outermost layer of this function
                extraLayers.push(await LayerFactory.getNewLayer(LAYERSTRATEGY, h, w, '#00000000'))
            }
            return extraLayers;
        }

        ////////////////////////
        //get fresh files every loop
        ////////////////////////
        const background = await LayerFactory.getNewLayer(LAYERSTRATEGY, IMAGESIZE, IMAGESIZE, backgroundColor);
        let layers = await getLayers(IMAGESIZE, IMAGESIZE)

        /////////////////////////////
        //Process the main and secondary effects
        ////////////////////////////
        const processFrame = async () => {
            return new Promise(async (resolve) => {

                //Queue up the main layer effect to process together
                const mainLayeredEffects = [];

                for (let i = 0; i < layers.length; i++) {
                    mainLayeredEffects.push(effects[i].invokeEffect(layers[i], frameNumber, config.numberOfFrame));
                }

                Promise.all(mainLayeredEffects).then(() => {

                    //Queue up all the secondary effects to the main layers
                    const secondaryEffects = [];

                    for (let i = 0; i < layers.length; i++) {
                        if (effects[i].additionalEffects.length > 0) {
                            for (let s = 0; s < effects[i].additionalEffects.length; s++) {
                                secondaryEffects.push(effects[i].additionalEffects[s].invokeEffect(layers[i], frameNumber, config.numberOfFrame));
                            }
                        }
                    }

                    Promise.all(secondaryEffects).then(() => {
                        resolve(); //All done! We have processed one frame
                    });
                });
            });
        }

        /////////////////////////////
        //run all effects for frame
        ////////////////////////////
        await processFrame();

        ////////////////////////
        //COMPOSE
        //Secondary Magic:  this composites the layers into one image, in order they are in the layers array.
        //Last is on top
        ///////////////////////
        for (let i = 0; i < layers.length; i++) {
            await background.compositeLayerOver(layers[i]);
        }

        ////////////////////////
        // apply final image effects one at a time
        ////////////////////////
        for (let e = 0; e < finalImageEffects.length; e++) {
            await finalImageEffects[e].invokeEffect(background, frameNumber, config.numberOfFrame);
        }

        //////////////////////
        // write to disk
        // still can run multiple instances at once
        /////////////////////
        const filename = WORKINGDIRETORY + config.finalFileName + '-frame-' + frameNumber.toString() + '.png';
        await background.toFile(filename);
        frameFilenames.push(filename);
    }

    ////////////////////////
    //ANIMATE - start here
    //Outer most layer of the function
    //Here we create all the frames in order
    ////////////////////////
    for (let f = 0; f < config.numberOfFrame; f = f + config.frameInc) {
        console.log("started " + f.toString() + " frame");
        await createAnimation(f);
        timeLeft(config.startTime, f, config.frameInc, config.numberOfFrame);
        console.log("completed " + f.toString() + " frame");
    }

    ////////////////////////
    //WRITE TO FILE
    ////////////////////////
    writeArtistCard(config, effects, finalImageEffects);
    await writeToMp4(WORKINGDIRETORY + config.finalFileName + '-frame-%d.png', config);

    for (let f = 0; f < frameFilenames.length; f++) {
        //delete files
        fs.unlinkSync(frameFilenames[f]);
    }
}