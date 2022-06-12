import path from "path";
import fs from "fs";
import Jimp from "jimp";
import {fileURLToPath} from 'url';
import {dirname} from 'path';
import {BitmapImage, GifFrame, GifUtil} from "gifwrap";
import {glowAnimated} from "./effects/glow.js";
import {animateBackground} from "./effects/animateBackground.js";
import {verticalScanLines} from "./effects/verticalScanLines.js";
import {fadeAnimated} from "./effects/fade.js";
import {rotate} from "./effects/rotate.js";

export class ControlPlane {
    constructor() {
        this._INVOKER_ = 'John Ruf - Bookstore Illuminati';

        this.finalImageSize = 3000;
        this.colorDepth = 255;
        this.frameInc = 5;
        this.numberOfFrame = 50;

        const fileURLToPath1 = fileURLToPath(import.meta.url);
        this.directory = dirname(fileURLToPath1).replace('/logic', '');

        const summonsList = this.getFilesInDirectory('/img/png/summons/png')
        const focusList = this.getFilesInDirectory('/img/png/focus/png')

        this.summonsName = summonsList[this.getRandomInt(0, summonsList.length - 1)];
        this.focusName = focusList[this.getRandomInt(0, focusList.length - 1)];

        this.summonsFile = path.join(this.directory, '/img/png/summons/png/' + this.summonsName)
        this.focusFile = path.join(this.directory, '/img/png/focus/png/' + this.focusName)
        this.fileOut = path.join(this.directory, '/img/output/' + Date.now().toString() + '.gif')

        this.hueRange = {lower: -360, upper: 360};
        this.glowLowerRange = {lower: -360, upper: 0};
        this.glowUpperRange = {lower: 0, upper: 360};
        this.fadeLowerRange = {lower: 0.5, upper: 0.75};
        this.fadeUpperRange = {lower: 0.75, upper: 1};

        this.verticalScanLine = {
            numberOfLineLower: 4, numberOfLinesUpper: 8, trailsLengthLower: 5, trailsLengthUpper: 50
        };

        this.effectChance = 50;

        this.summonsProps = [{
            apply: 'hue', params: [this.getRandomInt(this.hueRange.lower, this.hueRange.upper)]
        }, {apply: 'red', params: [this.getRandomInt(0, 5)]}, {
            apply: 'green', params: [this.getRandomInt(0, 5)]
        }, {apply: 'blue', params: [this.getRandomInt(0, 5)]},]

        this.focusProps = [{
            apply: 'hue', params: [this.getRandomInt(this.hueRange.lower, this.hueRange.upper)]
        }, {apply: 'red', params: [this.getRandomInt(0, 5)]}, {
            apply: 'green', params: [this.getRandomInt(0, 5)]
        }, {apply: 'blue', params: [this.getRandomInt(0, 5)]},]

        this.summonEffectProps = {
            glowLowerRange: this.getRandomInt(this.glowLowerRange.lower, this.glowLowerRange.upper),
            glowUpperRange: this.getRandomInt(this.glowUpperRange.lower, this.glowUpperRange.upper),
            doGlow: this.doEffect(this.effectChance),

            fadeLowerRange: this.getRandomArbitrary(this.fadeLowerRange.lower, this.fadeLowerRange.upper),
            fadeUpperRange: this.getRandomArbitrary(this.fadeUpperRange.lower, this.fadeUpperRange.upper),
            doFade: this.doEffect(this.effectChance),
        }

        this.focusEffectProps = {
            glowLowerRange: this.getRandomInt(this.glowLowerRange.lower, this.glowLowerRange.upper),
            glowUpperRange: this.getRandomInt(this.glowUpperRange.lower, this.glowUpperRange.upper),
            doGlow: this.doEffect(this.effectChance),

            fadeLowerRange: this.getRandomArbitrary(this.fadeLowerRange.lower, this.fadeLowerRange.upper),
            fadeUpperRange: this.getRandomArbitrary(this.fadeUpperRange.lower, this.fadeUpperRange.upper),
            doFade: this.doEffect(this.effectChance),
        }

        const mtl = this.getRandomInt(this.verticalScanLine.trailsLengthLower, this.verticalScanLine.trailsLengthUpper)

        this.verticalScanEffectProps = {
            numberOfLines: this.getRandomInt(this.verticalScanLine.numberOfLineLower, this.verticalScanLine.numberOfLinesUpper),
            maxTrailLength: mtl,
            pixelsPerGradient: mtl/10,
            doVerticalScanLines: this.doEffect(this.effectChance),
            computeInitialLineInfo: (numberOfLines) => {

                const lineInfo = [];

                for (let i = 0; i <= numberOfLines; i++) {
                    lineInfo.push({lineStart: this.getRandomInt(0, this.finalImageSize)});
                }

                return lineInfo;
            }
        }
        this.verticalScanEffectProps.lineInfo = this.verticalScanEffectProps.computeInitialLineInfo(this.verticalScanEffectProps.numberOfLines);

        this.animateBackground = {
            doAnimateBackground: this.doEffect(this.effectChance),
        }

        this.rotateEffectProps = {
            numberOfRotations: this.getRandomInt(1,4),
            doRotate: this.doEffect(this.effectChance)
        }

        console.log(this);
    }

    getRandomInt(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min) + min); //The maximum is exclusive and the minimum is inclusive
    }

    doEffect(chance) {
        const result = this.getRandomInt(0, 100)
        return result <= chance;
    }

    getRandomArbitrary(min, max) {
        return Math.random() * (max - min) + min;
    }

    getFilesInDirectory(dir) {

        const directoryPath = path.join(this.directory, dir);
        const list = [];

        fs.readdirSync(directoryPath).forEach(file => {
            list.push(file);
        });

        return list;
    }

    async processControlPlane() {
        console.log(this);

        this.startTime = new Date();

        const frames = [];

        function timeToString(rez) {
            let h = Math.trunc(rez / 3600000 % 100).toString().padStart(2, '0');
            let m = Math.trunc(rez / 60000 % 60).toString().padStart(2, '0');
            let s = Math.trunc(rez / 1000 % 60).toString().padStart(2, '0');
            let ms = Math.trunc(rez % 1000).toString().padStart(3, '0');
            console.log(h + ':' + m + ':' + s + '.' + ms);
        }

        const createAnimation = async (frame) => {

            //get fresh files
            let summons = await Jimp.read(this.summonsFile);
            let focus = await Jimp.read(this.focusFile);
            let background = new Jimp(this.finalImageSize, this.finalImageSize, Jimp.cssColorToHex('#0D0D0D'));
            let animatedBackground = null
            let scanLines = null;

            //Rando the colors
            await summons.color(this.summonsProps);
            await focus.color(this.focusProps);

            ////////////////////////
            //EFFECTS
            ////////////////////////
            if (this.rotateEffectProps.doRotate) {
                await rotate(summons, this.rotateEffectProps.numberOfRotations, frame, this.numberOfFrame)
            }

            if (this.summonEffectProps.doGlow) {
                await glowAnimated(summons, this.summonEffectProps.glowLowerRange, this.summonEffectProps.glowUpperRange, frame, this.numberOfFrame);
            }

            if (this.summonEffectProps.doFade) {
                await fadeAnimated(summons, this.summonEffectProps.fadeLowerRange, this.summonEffectProps.fadeUpperRange, frame, this.numberOfFrame);
            }

            if (this.focusEffectProps.doGlow) {
                await glowAnimated(focus, this.focusEffectProps.glowLowerRange, this.focusEffectProps.glowUpperRange, frame, this.numberOfFrame);
            }

            if (this.focusEffectProps.doFade) {
                await fadeAnimated(focus, this.focusEffectProps.fadeLowerRange, this.focusEffectProps.fadeLowerRange, frame, this.numberOfFrame);
            }

            if (this.animateBackground) {
                animatedBackground = await animateBackground(this.finalImageSize, this.finalImageSize);
            }

            if (this.animateBackground) {
                scanLines = await verticalScanLines(
                    this.finalImageSize,
                    this.finalImageSize,
                    this.verticalScanEffectProps.lineInfo,
                    this.verticalScanEffectProps.maxTrailLength,
                    this.verticalScanEffectProps.pixelsPerGradient,
                    frame,
                    this.numberOfFrame);
            }

            ////////////////////////
            //COMPOSE
            ////////////////////////
            if (animatedBackground) {
                await background.composite(animatedBackground, (this.finalImageSize - 2000) / 2, (this.finalImageSize - 2000) / 2, {
                    mode: Jimp.BLEND_SOURCE_OVER,
                })
            }

            if (scanLines) {
                await background.composite(scanLines, (this.finalImageSize - 2000) / 2, (this.finalImageSize - 2000) / 2, {
                    mode: Jimp.BLEND_SOURCE_OVER,
                })
            }

            await background.composite(summons, (this.finalImageSize - 2000) / 2, (this.finalImageSize - 2000) / 2, {
                mode: Jimp.BLEND_SOURCE_OVER,
            })

            await background.composite(focus, (this.finalImageSize - 2000) / 2, (this.finalImageSize - 2000) / 2, {
                mode: Jimp.BLEND_SOURCE_OVER,
            });

            GifUtil.quantizeDekker(background, this.colorDepth)

            let gifFrame = new GifFrame(new BitmapImage(background.bitmap));
            frames.push(gifFrame);
        }


        ////////////////////////
        //ANIMATE
        ////////////////////////
        for (let f = 0; f < this.numberOfFrame; f = f + this.frameInc) {

            const timeLeft = () => {
                let currentTime = new Date();
                let rez = currentTime.getTime() - this.startTime.getTime();
                let currentFrameCount = (f / this.frameInc)
                let timePerFrame = rez / currentFrameCount;
                let timeLeft = (this.numberOfFrame - currentFrameCount) * timePerFrame;
                timeToString(timeLeft);
            }

            console.log("started " + f.toString() + " degree");
            await createAnimation(f);
            timeLeft();
            console.log("completed " + f.toString() + " degree");
        }


        ////////////////////////
        //WRITE TO FILE
        ////////////////////////
        this.endTime = new Date();
        this._bornOn = this.endTime;

        timeToString.call(this.endTime.getTime() - this.startTime.getTime());

        console.log("gif write start");
        console.log(this);

        const fileProps = JSON.stringify(this, null, 2)
        fs.writeFileSync(this.fileOut + '.txt', fileProps, 'utf-8');

        GifUtil.write(this.fileOut, frames).then(gif => {
            console.log("gif written");
        });

    }

}

