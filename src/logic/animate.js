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
import {imageSize} from "./gobals.js";

export const animate = async (config) => {

    const frames = [];

    config.startTime = new Date();

    const effects = generateEffects(possibleEffects);

    console.log(composeInfo(config, effects));

    const createAnimation = async (frame) => {

        const applyEffect = async (img, effects) => {
            for (let i = 0; i < effects.length; i++) {
                await effects[i].invokeEffect(img, frame, config.numberOfFrame);
            }
        }

        const getExtraLayers = (effects, w, h) => {
            const extraLayers = [];
            for (let i = 0; i < effects.length; i++) {
                extraLayers.push(new Jimp(w, h))
            }
            return extraLayers;
        }

        const processExtraLayers = async () => {
            for (let i = 0; i < extraLayers.length; i++) {
                await applyEffect(extraLayers[i], [effects[i]]);

                if (effects[i].additionalEffects.length > 0) {
                    await applyEffect(extraLayers[i], effects[i].additionalEffects);
                }
            }
        }

        ////////////////////////
        //get fresh files
        ////////////////////////
        let background = new Jimp(imageSize, imageSize, Jimp.cssColorToHex('#000000'));
        let extraLayers = getExtraLayers(effects, imageSize, imageSize)

        ////////////////////////
        //Process Effects
        ////////////////////////
        await processExtraLayers();

        ////////////////////////
        //COMPOSE
        ////////////////////////
        for (let i = 0; i < extraLayers.length; i++) {
            await background.composite(extraLayers[i], 0, 0, {
                mode: Jimp.BLEND_SOURCE_OVER,
            })
        }

        GifUtil.quantizeDekker(background, config.colorDepth)

        let gifFrame = new GifFrame(new BitmapImage(background.bitmap));
        frames.push(gifFrame);
    }

    ////////////////////////
    //ANIMATE - start here
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

    GifUtil.write(config.fileOut, frames).then(gif => {
        console.log("gif written");
    });

}