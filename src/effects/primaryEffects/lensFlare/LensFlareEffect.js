import {LayerEffect} from 'my-nft-gen/src/core/layer/LayerEffect.js';
import {
    getRandomIntExclusive, getRandomIntInclusive, randomId, randomNumber,
} from 'my-nft-gen/src/core/math/random.js';
import {findValue} from 'my-nft-gen/src/core/math/findValue.js';
import {Canvas2dFactory} from 'my-nft-gen/src/core/factory/canvas/Canvas2dFactory.js';
import {findPointByAngleAndCircle} from 'my-nft-gen/src/core/math/drawingMath.js';
import {Settings} from 'my-nft-gen/src/core/Settings.js';
import {LensFlareConfig} from './LensFlareConfig.js';
import {Range} from 'my-nft-gen/src/core/layer/configType/Range.js';
import {DynamicRange} from 'my-nft-gen/src/core/layer/configType/DynamicRange.js';
import {Position} from 'my-nft-gen/src/core/position/Position.js';
import {PercentageRange} from 'my-nft-gen/src/core/layer/configType/PercentageRange.js';
import {PercentageShortestSide} from 'my-nft-gen/src/core/layer/configType/PercentageShortestSide.js';
import {PercentageLongestSide} from 'my-nft-gen/src/core/layer/configType/PercentageLongestSide.js';

export class LensFlareEffect extends LayerEffect {
    static _name_ = 'upgraded-lens-flare';
    static configClass = LensFlareConfig;

    static presets = [
        {
            name: 'subtle-lens-flare',
            effect: 'upgraded-lens-flare',
            percentChance: 100,
            currentEffectConfig: {
                layerOpacityRange: new DynamicRange(new Range(0.8, 0.8), new Range(1, 1)),
                layerOpacityTimes: new Range(1, 3),
                elementOpacityRange: new DynamicRange(new Range(0.4, 0.5), new Range(0.6, 0.7)),
                elementOpacityTimes: new Range(1, 3),
                elementGastonRange: new DynamicRange(new Range(3, 5), new Range(8, 15)),
                elementGastonTimes: new Range(1, 3),
                numberOfFlareHex: new Range(0, 0),
                flareHexSizeRange: new PercentageRange(new PercentageShortestSide(0.01), new PercentageShortestSide(0.02)),
                flareHexOffsetRange: new PercentageRange(-1 * new PercentageShortestSide(0.2), new PercentageShortestSide(0.2)),
                angleRangeFlareHex: new DynamicRange(new Range(1, 1), new Range(3, 4)),
                angleGastonTimes: new Range(1, 3),
                numberOfFlareRings: new Range(5, 10),
                flareRingsSizeRange: new PercentageRange(new PercentageShortestSide(0.15), new PercentageLongestSide(0.5)),
                flareRingStroke: new Range(1, 1),
                numberOfFlareRays: new Range(10, 15),
                flareRaysSizeRange: new PercentageRange(new PercentageLongestSide(0.3), new PercentageLongestSide(0.7)),
                flareRaysStroke: new Range(1, 1),
                blurRange: new DynamicRange(new Range(0, 0), new Range(0, 0)),
                blurTimes: new Range(0, 0),
                strategy: ['original', 'color-bucket', 'neutral-bucket'],
                center: new Position({x: 1080 / 2, y: 1920 / 2}),
            }
        },
        {
            name: 'classic-lens-flare',
            effect: 'upgraded-lens-flare',
            percentChance: 100,
            currentEffectConfig: {
                layerOpacityRange: new DynamicRange(new Range(1, 1), new Range(1, 1)),
                layerOpacityTimes: new Range(2, 6),
                elementOpacityRange: new DynamicRange(new Range(0.5, 0.6), new Range(0.8, 1)),
                elementOpacityTimes: new Range(2, 6),
                elementGastonRange: new DynamicRange(new Range(5, 10), new Range(15, 30)),
                elementGastonTimes: new Range(2, 6),
                numberOfFlareHex: new Range(0, 0),
                flareHexSizeRange: new PercentageRange(new PercentageShortestSide(0.015), new PercentageShortestSide(0.025)),
                flareHexOffsetRange: new PercentageRange(-1 * new PercentageShortestSide(0.3), new PercentageShortestSide(0.3)),
                angleRangeFlareHex: new DynamicRange(new Range(1, 2), new Range(4, 6)),
                angleGastonTimes: new Range(1, 6),
                numberOfFlareRings: new Range(10, 20),
                flareRingsSizeRange: new PercentageRange(new PercentageShortestSide(0.25), new PercentageLongestSide(0.75)),
                flareRingStroke: new Range(1, 1),
                numberOfFlareRays: new Range(20, 30),
                flareRaysSizeRange: new PercentageRange(new PercentageLongestSide(0.4), new PercentageLongestSide(1)),
                flareRaysStroke: new Range(1, 1),
                blurRange: new DynamicRange(new Range(0, 0), new Range(0, 0)),
                blurTimes: new Range(0, 0),
                strategy: ['original', 'color-bucket', 'neutral-bucket'],
                center: new Position({x: 1080 / 2, y: 1920 / 2}),
            }
        },
        {
            name: 'intense-lens-flare',
            effect: 'upgraded-lens-flare',
            percentChance: 100,
            currentEffectConfig: {
                layerOpacityRange: new DynamicRange(new Range(1, 1), new Range(1, 1)),
                layerOpacityTimes: new Range(3, 8),
                elementOpacityRange: new DynamicRange(new Range(0.6, 0.7), new Range(0.9, 1)),
                elementOpacityTimes: new Range(3, 8),
                elementGastonRange: new DynamicRange(new Range(8, 15), new Range(20, 40)),
                elementGastonTimes: new Range(3, 8),
                numberOfFlareHex: new Range(0, 2),
                flareHexSizeRange: new PercentageRange(new PercentageShortestSide(0.02), new PercentageShortestSide(0.035)),
                flareHexOffsetRange: new PercentageRange(-1 * new PercentageShortestSide(0.4), new PercentageShortestSide(0.4)),
                angleRangeFlareHex: new DynamicRange(new Range(2, 3), new Range(6, 10)),
                angleGastonTimes: new Range(2, 8),
                numberOfFlareRings: new Range(20, 30),
                flareRingsSizeRange: new PercentageRange(new PercentageShortestSide(0.3), new PercentageLongestSide(1)),
                flareRingStroke: new Range(1, 2),
                numberOfFlareRays: new Range(30, 50),
                flareRaysSizeRange: new PercentageRange(new PercentageLongestSide(0.6), new PercentageLongestSide(1.2)),
                flareRaysStroke: new Range(1, 2),
                blurRange: new DynamicRange(new Range(0, 1), new Range(1, 2)),
                blurTimes: new Range(1, 2),
                strategy: ['original', 'color-bucket', 'neutral-bucket'],
                center: new Position({x: 1080 / 2, y: 1920 / 2}),
            }
        }
    ];

    constructor({
                    name = LensFlareEffect._name_,
                    requiresLayer = true,
                    config = new LensFlareConfig({}),
                    additionalEffects = [],
                    ignoreAdditionalEffects = false,
                    settings = new Settings({}),
                }) {
        super({
            name,
            requiresLayer,
            config,
            additionalEffects,
            ignoreAdditionalEffects,
            settings,
        });
        this.#generate(settings);
    }

    async #drawHexArray(context, array) {
        async function hex(i) {
            const angleGaston = findValue(context.data.angleRangeFlareHex.lower, context.data.angleRangeFlareHex.upper, context.data.angleGastonTimes, context.numberOfFrames, context.currentFrame);

            const pos = findPointByAngleAndCircle(context.data.center.getPosition(context.currentFrame, context.numberOfFrames), angleGaston, array[i].offset);

            const theOpacityGaston = findValue(array[i].opacity.lower, array[i].opacity.upper, array[i].opacityTimes, context.numberOfFrames, context.currentFrame);

            await context.canvas.drawFilledPolygon2d(array[i].size, pos, array[i].sides, array[i].angle, array[i].color, theOpacityGaston);
            await context.canvas.drawPolygon2d(array[i].size, pos, array[i].sides, array[i].angle, 1.5, array[i].strokeColor, 1.5, array[i].strokeColor, theOpacityGaston);

            return context.canvas.convertToLayer();
        }

        const hexArray = [];

        for (let i = 0; i < array.length; i++) {
            hexArray.push(await hex(i));
        }

        return hexArray;
    }

    async #rings(i, array, context) {
        const canvas = await Canvas2dFactory.getNewCanvas(context.data.width, context.data.height);

        const theOpacityGaston = findValue(array[i].opacity.lower, array[i].opacity.upper, array[i].opacityTimes, context.numberOfFrames, context.currentFrame);
        const theRadiusGaston = findValue(array[i].size + array[i].gastonRange.lower, array[i].size + array[i].gastonRange.upper, array[i].gastonTimes, context.numberOfFrames, context.currentFrame, array[i].gastonInvert);
        const theBlurGaston = Math.ceil(findValue(array[i].blurRange.lower, array[i].blurRange.upper, array[i].blurTimes, context.numberOfFrames, context.currentFrame));

        await canvas.drawRing2d(context.data.center.getPosition(context.currentFrame, context.numberOfFrames), theRadiusGaston, array[i].stroke, array[i].color, array[i].stroke, array[i].color, theOpacityGaston);

        const tempLayer = await canvas.convertToLayer();

        await tempLayer.blur(theBlurGaston);
        await tempLayer.adjustLayerOpacity(theOpacityGaston);

        return tempLayer;
    }

    async #drawRingArray(context, array) {
        const ringArray = [];

        for (let i = 0; i < array.length; i++) {
            ringArray.push(await this.#rings(i, array, context));
        }

        return ringArray;
    }

    async #rays(i, array, context) {
        const canvas = await Canvas2dFactory.getNewCanvas(context.data.width, context.data.height);

        const theOpacityGaston = findValue(array[i].opacity.lower, array[i].opacity.upper, array[i].opacityTimes, context.numberOfFrames, context.currentFrame);
        const theBlurGaston = Math.ceil(findValue(array[i].blurRange.lower, array[i].blurRange.upper, array[i].blurTimes, context.numberOfFrames, context.currentFrame));

        const theAngleGaston = findValue(array[i].angle + array[i].gastonRange.lower, array[i].angle + array[i].gastonRange.upper, array[i].gastonTimes, context.numberOfFrames, context.currentFrame, array[i].gastonInvert);

        const start = findPointByAngleAndCircle(context.data.center.getPosition(context.currentFrame, context.numberOfFrames), theAngleGaston, array[i].offset);
        const end = findPointByAngleAndCircle(context.data.center.getPosition(context.currentFrame, context.numberOfFrames), theAngleGaston, array[i].size);

        await canvas.drawLine2d(start, end, array[i].stroke, array[i].color, array[i].stroke, array[i].color, theOpacityGaston);

        const tempLayer = await canvas.convertToLayer();

        await tempLayer.blur(theBlurGaston);
        await tempLayer.adjustLayerOpacity(theOpacityGaston);

        return tempLayer;
    }

    async #drawRayArray(context, array) {
        const rayArray = [];

        for (let i = 0; i < array.length; i++) {
            rayArray.push(await this.#rays(i, array, context));
        }

        return rayArray;
    }

    async #createLensFlare(context) {
        const layerArray = [];

        layerArray.push(await this.#drawHexArray(context, context.data.hexArray));
        layerArray.push(await this.#drawRingArray(context, context.data.ringArray));
        layerArray.push(await this.#drawRayArray(context, context.data.rayArray));

        // when all effect promises complete
        for (let i = 0; i < layerArray.length; i++) {
            if (layerArray[i].length > 0) {
                for (let inner = 0; inner < layerArray[i].length; inner++) {
                    await context.layer.compositeLayerOver(layerArray[i][inner]);
                }
            }
        }
    }

    async #lensFlare(layer, currentFrame, numberOfFrames) {
        const context = {
            currentFrame,
            numberOfFrames,
            canvas: await Canvas2dFactory.getNewCanvas(this.data.width, this.data.height),
            data: this.data,
            layer,
        };

        await this.#createLensFlare(context);

        const theOpacityGaston = findValue(this.data.layerOpacityRange.lower, this.data.layerOpacityRange.upper, this.data.layerOpacityTimes, numberOfFrames, currentFrame);
        await layer.adjustLayerOpacity(theOpacityGaston);
    }

    #generate(settings) {
        const data = {
            height: this.finalSize.height,
            width: this.finalSize.width,
            center: this.config.center,

            numberOfFlareHex: getRandomIntInclusive(this.config.numberOfFlareHex.lower, this.config.numberOfFlareHex.upper),
            numberOfFlareRings: getRandomIntInclusive(this.config.numberOfFlareRings.lower, this.config.numberOfFlareRings.upper),
            numberOfFlareRays: getRandomIntInclusive(this.config.numberOfFlareRays.lower, this.config.numberOfFlareRays.upper),

            layerOpacityRange: {
                lower: randomNumber(this.config.layerOpacityRange.bottom.lower, this.config.layerOpacityRange.bottom.upper),
                upper: randomNumber(this.config.layerOpacityRange.top.lower, this.config.layerOpacityRange.top.upper),
            },
            layerOpacityTimes: getRandomIntInclusive(this.config.layerOpacityTimes.lower, this.config.layerOpacityTimes.upper),

            blurRange: {
                lower: getRandomIntInclusive(this.config.blurRange.bottom.lower, this.config.blurRange.bottom.upper),
                upper: getRandomIntInclusive(this.config.blurRange.top.lower, this.config.blurRange.top.upper),
            },
            blurTimes: getRandomIntInclusive(this.config.blurTimes.lower, this.config.blurTimes.upper),

            angleRangeFlareHex: {
                lower: randomNumber(this.config.angleRangeFlareHex.bottom.lower, this.config.angleRangeFlareHex.bottom.upper),
                upper: randomNumber(this.config.angleRangeFlareHex.top.lower, this.config.angleRangeFlareHex.top.upper),
            },
            angleGastonTimes: getRandomIntInclusive(this.config.angleGastonTimes.lower, this.config.angleGastonTimes.upper),

            strategy: this.config.strategy[getRandomIntExclusive(0, this.config.strategy.length)],

            getInfo: () => {

            },
        };

        const getFlareHexArray = (num, strategy) => {
            const info = [];

            for (let i = 0; i < num; i++) {
                info.push({
                    size: getRandomIntInclusive(this.config.flareHexSizeRange.lower(this.finalSize), this.config.flareHexSizeRange.upper(this.finalSize)),
                    color: this.config.getFlareColor(strategy, settings, this.config),
                    strokeColor: this.config.getFlareColor(strategy, settings, this.config),
                    sides: getRandomIntInclusive(6, 6), // ended up with hex...
                    angle: getRandomIntInclusive(0, 360),
                    offset: getRandomIntInclusive(this.config.flareHexOffsetRange.lower(this.finalSize), this.config.flareHexOffsetRange.upper(this.finalSize)),
                    opacity: {
                        lower: randomNumber(this.config.elementOpacityRange.bottom.lower, this.config.elementOpacityRange.bottom.upper),
                        upper: randomNumber(this.config.elementOpacityRange.top.lower, this.config.elementOpacityRange.top.upper),
                    },
                    opacityTimes: getRandomIntInclusive(this.config.elementOpacityTimes.lower, this.config.elementOpacityTimes.upper),
                });
            }

            return info;
        };

        const getFlareRingArray = (num, strategy) => {
            const info = [];

            for (let i = 0; i <= num; i++) {
                info.push({
                    size: getRandomIntInclusive(this.config.flareRingsSizeRange.lower(this.finalSize), this.config.flareRingsSizeRange.upper(this.finalSize)),
                    stroke: getRandomIntInclusive(this.config.flareRingStroke.lower, this.config.flareRingStroke.upper),
                    color: this.config.getFlareColor(strategy, settings, this.config),
                    opacity: {
                        lower: randomNumber(this.config.elementOpacityRange.bottom.lower, this.config.elementOpacityRange.bottom.upper),
                        upper: randomNumber(this.config.elementOpacityRange.top.lower, this.config.elementOpacityRange.top.upper),
                    },
                    opacityTimes: getRandomIntInclusive(this.config.elementOpacityTimes.lower, this.config.elementOpacityTimes.upper),
                    gastonRange: {
                        lower: randomNumber(this.config.elementGastonRange.bottom.lower, this.config.elementGastonRange.bottom.upper),
                        upper: randomNumber(this.config.elementGastonRange.top.lower, this.config.elementGastonRange.top.upper),
                    },
                    gastonTimes: getRandomIntInclusive(this.config.elementGastonTimes.lower, this.config.elementGastonTimes.upper),
                    gastonInvert: getRandomIntInclusive(0, 1) > 0,

                    blurRange: {
                        lower: getRandomIntInclusive(this.config.blurRange.bottom.lower, this.config.blurRange.bottom.upper),
                        upper: getRandomIntInclusive(this.config.blurRange.top.lower, this.config.blurRange.top.upper),
                    },
                    blurTimes: getRandomIntInclusive(this.config.blurTimes.lower, this.config.blurTimes.upper),
                });
            }

            return info;
        };

        const getFlareRayArray = (num, strategy) => {
            const info = [];

            for (let i = 0; i <= num; i++) {
                info.push({
                    size: getRandomIntInclusive(this.config.flareRaysSizeRange.lower(this.finalSize), this.config.flareRaysSizeRange.upper(this.finalSize)),
                    stroke: getRandomIntInclusive(this.config.flareRaysStroke.lower, this.config.flareRaysStroke.upper),
                    angle: getRandomIntInclusive(0, 360),
                    color: this.config.getFlareColor(strategy, settings, this.config),
                    opacity: {
                        lower: randomNumber(this.config.elementOpacityRange.bottom.lower, this.config.elementOpacityRange.bottom.upper),
                        upper: randomNumber(this.config.elementOpacityRange.top.lower, this.config.elementOpacityRange.top.upper),
                    },
                    opacityTimes: getRandomIntInclusive(this.config.elementOpacityTimes.lower, this.config.elementOpacityTimes.upper),
                    offset: getRandomIntInclusive(this.finalSize.width * 0.15, this.finalSize.width * 0.25),
                    gastonRange: {
                        lower: randomNumber(this.config.elementGastonRange.bottom.lower, this.config.elementGastonRange.bottom.upper),
                        upper: randomNumber(this.config.elementGastonRange.top.lower, this.config.elementGastonRange.top.upper),
                    },
                    gastonTimes: getRandomIntInclusive(this.config.elementGastonTimes.lower, this.config.elementGastonTimes.upper),
                    gastonInvert: getRandomIntInclusive(0, 1) > 0,

                    blurRange: {
                        lower: getRandomIntInclusive(this.config.blurRange.bottom.lower, this.config.blurRange.bottom.upper),
                        upper: getRandomIntInclusive(this.config.blurRange.top.lower, this.config.blurRange.top.upper),
                    },
                    blurTimes: getRandomIntInclusive(this.config.blurTimes.lower, this.config.blurTimes.upper),
                });
            }

            return info;
        };

        data.hexArray = getFlareHexArray(data.numberOfFlareHex, data.strategy);
        data.ringArray = getFlareRingArray(data.numberOfFlareRings, data.strategy);
        data.rayArray = getFlareRayArray(data.numberOfFlareRays, data.strategy);

        this.data = data;
    }

    async invoke(layer, currentFrame, numberOfFrames) {
        await this.#lensFlare(layer, currentFrame, numberOfFrames);
        await super.invoke(layer, currentFrame, numberOfFrames);
    }

    getInfo() {
        return `${this.name}: ${this.data.strategy} strategy, ${this.data.numberOfFlareHex} polygons, ${this.data.numberOfFlareRings} rings, ${this.data.numberOfFlareRays} rays`;
    }
}
