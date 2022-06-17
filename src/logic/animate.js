import Jimp from "jimp";
import {BitmapImage, GifFrame, GifUtil} from "gifwrap";
import fs from "fs";

export const animate = async (config) => {
    console.log(config);

    config.startTime = new Date();

    const frames = [];

    function timeToString(rez) {
        let h = Math.trunc(rez / 3600000 % 100).toString().padStart(2, '0');
        let m = Math.trunc(rez / 60000 % 60).toString().padStart(2, '0');
        let s = Math.trunc(rez / 1000 % 60).toString().padStart(2, '0');
        let ms = Math.trunc(rez % 1000).toString().padStart(3, '0');
        console.log(h + ':' + m + ':' + s + '.' + ms);
        return h + ':' + m + ':' + s + '.' + ms;
    }

    const createAnimation = async (frame) => {

        const applyEffect = async(img, effects) => {
            for(let i = 0; i < effects.length; i++){
                await effects[i].invoke(img, frame, config.numberOfFrame);
            }
        }

        const getExtraLayers = (effects,w, h) => {
            const extraLayers = [];
            for(let i = 0; i < effects.length; i++){
                extraLayers.push(new Jimp(w,h))
            }
            return extraLayers;
        }

        const processExtraLayers = async () => {
            for(let i = 0; i < extraLayers.length; i++){
                await applyEffect(extraLayers[i], [config.extraEffects[i]]);
            }
        }

        ////////////////////////
        //get fresh files
        ////////////////////////
        let summons = await Jimp.read(config.summonsFile);
        let focus = await Jimp.read(config.focusFile);
        let background = new Jimp(config.finalImageSize, config.finalImageSize, Jimp.cssColorToHex('#0D0D0D'));
        let extraLayers = getExtraLayers(config.extraEffects, config.finalImageSize, config.finalImageSize)

        ////////////////////////
        //Process Effects
        ////////////////////////
        await applyEffect(summons, config.summonEffects);
        await applyEffect(focus, config.focusEffects);
        await processExtraLayers();

        ////////////////////////
        //COMPOSE
        ////////////////////////
        for(let i = 0; i < extraLayers.length; i++){
            await background.composite(extraLayers[i], 0, 0, {
                mode: Jimp.BLEND_SOURCE_OVER,
            })
        }

        await background.composite(summons, 0,0, {
            mode: Jimp.BLEND_SOURCE_OVER,
        })

        await background.composite(focus,0,0, {
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

        const timeLeft = () => {
            let currentTime = new Date();
            let rez = currentTime.getTime() - config.startTime.getTime();
            let currentFrameCount = (f / config.frameInc)
            let timePerFrame = rez / currentFrameCount;
            let timeLeft = (config.numberOfFrame - currentFrameCount) * timePerFrame;
            timeToString(timeLeft);
        }

        console.log("started " + f.toString() + " frame");
        await createAnimation(f);
        timeLeft();
        console.log("completed " + f.toString() + " frame");
    }


    ////////////////////////
    //WRITE TO FILE
    ////////////////////////
    config.endTime = new Date();
    const rez = config.endTime.getTime() - config.startTime.getTime();
    config.processingTime = timeToString(rez);

    console.log("gif write start");
    console.log(config);

    const fileProps = JSON.stringify(config, null, 2)
    fs.writeFileSync(config.fileOut + '.txt', fileProps, 'utf-8');

    GifUtil.write(config.fileOut, frames).then(gif => {
        console.log("gif written");
    });

}