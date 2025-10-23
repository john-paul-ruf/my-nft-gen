import {LayerEffect} from 'my-nft-gen/src/core/layer/LayerEffect.js';
import {getRandomFromArray, getRandomIntInclusive, randomNumber,} from 'my-nft-gen/src/core/math/random.js';
import {findValue} from 'my-nft-gen/src/core/math/findValue.js';
import {Canvas2dFactory} from 'my-nft-gen/src/core/factory/canvas/Canvas2dFactory.js';
import {findPointByAngleAndCircle} from 'my-nft-gen/src/core/math/drawingMath.js';
import {Settings} from 'my-nft-gen/src/core/Settings.js';
import {FuzzFlareConfig} from './FuzzFlareConfig.js';
import {FindMultiStepStepValue} from "my-nft-gen/src/core/math/FindMultiStepValue.js";
import {Range} from 'my-nft-gen/src/core/layer/configType/Range.js';
import {DynamicRange} from 'my-nft-gen/src/core/layer/configType/DynamicRange.js';
import {ColorPicker} from 'my-nft-gen/src/core/layer/configType/ColorPicker.js';
import {Position} from 'my-nft-gen/src/core/position/Position.js';
import {PercentageRange} from 'my-nft-gen/src/core/layer/configType/PercentageRange.js';
import {PercentageShortestSide} from 'my-nft-gen/src/core/layer/configType/PercentageShortestSide.js';
import {PercentageLongestSide} from 'my-nft-gen/src/core/layer/configType/PercentageLongestSide.js';
import {MultiStepDefinitionConfig} from 'my-nft-gen/src/core/math/MultiStepDefinitionConfig.js';
import {getAllFindValueAlgorithms} from 'my-nft-gen/src/core/math/findValue.js';

/** *
 *
 * Creates a lens flare with the ability to add fuzz
 *
 */

export class FuzzFlareEffect extends LayerEffect {
    static _name_ = 'fuzz-flare';

    static presets = [
        {
            name: 'subtle-fuzz-flare',
            effect: 'fuzz-flare',
            percentChance: 100,
            currentEffectConfig: {
                layerOpacity: 0.5,
                outerColor: new ColorPicker(ColorPicker.SelectionType.colorBucket),
                innerColor: new ColorPicker(ColorPicker.SelectionType.colorBucket),
                center: new Position({x: 1080 / 2, y: 1920 / 2}),
                underLayerOpacityRange: new DynamicRange(new Range(0.25, 0.3), new Range(0.35, 0.4)),
                underLayerOpacityTimes: new Range(1, 4),
                elementGastonMultiStep: [
                    new MultiStepDefinitionConfig({
                        minPercentage: 0,
                        maxPercentage: 50,
                        max: new Range(8, 12),
                        times: new Range(1, 1),
                    }),
                    new MultiStepDefinitionConfig({
                        minPercentage: 50,
                        maxPercentage: 100,
                        max: new Range(8, 12),
                        times: new Range(1, 2),
                    }),
                ],
                numberOfFlareRings: new Range(15, 20),
                flareRingsSizeRange: new PercentageRange(new PercentageShortestSide(0.05), new PercentageLongestSide(0.7)),
                flareRingStroke: new Range(1, 1),
                flareRingThickness: new Range(1, 2),
                numberOfFlareRays: new Range(30, 40),
                flareRaysSizeRange: new PercentageRange(new PercentageLongestSide(0.5), new PercentageLongestSide(0.8)),
                flareRaysStroke: new Range(1, 1),
                flareRayThickness: new Range(1, 2),
                flareOffset: new PercentageRange(new PercentageShortestSide(0.01), new PercentageShortestSide(0.04)),
                accentRange: new DynamicRange(new Range(1, 3), new Range(4, 7)),
                blurRange: new DynamicRange(new Range(2, 4), new Range(6, 8)),
                featherTimes: new Range(1, 4),
                accentFindValueAlgorithms: getAllFindValueAlgorithms(),
                blurFindValueAlgorithm: getAllFindValueAlgorithms(),
                opacityFindValueAlgorithm: getAllFindValueAlgorithms(),
            }
        },
        {
            name: 'classic-fuzz-flare',
            effect: 'fuzz-flare',
            percentChance: 100,
            currentEffectConfig: {
                layerOpacity: 0.7,
                outerColor: new ColorPicker(ColorPicker.SelectionType.colorBucket),
                innerColor: new ColorPicker(ColorPicker.SelectionType.colorBucket),
                center: new Position({x: 1080 / 2, y: 1920 / 2}),
                underLayerOpacityRange: new DynamicRange(new Range(0.35, 0.4), new Range(0.5, 0.55)),
                underLayerOpacityTimes: new Range(2, 8),
                elementGastonMultiStep: [
                    new MultiStepDefinitionConfig({
                        minPercentage: 0,
                        maxPercentage: 25,
                        max: new Range(15, 25),
                        times: new Range(1, 2),
                    }),
                    new MultiStepDefinitionConfig({
                        minPercentage: 25,
                        maxPercentage: 75,
                        max: new Range(8, 12),
                        times: new Range(1, 4),
                    }),
                    new MultiStepDefinitionConfig({
                        minPercentage: 75,
                        maxPercentage: 100,
                        max: new Range(15, 20),
                        times: new Range(1, 3),
                    }),
                ],
                numberOfFlareRings: new Range(25, 25),
                flareRingsSizeRange: new PercentageRange(new PercentageShortestSide(0.05), new PercentageLongestSide(1)),
                flareRingStroke: new Range(1, 1),
                flareRingThickness: new Range(1, 3),
                numberOfFlareRays: new Range(50, 50),
                flareRaysSizeRange: new PercentageRange(new PercentageLongestSide(0.7), new PercentageLongestSide(1)),
                flareRaysStroke: new Range(1, 1),
                flareRayThickness: new Range(1, 3),
                flareOffset: new PercentageRange(new PercentageShortestSide(0.01), new PercentageShortestSide(0.06)),
                accentRange: new DynamicRange(new Range(2, 6), new Range(8, 14)),
                blurRange: new DynamicRange(new Range(4, 6), new Range(8, 12)),
                featherTimes: new Range(2, 8),
                accentFindValueAlgorithm: getAllFindValueAlgorithms(),
                blurFindValueAlgorithm: getAllFindValueAlgorithms(),
                opacityFindValueAlgorithm: getAllFindValueAlgorithms(),
            }
        },
        {
            name: 'intense-fuzz-flare',
            effect: 'fuzz-flare',
            percentChance: 100,
            currentEffectConfig: {
                layerOpacity: 0.85,
                outerColor: new ColorPicker(ColorPicker.SelectionType.colorBucket),
                innerColor: new ColorPicker(ColorPicker.SelectionType.colorBucket),
                center: new Position({x: 1080 / 2, y: 1920 / 2}),
                underLayerOpacityRange: new DynamicRange(new Range(0.5, 0.6), new Range(0.7, 0.8)),
                underLayerOpacityTimes: new Range(4, 12),
                elementGastonMultiStep: [
                    new MultiStepDefinitionConfig({
                        minPercentage: 0,
                        maxPercentage: 20,
                        max: new Range(25, 40),
                        times: new Range(2, 4),
                    }),
                    new MultiStepDefinitionConfig({
                        minPercentage: 20,
                        maxPercentage: 80,
                        max: new Range(15, 25),
                        times: new Range(2, 6),
                    }),
                    new MultiStepDefinitionConfig({
                        minPercentage: 80,
                        maxPercentage: 100,
                        max: new Range(25, 35),
                        times: new Range(2, 5),
                    }),
                ],
                numberOfFlareRings: new Range(40, 50),
                flareRingsSizeRange: new PercentageRange(new PercentageShortestSide(0.03), new PercentageLongestSide(1.2)),
                flareRingStroke: new Range(1, 2),
                flareRingThickness: new Range(2, 4),
                numberOfFlareRays: new Range(75, 100),
                flareRaysSizeRange: new PercentageRange(new PercentageLongestSide(0.8), new PercentageLongestSide(1.2)),
                flareRaysStroke: new Range(1, 2),
                flareRayThickness: new Range(2, 4),
                flareOffset: new PercentageRange(new PercentageShortestSide(0.01), new PercentageShortestSide(0.08)),
                accentRange: new DynamicRange(new Range(4, 10), new Range(12, 20)),
                blurRange: new DynamicRange(new Range(6, 10), new Range(12, 18)),
                featherTimes: new Range(4, 12),
                accentFindValueAlgorithm: getAllFindValueAlgorithms(),
                blurFindValueAlgorithm: getAllFindValueAlgorithms(),
                opacityFindValueAlgorithm: getAllFindValueAlgorithms(),
            }
        }
    ];

    constructor({
                    name = FuzzFlareEffect._name_,
                    requiresLayer = true,
                    config = new FuzzFlareConfig({}),
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

    async #rings(i, array, context) {
        const topCanvas = await Canvas2dFactory.getNewCanvas(context.data.width, context.data.height);
        const bottomCanvas = await Canvas2dFactory.getNewCanvas(context.data.width, context.data.height);

        const theOpacityGaston = findValue(array[i].underLayerOpacityRange.lower, array[i].underLayerOpacityRange.upper, array[i].underLayerOpacityTimes, context.numberOfFrames, context.currentFrame, array[i].opacityFindValueAlgorithm);
        const theRadiusGaston = array[i].size + (FindMultiStepStepValue.findValue({
                    stepArray: array[i].gastonRange,
                    totalNumberOfFrames: context.numberOfFrames,
                    currentFrame: context.currentFrame,
                })
                * (array[i].invert ? 1 : -1));

        const theBlurGaston = Math.ceil(findValue(array[i].blurRange.lower, array[i].blurRange.upper, array[i].featherTimes, context.numberOfFrames, context.currentFrame, array[i].blurFindValueAlgorithm));
        const theAccentGaston = findValue(array[i].accentRange.lower, array[i].accentRange.upper, array[i].featherTimes, context.numberOfFrames, context.currentFrame, array[i].accentFindValueAlgorithm);

        await topCanvas.drawRing2d(context.data.center.getPosition(context.currentFrame, context.numberOfFrames), theRadiusGaston, array[i].thickness, array[i].innerColor, 0, array[i].innerColor);
        await bottomCanvas.drawRing2d(context.data.center.getPosition(context.currentFrame, context.numberOfFrames), theRadiusGaston, array[i].thickness, array[i].outerColor, array[i].stroke + theAccentGaston, array[i].outerColor, theOpacityGaston);

        const topLayer = await topCanvas.convertToLayer();
        const bottomLayer = await bottomCanvas.convertToLayer();

        await bottomLayer.blur(theBlurGaston);
        await bottomLayer.adjustLayerOpacity(theOpacityGaston);

        await topLayer.adjustLayerOpacity(context.data.layerOpacity);

        if (!context.data.invertLayers) {
            await context.layer.compositeLayerOver(bottomLayer);
            await context.layer.compositeLayerOver(topLayer);
        } else {
            await context.layer.compositeLayerOver(topLayer);
            await context.layer.compositeLayerOver(bottomLayer);
        }
    }

    async #drawRingArray(context, array) {
        for (let i = 0; i < array.length; i++) {
            await this.#rings(i, array, context);
        }
    }

    async #rays(i, array, context) {
        const topCanvas = await Canvas2dFactory.getNewCanvas(context.data.width, context.data.height);
        const bottomCanvas = await Canvas2dFactory.getNewCanvas(context.data.width, context.data.height);

        const theOpacityGaston = findValue(array[i].underLayerOpacityRange.lower, array[i].underLayerOpacityRange.upper, array[i].underLayerOpacityTimes, context.numberOfFrames, context.currentFrame, array[i].opacityFindValueAlgorithm);
        const theBlurGaston = Math.ceil(findValue(array[i].blurRange.lower, array[i].blurRange.upper, array[i].featherTimes, context.numberOfFrames, context.currentFrame, array[i].blurFindValueAlgorithm));

        const theAngleGaston = array[i].angle + (FindMultiStepStepValue.findValue({
                stepArray: array[i].gastonRange,
                totalNumberOfFrames: context.numberOfFrames,
                currentFrame: context.currentFrame
            })
            * (array[i].invert ? 1 : -1));


        const theAccentGaston = findValue(array[i].accentRange.lower, array[i].accentRange.upper, array[i].featherTimes, context.numberOfFrames, context.currentFrame, array[i].accentFindValueAlgorithm);

        const start = findPointByAngleAndCircle(context.data.center.getPosition(context.currentFrame, context.numberOfFrames), theAngleGaston, array[i].offset);
        const end = findPointByAngleAndCircle(context.data.center.getPosition(context.currentFrame, context.numberOfFrames), theAngleGaston, array[i].size);

        await topCanvas.drawLine2d(start, end, array[i].thickness, array[i].innerColor, 0, array[i].innerColor);
        await bottomCanvas.drawLine2d(start, end, array[i].stroke, array[i].outerColor, array[i].stroke + theAccentGaston, array[i].outerColor, theOpacityGaston);

        const topLayer = await topCanvas.convertToLayer();
        const bottomLayer = await bottomCanvas.convertToLayer();

        await bottomLayer.blur(theBlurGaston);
        await bottomLayer.adjustLayerOpacity(theOpacityGaston);

        await topLayer.adjustLayerOpacity(context.data.layerOpacity);

        if (!context.data.invertLayers) {
            await context.layer.compositeLayerOver(bottomLayer);
            await context.layer.compositeLayerOver(topLayer);
        } else {
            await context.layer.compositeLayerOver(topLayer);
            await context.layer.compositeLayerOver(bottomLayer);
        }
    }

    async #drawRayArray(context, array) {
        for (let i = 0; i < array.length; i++) {
            await this.#rays(i, array, context);
        }
    }

    async #createFuzzFlare(context) {
        await this.#drawRingArray(context, context.data.ringArray);
        await this.#drawRayArray(context, context.data.rayArray);
    }

    async #fuzzFlare(layer, currentFrame, numberOfFrames) {
        const context = {
            currentFrame,
            numberOfFrames,
            canvas: await Canvas2dFactory.getNewCanvas(this.data.width, this.data.height),
            data: this.data,
            layer,
        };

        await this.#createFuzzFlare(context);
    }

    #generate(settings) {
        const data = {
            height: this.finalSize.height,
            width: this.finalSize.width,
            center: this.config.center,

            invertLayers: this.config.invertLayers,
            layerOpacity: this.config.layerOpacity,

            numberOfFlareRings: getRandomIntInclusive(this.config.numberOfFlareRings.lower, this.config.numberOfFlareRings.upper),
            numberOfFlareRays: getRandomIntInclusive(this.config.numberOfFlareRays.lower, this.config.numberOfFlareRays.upper),
        };

        const getFlareRingArray = (num) => {
            const info = [];

            for (let i = 0; i < num; i++) {
                info.push({
                    invert: getRandomIntInclusive(0,1) === 1,
                    size: getRandomIntInclusive(this.config.flareRingsSizeRange.lower(this.finalSize), this.config.flareRingsSizeRange.upper(this.finalSize)),
                    stroke: getRandomIntInclusive(this.config.flareRingStroke.lower, this.config.flareRingStroke.upper),
                    thickness: getRandomIntInclusive(this.config.flareRingThickness.lower, this.config.flareRingThickness.upper),
                    innerColor: this.config.innerColor.getColor(settings),
                    outerColor: this.config.outerColor.getColor(settings),
                    gastonRange: FindMultiStepStepValue.convertFromConfigToDefinition(this.config.elementGastonMultiStep),
                    accentRange: {
                        lower: getRandomIntInclusive(this.config.accentRange.bottom.lower, this.config.accentRange.bottom.upper),
                        upper: getRandomIntInclusive(this.config.accentRange.top.lower, this.config.accentRange.top.upper),
                    },
                    blurRange: {
                        lower: getRandomIntInclusive(this.config.blurRange.bottom.lower, this.config.blurRange.bottom.upper),
                        upper: getRandomIntInclusive(this.config.blurRange.top.lower, this.config.blurRange.top.upper),
                    },
                    featherTimes: getRandomIntInclusive(this.config.featherTimes.lower, this.config.featherTimes.upper),
                    underLayerOpacityRange: {
                        lower: randomNumber(this.config.underLayerOpacityRange.bottom.lower, this.config.underLayerOpacityRange.bottom.upper),
                        upper: randomNumber(this.config.underLayerOpacityRange.top.lower, this.config.underLayerOpacityRange.top.upper),
                    },
                    underLayerOpacityTimes: getRandomIntInclusive(this.config.underLayerOpacityTimes.lower, this.config.underLayerOpacityTimes.upper),
                    accentFindValueAlgorithm: getRandomFromArray(this.config.accentFindValueAlgorithm),
                    blurFindValueAlgorithm: getRandomFromArray(this.config.blurFindValueAlgorithm),
                    opacityFindValueAlgorithm: getRandomFromArray(this.config.opacityFindValueAlgorithm),
                });
            }

            return info;
        };

        const getFlareRayArray = (num) => {
            const info = [];

            for (let i = 0; i < num; i++) {
                info.push({
                    invert: getRandomIntInclusive(0,1) === 1,
                    size: getRandomIntInclusive(this.config.flareRaysSizeRange.lower(this.finalSize), this.config.flareRaysSizeRange.upper(this.finalSize)),
                    stroke: getRandomIntInclusive(this.config.flareRaysStroke.lower, this.config.flareRaysStroke.upper),
                    thickness: getRandomIntInclusive(this.config.flareRayThickness.lower, this.config.flareRayThickness.upper),
                    angle: getRandomIntInclusive(0, 360),
                    innerColor: this.config.innerColor.getColor(settings),
                    outerColor: this.config.outerColor.getColor(settings),
                    offset: getRandomIntInclusive(this.config.flareOffset.lower(this.finalSize), this.config.flareOffset.upper(this.finalSize)),
                    gastonRange: FindMultiStepStepValue.convertFromConfigToDefinition(this.config.elementGastonMultiStep),
                    accentRange: {
                        lower: getRandomIntInclusive(this.config.accentRange.bottom.lower, this.config.accentRange.bottom.upper),
                        upper: getRandomIntInclusive(this.config.accentRange.top.lower, this.config.accentRange.top.upper),
                    },
                    blurRange: {
                        lower: getRandomIntInclusive(this.config.blurRange.bottom.lower, this.config.blurRange.bottom.upper),
                        upper: getRandomIntInclusive(this.config.blurRange.top.lower, this.config.blurRange.top.upper),
                    },
                    featherTimes: getRandomIntInclusive(this.config.featherTimes.lower, this.config.featherTimes.upper),
                    underLayerOpacityRange: {
                        lower: randomNumber(this.config.underLayerOpacityRange.bottom.lower, this.config.underLayerOpacityRange.bottom.upper),
                        upper: randomNumber(this.config.underLayerOpacityRange.top.lower, this.config.underLayerOpacityRange.top.upper),
                    },
                    underLayerOpacityTimes: getRandomIntInclusive(this.config.underLayerOpacityTimes.lower, this.config.underLayerOpacityTimes.upper),
                    accentFindValueAlgorithm: getRandomFromArray(this.config.accentFindValueAlgorithm),
                    blurFindValueAlgorithm: getRandomFromArray(this.config.blurFindValueAlgorithm),
                    opacityFindValueAlgorithm: getRandomFromArray(this.config.opacityFindValueAlgorithm),
                });
            }

            return info;
        };

        data.ringArray = getFlareRingArray(data.numberOfFlareRings);
        data.rayArray = getFlareRayArray(data.numberOfFlareRays);

        this.data = data;
    }

    async invoke(layer, currentFrame, numberOfFrames) {
        await this.#fuzzFlare(layer, currentFrame, numberOfFrames);
        await super.invoke(layer, currentFrame, numberOfFrames);
    }

    getInfo() {
        return `${this.name}: ${this.data.numberOfFlareRings} rings, ${this.data.numberOfFlareRays} rays`;
    }
}
