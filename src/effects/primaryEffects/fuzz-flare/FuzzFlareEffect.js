import {LayerEffect} from '../../../core/layer/LayerEffect.js';
import {getRandomFromArray, getRandomIntInclusive, randomNumber,} from '../../../core/math/random.js';
import {findValue} from '../../../core/math/findValue.js';
import {Canvas2dFactory} from '../../../core/factory/canvas/Canvas2dFactory.js';
import {findPointByAngleAndCircle} from '../../../core/math/drawingMath.js';
import {Settings} from '../../../core/Settings.js';
import {FuzzFlareConfig} from './FuzzFlareConfig.js';
import {FindMultiStepStepValue} from "../../../core/math/FindMultiStepValue.js";

/** *
 *
 * Creates a lens flare with the ability to add fuzz
 *
 */

export class FuzzFlareEffect extends LayerEffect {
    static _name_ = 'fuzz-flare';

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

        await topCanvas.drawRing2d(context.data.center, theRadiusGaston, array[i].thickness, array[i].innerColor, 0, array[i].innerColor);
        await bottomCanvas.drawRing2d(context.data.center, theRadiusGaston, array[i].thickness, array[i].outerColor, array[i].stroke + theAccentGaston, array[i].outerColor, theOpacityGaston);

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

        const start = findPointByAngleAndCircle(context.data.center, theAngleGaston, array[i].offset);
        const end = findPointByAngleAndCircle(context.data.center, theAngleGaston, array[i].size);

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
