import Jimp from "jimp";
import {BitmapImage, GifFrame, GifUtil} from "gifwrap";
import fs from "fs";
import {timeToString} from "./timeToString.js";
import {timeLeft} from "./timeLeft.js";
import {generateEffects} from "../effects/control/generateEffect.js";
import {
    possibleExtraEffects,
    possibleFocusEffects,
    possibleSummonsEffects
} from "../effects/control/possibleEffects.js";
import {composeInfo} from "./composeInfo.js";

export const animate = async (config) => {

    const frames = [];

    config.startTime = new Date();

    const summonEffects = generateEffects(possibleSummonsEffects);
    const focusEffects = generateEffects(possibleFocusEffects);
    const extraEffects = generateEffects(possibleExtraEffects);

    console.log(composeInfo(config, summonEffects, focusEffects, extraEffects));

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
                await applyEffect(extraLayers[i], [extraEffects[i]]);

                if (extraEffects[i].additionalEffects.length > 0) {
                    await applyEffect(extraLayers[i], extraEffects[i].additionalEffects);
                }
            }
        }

        ////////////////////////
        //get fresh files
        ////////////////////////
        let summons = await Jimp.read(config.summonsFile);
        let focus = await Jimp.read(config.focusFile);
        let background = new Jimp(config.finalImageSize, config.finalImageSize, Jimp.cssColorToHex('#0D0D0D'));
        let extraLayers = getExtraLayers(extraEffects, config.finalImageSize, config.finalImageSize)

        ////////////////////////
        //Process Effects
        ////////////////////////
        await applyEffect(summons, summonEffects);
        await applyEffect(focus, focusEffects);
        await processExtraLayers();

        ////////////////////////
        //COMPOSE
        ////////////////////////
        extraLayers.sort((x, y) => {
            return (x.baseLayer === y.baseLayer) ? 0 : x ? -1 : 1;
        })
        for (let i = 0; i < extraLayers.length; i++) {
            await background.composite(extraLayers[i], 0, 0, {
                mode: Jimp.BLEND_SOURCE_OVER,
            })
        }

        await background.composite(summons, 0, 0, {
            mode: Jimp.BLEND_SOURCE_OVER,
        })

        await background.composite(focus, 0, 0, {
            mode: Jimp.BLEND_SOURCE_OVER,
        });

        GifUtil.quantizeDekker(background, config.colorDepth)

        let gifFrame = new GifFrame(new BitmapImage(background.bitmap));
        frames.push(gifFrame);
    }

    ////////////////////////
    //ANIMATE
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
    console.log(composeInfo(config, summonEffects, focusEffects, extraEffects));

    fs.writeFileSync(config.fileOut + '.txt', composeInfo(config, summonEffects, focusEffects, extraEffects), 'utf-8');

    GifUtil.write(config.fileOut, frames).then(gif => {
        console.log("gif written");
    });

}