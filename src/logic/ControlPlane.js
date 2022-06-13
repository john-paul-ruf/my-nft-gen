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

        const fileURLToPath1 = fileURLToPath(import.meta.url);
        this.directory = dirname(fileURLToPath1).replace('/logic', '');

        const summonsList = this.getFilesInDirectory('/img/png/summons/png')
        const focusList = this.getFilesInDirectory('/img/png/focus/png')

        this.summonsName = summonsList[this.getRandomInt(0, summonsList.length - 1)];
        this.focusName = focusList[this.getRandomInt(0, focusList.length - 1)];

        this.config = {
            finalImageSize: 3000,
            colorDepth: 32,
            frameInc: 1,
            numberOfFrame: 120,

            summonsFile: path.join(this.directory, '/img/png/summons/png/' + this.summonsName),
            focusFile: path.join(this.directory, '/img/png/focus/png/' + this.focusName),
            fileOut: path.join(this.directory, '/img/output/' + Date.now().toString() + '.gif'),

            hueRange: {lower: -360, upper: 360},

            glowLowerRange: {lower: -360, upper: 0},
            glowUpperRange: {lower: 0, upper: 360},

            fadeLowerRange: {lower: 0.5, upper: 0.75},
            fadeUpperRange: {lower: 0.75, upper: 1},

            fadeTimeLower: 1,
            fadeTimesUpper: 6,

            glowTimeLower: 1,
            glowTimesUpper: 3,

            rotateNumberLower: 1,
            rotateNumberUpper: 3,

            verticalScanLine: {
                numberOfLineLower: 4, numberOfLinesUpper: 12, trailsLengthLower: 25, trailsLengthUpper: 150
            },

            effectChance: 60,
        }

        this.summonConfig = {
            initialAdjustments: [{
                apply: 'hue', params: [this.getRandomInt(this.config.hueRange.lower, this.config.hueRange.upper)]
            }, {apply: 'red', params: [this.getRandomInt(0, 5)]}, {
                apply: 'green', params: [this.getRandomInt(0, 5)]
            }, {apply: 'blue', params: [this.getRandomInt(0, 5)]},],

            glowLowerRange: this.getRandomInt(this.config.glowLowerRange.lower, this.config.glowLowerRange.upper),
            glowUpperRange: this.getRandomInt(this.config.glowUpperRange.lower, this.config.glowUpperRange.upper),
            glowTimes: this.getRandomInt(this.config.glowTimeLower, this.config.glowTimesUpper),
            doGlow: this.doEffect(this.config.effectChance),

            fadeLowerRange: this.getRandomArbitrary(this.config.fadeLowerRange.lower, this.config.fadeLowerRange.upper),
            fadeUpperRange: this.getRandomArbitrary(this.config.fadeUpperRange.lower, this.config.fadeUpperRange.upper),
            fadeTimes: this.getRandomInt(this.config.fadeTimeLower, this.config.fadeTimesUpper),
            doFade: this.doEffect(this.config.effectChance),
        }

        this.focusConfig = {
            initialAdjustments: [{
                apply: 'hue', params: [this.getRandomInt(this.config.hueRange.lower, this.config.hueRange.upper)]
            }, {apply: 'red', params: [this.getRandomInt(0, 5)]}, {
                apply: 'green', params: [this.getRandomInt(0, 5)]
            }, {apply: 'blue', params: [this.getRandomInt(0, 5)]},],

            glowLowerRange: this.getRandomInt(this.config.glowLowerRange.lower, this.config.glowLowerRange.upper),
            glowUpperRange: this.getRandomInt(this.config.glowUpperRange.lower, this.config.glowUpperRange.upper),
            glowTimes: this.getRandomInt(this.config.glowTimeLower, this.config.glowTimesUpper),
            doGlow: this.doEffect(this.config.effectChance),

            fadeLowerRange: this.getRandomArbitrary(this.config.fadeLowerRange.lower, this.config.fadeLowerRange.upper),
            fadeUpperRange: this.getRandomArbitrary(this.config.fadeUpperRange.lower, this.config.fadeUpperRange.upper),
            fadeTimes: this.getRandomInt(this.config.fadeTimeLower, this.config.fadeTimesUpper),
            doFade: this.doEffect(this.config.effectChance),
        }

        const mtl = this.getRandomInt(this.config.verticalScanLine.trailsLengthLower, this.config.verticalScanLine.trailsLengthUpper)
        const computeInitialLineInfo = (numberOfLines) => {

            const lineInfo = [];

            for (let i = 0; i <= numberOfLines; i++) {
                lineInfo.push({lineStart: this.getRandomInt(0, this.config.finalImageSize)});
            }

            return lineInfo;
        }

        this.verticalScanEffectProps = {
            numberOfLines: this.getRandomInt(this.config.verticalScanLine.numberOfLineLower, this.config.verticalScanLine.numberOfLinesUpper),
            maxTrailLength: mtl,
            pixelsPerGradient: mtl / 10,
            doVerticalScanLines: this.doEffect(this.config.effectChance),

            glowLowerRange: this.getRandomInt(this.config.glowLowerRange.lower, this.config.glowLowerRange.upper),
            glowUpperRange: this.getRandomInt(this.config.glowUpperRange.lower, this.config.glowUpperRange.upper),
            glowTimes: this.getRandomInt(this.config.glowTimeLower, this.config.glowTimesUpper),
            doGlow: this.doEffect(this.config.effectChance),

            fadeLowerRange: this.getRandomArbitrary(this.config.fadeLowerRange.lower, this.config.fadeLowerRange.upper),
            fadeUpperRange: this.getRandomArbitrary(this.config.fadeUpperRange.lower, this.config.fadeUpperRange.upper),
            fadeTimes: this.getRandomInt(this.config.fadeTimeLower, this.config.fadeTimesUpper),
            doFade: this.doEffect(this.config.effectChance),
        }

        this.verticalScanEffectProps.lineInfo = computeInitialLineInfo(this.verticalScanEffectProps.numberOfLines)

        this.animateBackground = {
            glowLowerRange: this.getRandomInt(this.config.glowLowerRange.lower, this.config.glowLowerRange.upper),
            glowUpperRange: this.getRandomInt(this.config.glowUpperRange.lower, this.config.glowUpperRange.upper),
            glowTimes: this.getRandomInt(this.config.glowTimeLower, this.config.glowTimesUpper),
            doGlow: this.doEffect(this.config.effectChance),

            doAnimateBackground: this.doEffect(this.config.effectChance),
        }

        this.rotateEffectProps = {
            numberOfRotations: this.getRandomInt(this.config.rotateNumberLower, this.config.rotateNumberUpper),
            doRotate: this.doEffect(this.config.effectChance)
        }
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
            let summons = await Jimp.read(this.config.summonsFile);
            let focus = await Jimp.read(this.config.focusFile);
            let background = new Jimp(this.config.finalImageSize, this.config.finalImageSize, Jimp.cssColorToHex('#0D0D0D'));
            let animatedBackground = null
            let scanLines = null;

            //Rando the colors
            await summons.color(this.summonConfig.initialAdjustments);
            await focus.color(this.focusConfig.initialAdjustments);

            ////////////////////////
            //EFFECTS
            ////////////////////////
            if (this.rotateEffectProps.doRotate) {
                await rotate(summons, this.rotateEffectProps.numberOfRotations, frame, this.config.numberOfFrame)
            }

            if (this.summonConfig.doGlow) {
                await glowAnimated(summons, this.summonConfig.glowTimes, this.summonConfig.glowLowerRange, this.summonConfig.glowUpperRange, frame, this.config.numberOfFrame);
            }

            if (this.summonConfig.doFade) {
                await fadeAnimated(summons, this.summonConfig.fadeTimes, this.summonConfig.fadeLowerRange, this.summonConfig.fadeUpperRange, frame, this.config.numberOfFrame);
            }

            if (this.focusConfig.doGlow) {
                await glowAnimated(focus, this.summonConfig.glowTimes, this.focusConfig.glowLowerRange, this.focusConfig.glowUpperRange, frame, this.config.numberOfFrame);
            }

            if (this.focusConfig.doFade) {
                await fadeAnimated(focus, this.summonConfig.fadeTimes, this.focusConfig.fadeLowerRange, this.focusConfig.fadeLowerRange, frame, this.config.numberOfFrame);
            }

            if (this.animateBackground) {
                animatedBackground = await animateBackground(this.config.finalImageSize, this.config.finalImageSize);

                if(this.animateBackground.doGlow){
                    await glowAnimated(animatedBackground, this.animateBackground.glowTimes, this.animateBackground.glowLowerRange, this.animateBackground.glowUpperRange, frame, this.config.numberOfFrame);
                }

            }

            if (this.verticalScanEffectProps.doVerticalScanLines) {

                scanLines = await verticalScanLines(this.config.finalImageSize, this.config.finalImageSize, this.verticalScanEffectProps.lineInfo, this.verticalScanEffectProps.maxTrailLength, this.verticalScanEffectProps.pixelsPerGradient, frame, this.config.numberOfFrame);

                if(this.verticalScanEffectProps.doGlow){
                    await glowAnimated(scanLines, this.verticalScanEffectProps.glowTimes, this.verticalScanEffectProps.glowLowerRange, this.verticalScanEffectProps.glowUpperRange, frame, this.config.numberOfFrame);
                }

                if(this.verticalScanEffectProps.doFade){
                    await glowAnimated(scanLines, this.verticalScanEffectProps.fadeTimes, this.verticalScanEffectProps.glowLowerRange, this.verticalScanEffectProps.glowUpperRange, frame, this.config.numberOfFrame);
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

            await background.composite(summons, (this.config.finalImageSize - 2000) / 2, (this.config.finalImageSize - 2000) / 2, {
                mode: Jimp.BLEND_SOURCE_OVER,
            })

            await background.composite(focus, (this.config.finalImageSize - 2000) / 2, (this.config.finalImageSize - 2000) / 2, {
                mode: Jimp.BLEND_SOURCE_OVER,
            });

            GifUtil.quantizeDekker(background, this.config.colorDepth)

            let gifFrame = new GifFrame(new BitmapImage(background.bitmap));
            frames.push(gifFrame);
        }

        ////////////////////////
        //ANIMATE
        ////////////////////////
        for (let f = 0; f < this.config.numberOfFrame; f = f + this.config.frameInc) {

            const timeLeft = () => {
                let currentTime = new Date();
                let rez = currentTime.getTime() - this.startTime.getTime();
                let currentFrameCount = (f / this.config.frameInc)
                let timePerFrame = rez / currentFrameCount;
                let timeLeft = (this.config.numberOfFrame - currentFrameCount) * timePerFrame;
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
        this.endTime = new Date();
        this._bornOn = this.endTime;

        timeToString.call(this.endTime.getTime() - this.startTime.getTime());

        console.log("gif write start");
        console.log(this);

        const fileProps = JSON.stringify(this, null, 2)
        fs.writeFileSync(this.config.fileOut + '.txt', fileProps, 'utf-8');

        GifUtil.write(this.config.fileOut, frames).then(gif => {
            console.log("gif written");
        });

    }

}

