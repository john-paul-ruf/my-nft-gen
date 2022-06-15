import path from "path";
import fs from "fs";
import Jimp from "jimp";
import {fileURLToPath} from 'url';
import {dirname} from 'path';
import {BitmapImage, GifFrame, GifUtil} from "gifwrap";
import {glowAnimated} from "../effects/glow.js";
import {animateBackground} from "../effects/animateBackground.js";
import {verticalScanLines} from "../effects/verticalScanLines.js";
import {fadeAnimated} from "../effects/fade.js";
import {rotate} from "../effects/rotate.js";

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

            fileInfo:{
                finalImageSize: 3000,
                colorDepth: 32,
                frameInc: 1,
                numberOfFrame: 30,

                summonsFile: path.join(this.directory, '/img/png/summons/png/' + this.summonsName),
                focusFile: path.join(this.directory, '/img/png/focus/png/' + this.focusName),
                fileOut: path.join(this.directory, '/img/output/' + Date.now().toString() + '.gif'),
            },

            initialRemix: {
                spin:{lower: -360, upper: 360},
                red:{lower: 5, upper: 55},
                blue:{lower: 5, upper: 55},
                green:{lower: 5, upper: 55}
            },

            glow: {
                lowerRange: {lower: -360, upper: 0},
                upperRange: {lower: 0, upper: 360},
                timesLower: 1,
                timesUpper: 3,
                effectChance: 0,
            },

            fade: {
                lowerRange: {lower: 0, upper: 0.2},
                upperRange: {lower: 0.2, upper: 0.4},
                timesLower: 1,
                timesUpper: 4,
                effectChance: 0,
            },

            rotate: {
                lower: 1,
                upper: 3,
                effectChance: 0,
            },

            verticalScanLine: {
                numberOfLineLower: 4,
                numberOfLinesUpper: 8,
                trailsLengthLower: 5,
                trailsLengthUpper: 25,
                effectChance: 0,
            },

            animateBackground: {
                effectChance:0
            },

            radiate: {
                lower: 1,
                upper: 1,
                effectChance: 100,
            }

        }

        const generateGlowEffectConfig = () => {
            return {
                lower: this.getRandomInt(this.config.glow.lowerRange.lower, this.config.glow.lowerRange.upper),
                upper: this.getRandomInt(this.config.glow.upperRange.lower, this.config.glow.upperRange.upper),
                times: this.getRandomInt(this.config.glow.timesLower, this.config.glow.timesUpper),
                doGlow: this.doEffect(this.config.glow.effectChance)
            };
        }

        const generateFadeEffectConfig = () => {
            return {
                lower: this.getRandomInt(this.config.fade.lowerRange.lower, this.config.fade.lowerRange.upper),
                upper: this.getRandomInt(this.config.fade.upperRange.lower, this.config.fade.upperRange.upper),
                times: this.getRandomInt(this.config.fade.timesLower, this.config.fade.timesUpper),
                doFade: this.doEffect(this.config.fade.effectChance)
            };
        }

        const generateRadiateConfig = () => {
            return {
                times: this.getRandomInt(this.config.radiate.lower, this.config.radiate.upper),
                doRadiate: this.doEffect(this.config.radiate.effectChance)
            }
        }

        const generateBaseConfig = () => {
            return {
                initialAdjustments: [
                    {
                        apply: 'hue',
                        params: [this.getRandomInt(this.config.initialRemix.spin.lower, this.config.initialRemix.spin.upper)]
                    },
                    {
                        apply: 'red',
                        params: [this.getRandomInt(this.config.initialRemix.red.lower, this.config.initialRemix.red.upper)]
                    },
                    {
                        apply: 'green',
                        params: [this.getRandomInt(this.config.initialRemix.green.lower, this.config.initialRemix.green.upper)]
                    },
                    {
                        apply: 'blue',
                        params: [this.getRandomInt(this.config.initialRemix.blue.lower, this.config.initialRemix.blue.upper)]
                    }
                ],
                glow: generateGlowEffectConfig(),
                fade: generateFadeEffectConfig(),
                radiate: generateRadiateConfig(),
            }
        }

        this.summonConfig = generateBaseConfig();

        this.focusConfig = generateBaseConfig();

        this.verticalScanlines = {
            numberOfLines: this.getRandomInt(this.config.verticalScanLine.numberOfLineLower, this.config.verticalScanLine.numberOfLinesUpper),
            doVerticalScanLines: this.doEffect(this.config.effectChance),
            glow: generateGlowEffectConfig(),
            fade: generateFadeEffectConfig(),
        }

        const computeInitialLineInfo = (numberOfLines) => {
            const lineInfo = [];
            for (let i = 0; i <= numberOfLines; i++) {
                const mtl = this.getRandomInt(this.config.verticalScanLine.trailsLengthLower, this.config.verticalScanLine.trailsLengthUpper)

                lineInfo.push({
                    lineStart: this.getRandomInt(0, this.config.finalImageSize),
                    maxTrailLength: mtl,
                    pixelsPerGradient: mtl / 16,
                });
            }
            return lineInfo;
        }

        this.verticalScanlines.lineInfo = computeInitialLineInfo(this.verticalScanlines.numberOfLines)

        this.animateBackground = {
            glow: generateGlowEffectConfig(),
            fade: generateFadeEffectConfig(),
            doAnimateBackground: this.doEffect(this.config.animateBackground.effectChance),
        }

        this.rotateSummons = {
            numberOfRotations: this.getRandomInt(this.config.rotate.lower, this.config.rotate.upper),
            doRotate: this.doEffect(this.config.effectChance)
        }

        this.rotateSummons = {
            numberOfRotations: this.getRandomInt(this.config.rotate.lower, this.config.rotate.upper),
            doRotate: this.doEffect(this.config.rotate.effectChance)
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

    getFilesInDirectory(dir) {

        const directoryPath = path.join(this.directory, dir);
        const list = [];

        fs.readdirSync(directoryPath).forEach(file => {
            if(!file.startsWith('.')) {
                list.push(file);
            }
        });

        return list;
    }
}

