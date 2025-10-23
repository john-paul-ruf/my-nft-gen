import { EffectConfig } from 'my-nft-gen';
import { getRandomIntExclusive } from 'my-nft-gen/src/core/math/random.js';
import {Position} from "my-nft-gen/src/core/position/Position.js";
import { DynamicRange } from 'my-nft-gen/src/core/layer/configType/DynamicRange.js';
import { PercentageRange } from 'my-nft-gen/src/core/layer/configType/PercentageRange.js';
import { PercentageShortestSide } from 'my-nft-gen/src/core/layer/configType/PercentageShortestSide.js';
import { PercentageLongestSide } from 'my-nft-gen/src/core/layer/configType/PercentageLongestSide.js';
import { Range } from 'my-nft-gen/src/core/layer/configType/Range.js';

export class LensFlareConfig extends EffectConfig {
    constructor(
        {
            layerOpacityRange = new DynamicRange(new Range(1, 1), new Range(1, 1)),
            layerOpacityTimes = new Range(2, 6),

            elementOpacityRange = new DynamicRange(new Range(0.5, 0.6), new Range(0.8, 1)),
            elementOpacityTimes = new Range(2, 6),

            elementGastonRange = new DynamicRange(new Range(5, 10), new Range(15, 30)),
            elementGastonTimes = new Range(2, 6),

            numberOfFlareHex = new Range(0, 0),
            flareHexSizeRange = new PercentageRange(new PercentageShortestSide(0.015), new PercentageShortestSide(0.025)),
            flareHexOffsetRange = new PercentageRange(-1 * new PercentageShortestSide(0.3), new PercentageShortestSide(0.3)),

            angleRangeFlareHex = new DynamicRange(new Range(1, 2), new Range(4, 6)),
            angleGastonTimes = new Range(1, 6),

            numberOfFlareRings = new Range(10, 20),
            flareRingsSizeRange = new PercentageRange(new PercentageShortestSide(0.25), new PercentageLongestSide(0.75)),
            flareRingStroke = new Range(1, 1),

            numberOfFlareRays = new Range(20, 30),
            flareRaysSizeRange = new PercentageRange(new PercentageLongestSide(0.4), new PercentageLongestSide(1)),
            flareRaysStroke = new Range(1, 1),

            blurRange = new DynamicRange(new Range(0, 0), new Range(0, 0)),
            blurTimes = new Range(0, 0),

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
            },
            center = new Position({x: 1080 / 2, y: 1920 / 2}),
        },
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
        this.flareHexOffsetRange = flareHexOffsetRange;
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
        this.center = center;
    }
}
