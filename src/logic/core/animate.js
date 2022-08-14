import {generateFinalImageEffects, generatePrimaryEffects} from "../../effects/control/generateEffect.js";
import {composeInfo} from "./composeInfo.js";
import {getFinalImageSize, getLayerStrategy, getNeutralFromBucket, getWorkingDirectory,} from "./gobals.js";
import {writeArtistCard} from "../../output/writeArtistCard.js";
import fs from "fs";
import {writeToMp4} from "../../output/writeToMp4.js";
import {LayerFactory} from "../../layer/LayerFactory.js";
import {timeLeft} from "../utils/timeLeft.js";
import {writeScreenCap} from "../../output/writeScreenCap.js";

//This function creates a new jimp image (layer) for each main effect
const getLayers = async (w, h, context) => {
    const extraLayers = [];
    for (let i = 0; i < context.effects.length; i++) { //effect is found in the outermost layer of this function
        extraLayers.push(await LayerFactory.getNewLayer(h, w, '#00000000'))
    }
    return extraLayers;
}

/////////////////////////////
//Process the main and secondary effects
////////////////////////////
const processFrame = async (frameNumber, context) => {
    return new Promise(async (resolve) => {

        //Queue up the main layer effect to process together
        const mainLayeredEffects = [];

        for (let i = 0; i < context.layers.length; i++) {
            mainLayeredEffects.push(context.effects[i].invokeEffect(context.layers[i], frameNumber, context.numberOfFrame));
        }

        Promise.all(mainLayeredEffects).then(() => {
            resolve(); //All done! We have processed one frame
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
const createAnimation = async (frameNumber, context) => {
    ////////////////////////
    //get fresh files every loop
    ////////////////////////
    const background = await LayerFactory.getNewLayer(context.finalImageSize.height, context.finalImageSize.width, context.backgroundColor);
    context.layers = await getLayers(context.finalImageSize.width, context.finalImageSize.height, context)

    /////////////////////////////
    //run all effects for frame
    ////////////////////////////
    await processFrame(frameNumber, context);

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
}

/**
 * @param config - Responsible for filename of gif, total number of frames, gif color depth, and if to skip frames ( frameInc )
 * @returns {Promise<void>} - return nothing, just await it
 */
export const animate = async (config) => {

    config.startTime = new Date();

    const context = {
        numberOfFrame: config.numberOfFrame,
        finalImageSize: getFinalImageSize(),
        workingDirectory: getWorkingDirectory(),
        layerStrategy: getLayerStrategy(),

        backgroundColor: getNeutralFromBucket(),

        frameFilenames: [], //will be a collection of png images filenames that in the end gets converted to a gif

        //This determines the final image contents
        //The effect array is super important
        //Understanding effects is key to running this program.
        effects: generatePrimaryEffects(),
        finalImageEffects: generateFinalImageEffects(),
        finalFileName: config.finalFileName,
    }

    //For console info
    console.log(composeInfo(config, context.effects, context.finalImageEffects));

    ////////////////////////
    //ANIMATE - start here
    //Outer most layer of the function
    //Here we create all the frames in order
    ////////////////////////
    for (let f = 0; f < config.numberOfFrame; f = f + config.frameInc) {
        console.log("started " + f.toString() + " frame");
        await createAnimation(f, context);
        timeLeft(config.startTime, f, config.frameInc, config.numberOfFrame);
        console.log("completed " + f.toString() + " frame");
    }

    ////////////////////////
    //WRITE TO FILE
    ////////////////////////
    writeArtistCard(config, context.effects, context.finalImageEffects);
    await writeToMp4(context.workingDirectory + config.finalFileName + '-frame-%d.png', config);
    await writeScreenCap(context.frameFilenames[0], config);

    for (let f = 0; f < context.frameFilenames.length; f++) {
        //delete files
        fs.unlinkSync(context.frameFilenames[f]);
    }
}