import Jimp from "jimp";
import {rotate} from "./effects/rotate.js";
import {glowAnimated} from "./effects/glow.js";
import {fadeAnimated} from "./effects/fade.js";
import {animateBackground} from "./effects/animateBackground.js";
import {verticalScanLines} from "./effects/verticalScanLines.js";
import {BitmapImage, GifFrame, GifUtil} from "gifwrap";
import fs from "fs";

export const animate = async (controlPlane) => {
    console.log(controlPlane);

    controlPlane.startTime = new Date();

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

        //get fresh files
        let summons = await Jimp.read(controlPlane.config.fileInfo.summonsFile);
        let focus = await Jimp.read(controlPlane.config.fileInfo.focusFile);
        let background = new Jimp(controlPlane.config.fileInfo.finalImageSize, controlPlane.config.fileInfo.finalImageSize, Jimp.cssColorToHex('#0D0D0D'));
        let animatedBackground = null
        let scanLines = null;

        //Rando the colors
        await summons.color(controlPlane.summonConfig.initialAdjustments);
        await focus.color(controlPlane.focusConfig.initialAdjustments);

        ////////////////////////
        //EFFECTS
        ////////////////////////
        if (controlPlane.rotateSummons.doRotate) {
            await rotate(summons, controlPlane.rotateEffectProps.numberOfRotations, frame, controlPlane.config.fileInfo.numberOfFrame)
        }

        if (controlPlane.summonConfig.glow.doGlow) {
            await glowAnimated(summons, controlPlane.summonConfig.glow.times, controlPlane.summonConfig.glow.lower, controlPlane.summonConfig.glow.upper, frame, controlPlane.config.fileInfo.numberOfFrame);
        }

        if (controlPlane.summonConfig.fade.doFade) {
            await fadeAnimated(summons, controlPlane.summonConfig.fade.times, controlPlane.summonConfig.fade.lower, controlPlane.summonConfig.fade.upper, frame, controlPlane.config.fileInfo.numberOfFrame);
        }

        if (controlPlane.focusConfig.glow.doGlow) {
            await glowAnimated(focus, controlPlane.focusConfig.glow.times, controlPlane.focusConfig.glow.lower, controlPlane.focusConfig.glow.upper, frame, controlPlane.config.fileInfo.numberOfFrame);
        }

        if (controlPlane.focusConfig.fade.doFade) {
            await fadeAnimated(focus, controlPlane.focusConfig.fade.times, controlPlane.focusConfig.fade.lower, controlPlane.focusConfig.fade.upper, frame, controlPlane.config.fileInfo.numberOfFrame);
        }

        if (controlPlane.animateBackground) {
            animatedBackground = await animateBackground(controlPlane.config.fileInfo.finalImageSize, controlPlane.config.fileInfo.finalImageSize);

            if(controlPlane.animateBackground.glow.doGlow){
                await glowAnimated(animatedBackground, controlPlane.animateBackground.glow.times, controlPlane.animateBackground.glow.lower, controlPlane.animateBackground.glow.upper, frame, controlPlane.config.fileInfo.numberOfFrame);
            }

        }

        if (controlPlane.verticalScanlines.doVerticalScanLines) {

            scanLines = await verticalScanLines(controlPlane.config.fileInfo.finalImageSize, controlPlane.config.fileInfo.finalImageSize, controlPlane.verticalScanlines.lineInfo, frame, controlPlane.config.fileInfo.numberOfFrame);

            if(controlPlane.verticalScanlines.glow.doGlow){
                await glowAnimated(scanLines, controlPlane.verticalScanlines.glow.times, controlPlane.verticalScanlines.glow.lower, controlPlane.verticalScanlines.glow.upper, frame, controlPlane.config.fileInfo.numberOfFrame);
            }

            if(controlPlane.verticalScanlines.fade.doFade){
                await glowAnimated(scanLines, controlPlane.verticalScanlines.fade.times, controlPlane.verticalScanlines.fade.lower, controlPlane.verticalScanlines.fade.upper, frame, controlPlane.config.fileInfo.numberOfFrame);
            }
        }

        ////////////////////////
        //COMPOSE
        ////////////////////////
        if (animatedBackground) {
            await background.composite(animatedBackground, 0, 0, {
                mode: Jimp.BLEND_SOURCE_OVER,
            })
        }

        if (scanLines) {
            await background.composite(scanLines, 0, 0, {
                mode: Jimp.BLEND_SOURCE_OVER,
            })
        }

        await background.composite(summons, 0,0, {
            mode: Jimp.BLEND_SOURCE_OVER,
        })

        await background.composite(focus,0,0, {
            mode: Jimp.BLEND_SOURCE_OVER,
        });

        GifUtil.quantizeDekker(background, controlPlane.config.fileInfo.colorDepth)

        let gifFrame = new GifFrame(new BitmapImage(background.bitmap));
        frames.push(gifFrame);
    }

    ////////////////////////
    //ANIMATE
    ////////////////////////
    for (let f = 1; f < controlPlane.config.fileInfo.numberOfFrame; f = f + controlPlane.config.fileInfo.frameInc) {

        const timeLeft = () => {
            let currentTime = new Date();
            let rez = currentTime.getTime() - controlPlane.startTime.getTime();
            let currentFrameCount = (f / controlPlane.config.fileInfo.frameInc)
            let timePerFrame = rez / currentFrameCount;
            let timeLeft = (controlPlane.config.fileInfo.numberOfFrame - currentFrameCount) * timePerFrame;
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
    controlPlane.endTime = new Date();
    const rez = controlPlane.endTime.getTime() - controlPlane.startTime.getTime();
    controlPlane.processingTime = timeToString(rez);

    console.log("gif write start");
    console.log(controlPlane);

    const fileProps = JSON.stringify(controlPlane, null, 2)
    fs.writeFileSync(controlPlane.config.fileInfo.fileOut + '.txt', fileProps, 'utf-8');

    GifUtil.write(controlPlane.config.fileInfo.fileOut, frames).then(gif => {
        console.log("gif written");
    });

}