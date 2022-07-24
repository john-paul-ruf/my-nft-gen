import Jimp from "jimp";
import {BitmapImage, GifFrame, GifUtil} from "gifwrap";
import fs from "fs";
import {timeToString} from "./timeToString.js";
import {timeLeft} from "./timeLeft.js";
import {generateEffects} from "../effects/control/generateEffect.js";
import {
    possibleEffects
} from "../effects/control/possibleEffects.js";
import {composeInfo} from "./composeInfo.js";
import {imageSize, neutrals} from "./gobals.js";
import {getColorBucket} from "./getColorBucket.js";
import {getRandomInt} from "./random.js";


export let colorBucket = [];

/**
 * @param config - Responsible for filename of gif, total number of frames, gif color depth, and if to skip frames ( frameInc )
 * @returns {Promise<void>} - return nothing, just await it
 */
export const animate = async (config) => {

    colorBucket = getColorBucket();

    const backgroundColor = neutrals[getRandomInt(0, neutrals.length)];

    const frames = []; //will be a collection of jimp images that in the end gets converted to a gif

    config.startTime = new Date();

    //This determines the final image contents
    //The effect array is super important
    //Understanding effects is key to running this program.
    const effects = generateEffects(possibleEffects);

    console.log(composeInfo(config, effects));

    /**
     * @param frame - The current frame we are on.
     * @returns {Promise<void>}
     *
     * This function, in general, creates an empty jimp image for each main layer effect
     * Each effect is then applied to the image
     * Then based on their order in the effects array they are composed into a single image
     */
    const createAnimation = async (frame) => {


        //This applies a single effect to a jimp img.
        //You can think of each effect as an image layer
        const applyEffect = async (img, effects) => {
            for (let i = 0; i < effects.length; i++) {
                //All effects are treated the same through the use of the Effect.js class
                await effects[i].invokeEffect(img, frame, config.numberOfFrame);
            }
        }

        //This function creates a new jimp image (layer) for each main effect
        const getLayers = (w, h) => {
            const extraLayers = [];
            for (let i = 0; i < effects.length; i++) { //effect is found in the outermost layer of this function
                extraLayers.push(new Jimp(w, h))
            }
            return extraLayers;
        }

        //The Magic:  This function applies an effect for each main effect. If there are extra effects, like fade
        // or glow, they are then applied to the main effect jimp image (layer)
        const processLayers = async () => {
            for (let i = 0; i < layers.length; i++) {
                await applyEffect(layers[i], [effects[i]]);
                if (effects[i].additionalEffects.length > 0) {
                    await applyEffect(layers[i], effects[i].additionalEffects);
                }
            }
        }

        ////////////////////////
        //get fresh files every loop
        //Everything is kept in memory, because, why thrash the disk and add additional complexity to the code.
        ////////////////////////
        let background = new Jimp(imageSize, imageSize, Jimp.cssColorToHex(backgroundColor));
        let layers = getLayers(imageSize, imageSize)

        ////////////////////////
        //Process Effects
        ////////////////////////
        await processLayers();

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

       /* const backgroundName = Date.now().toString() + 'total-comp.png';
        background.write(backgroundName);*/

        //Apply color depth to composited image
        GifUtil.quantizeDekker(background, config.colorDepth)

        //Jimp to gif the frame then toss the frame into our in memory array of frames
        let gifFrame = new GifFrame(new BitmapImage(background.bitmap));
        frames.push(gifFrame);
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
    config.endTime = new Date();
    const rez = config.endTime.getTime() - config.startTime.getTime();
    config.processingTime = timeToString(rez);

    console.log("gif write start");
    console.log(composeInfo(config, effects));

    fs.writeFileSync(config.fileOut + '.txt', composeInfo(config, effects), 'utf-8');

    const writeGif = async () => {
        new Promise((resolve, reject) => {
            GifUtil.write(config.fileOut, frames).then(gif => {
                //Always wait for this before killing the process
                console.log("gif written");
                resolve();
            });
        });
    }

    await writeGif();

}