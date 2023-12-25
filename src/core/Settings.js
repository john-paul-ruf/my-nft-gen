import {getRandomFromArray, getRandomIntExclusive, getRandomIntInclusive, randomId} from "./math/random.js";
import {ColorScheme} from "./color/ColorScheme.js";
import {GlobalSettings} from "./GlobalSettings.js";

export class Settings {
    constructor({
                    colorScheme = new ColorScheme({}),
                    neutrals = ['#FFFFFF'],
                    backgrounds = ['#000000',],
                    lights = ['#FFFF00', '#FF00FF', '#00FFFF', '#FF0000', '#00FF00', '#0000FF'],
                    _INVOKER_ = 'unknown',
                    runName = 'null-space-void',
                    frameInc = 1,
                    numberOfFrame = 1800,
                    finalFileName = randomId(),
                    fileOut = GlobalSettings.getWorkingDirectory() + this.finalFileName
                }) {

        this.colorScheme = colorScheme;

        //For 2D palettes
        this.neutrals = neutrals;

        //For 2D palettes
        this.backgrounds = backgrounds;

        //for three-dimensional lighting
        this.lights = lights;

        this.config = {
            _INVOKER_: _INVOKER_,
            runName: runName,
            frameInc: frameInc,
            numberOfFrame: numberOfFrame,
            finalFileName: finalFileName,
            fileOut: fileOut
        }
    }

    async getColorFromBucket() {
        return this.colorScheme.getColorFromBucket();
    }

    async getNeutralFromBucket() {
        return this.neutrals[getRandomIntExclusive(0, this.neutrals.length)]
    }

    async getBackgroundFromBucket() {
        return this.backgrounds[getRandomIntExclusive(0, this.backgrounds.length)]
    }

    async getLightFromBucket() {
        return this.lights[getRandomIntExclusive(0, this.lights.length)]
    }

    async getColorSchemeInfo() {
        return this.colorScheme.getColorSchemeInfo();
    }
}