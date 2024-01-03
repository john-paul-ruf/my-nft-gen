import {EffectConfig} from "../../../core/layer/EffectConfig.js";
import {getRandomIntExclusive} from "../../../core/math/random.js";

export class LensFlareConfig extends EffectConfig {
    constructor(
        {
            layerOpacityRange = {bottom: {lower: 1, upper: 1}, top: {lower: 1, upper: 1}},
            layerOpacityTimes = {lower: 2, upper: 6},

            elementOpacityRange = {bottom: {lower: 0.5, upper: 0.6}, top: {lower: 0.8, upper: 1}},
            elementOpacityTimes = {lower: 2, upper: 6},

            elementGastonRange = {bottom: {lower: 5, upper: 10}, top: {lower: 15, upper: 30}},
            elementGastonTimes = {lower: 2, upper: 6},

            numberOfFlareHex = {lower: 0, upper: 0},
            flareHexSizeRange = {
                lower: (finalSize) => finalSize.shortestSide * 0.015,
                upper: (finalSize) => finalSize.shortestSide * 0.025
            },

            angleRangeFlareHex = {bottom: {lower: 1, upper: 2}, top: {lower: 4, upper: 6}},
            angleGastonTimes = {lower: 1, upper: 6},

            numberOfFlareRings = {lower: 10, upper: 20},
            flareRingsSizeRange = {
                lower: (finalSize) => finalSize.shortestSide * 0.1,
                upper: (finalSize) => finalSize.longestSide * 0.55
            },
            flareRingStroke = {lower: 1, upper: 1},

            numberOfFlareRays = {lower: 20, upper: 30},
            flareRaysSizeRange = {
                lower: (finalSize) => finalSize.longestSide * 0.4,
                upper: (finalSize) => finalSize.longestSide * 0.55
            },
            flareRaysStroke = {lower: 1, upper: 1},

            blurRange = {bottom: {lower: 1, upper: 1}, top: {lower: 3, upper: 3}},
            blurTimes = {lower: 2, upper: 4},

            strategy = ['original', 'color-bucket', 'neutral-bucket'],

            flareColors = [
                '#d5fecc',
                '#acff99',
                '#83ff66',
                '#5aff33',
                '#31ff00',
                '#9db0ff',
                '#ec9dff',
                '#ffec9d',
                '#ffbb9d',
                '#ff9daf',
            ],

            getFlareColor = (strategy, settings, config) => {
                switch (strategy) {
                    case 'original':
                        return config.flareColors[getRandomIntExclusive(0, config.flareColors.length)];
                    case 'color-bucket':
                        return settings.getColorFromBucket();
                    case 'neutral-bucket':
                        return settings.getNeutralFromBucket();
                    default:
                        return config.flareColors[getRandomIntExclusive(0, config.flareColors.length)];
                }
            }
        }
    ) {
        super();
        this.layerOpacityRange = layerOpacityRange;
        this.layerOpacityTimes = layerOpacityTimes;
        this.elementOpacityRange = elementOpacityRange;
        this.elementOpacityTimes = elementOpacityTimes;
        this.elementGastonRange = elementGastonRange;
        this.elementGastonTimes = elementGastonTimes;
        this.numberOfFlareHex = numberOfFlareHex;
        this.flareHexSizeRange = flareHexSizeRange;
        this.angleRangeFlareHex = angleRangeFlareHex;
        this.angleGastonTimes = angleGastonTimes;
        this.numberOfFlareRings = numberOfFlareRings;
        this.flareRingsSizeRange = flareRingsSizeRange;
        this.flareRingStroke = flareRingStroke;
        this.numberOfFlareRays = numberOfFlareRays;
        this.flareRaysSizeRange = flareRaysSizeRange;
        this.flareRaysStroke = flareRaysStroke;
        this.blurRange = blurRange;
        this.blurTimes = blurTimes;
        this.strategy = strategy;
        this.flareColors = flareColors;
        this.getFlareColor = getFlareColor;
    }
}
