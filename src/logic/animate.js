import Jimp from "jimp";
import {timeLeft} from "./timeLeft.js";
import {generateEffects} from "../effects/control/generateEffect.js";
import {primaryEffects} from "../effects/control/possibleEffects.js";
import {composeInfo} from "./composeInfo.js";
import {getNeutralFromBucket, IMAGESIZE} from "./gobals.js";
import {randomId} from "./random.js";
import {writeArtistCard} from "../output/writeArtistCard.js";
import fs from "fs";
import {writeToMp4} from "../output/writeToMp4.js";

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
    const effects = generateEffects(primaryEffects);

    console.log(composeInfo(config, effects));

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
        const getLayers = (w, h) => {
            const extraLayers = [];
            for (let i = 0; i < effects.length; i++) { //effect is found in the outermost layer of this function
                extraLayers.push(new Jimp(w, h))
            }
            return extraLayers;
        }

        ////////////////////////
        //get fresh files every loop
        ////////////////////////
        let background = new Jimp(IMAGESIZE, IMAGESIZE, Jimp.cssColorToHex(backgroundColor));
        let layers = getLayers(IMAGESIZE, IMAGESIZE)

        /////////////////////////////
        //Process the main and secondary effects
        ////////////////////////////
        const processFrame = async () => {
            return new Promise(async (resolve, reject) => {

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
            await background.composite(layers[i], 0, 0, {
                mode: Jimp.BLEND_SOURCE_OVER,
            })
        }

        //////////////////////
        // write to disk
        // still can run multiple instances at once
        /////////////////////
        const filename = config.finalFileName + '_frame_' + frameNumber + randomId() + '.png';
        await background.write(filename);
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
    await writeArtistCard(config, effects);
    await writeToMp4(frameFilenames, config);

    for (let f = 0; f < frameFilenames.length; f++) {
        //delete files
        fs.unlinkSync(frameFilenames[f]);
    }
}