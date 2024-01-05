import {LayerEffect} from "../../../core/layer/LayerEffect.js";
import {getRandomIntExclusive, getRandomIntInclusive, randomId, randomNumber} from "../../../core/math/random.js";
import {findValue} from "../../../core/math/findValue.js";
import {Canvas2dFactory} from "../../../core/factory/canvas/Canvas2dFactory.js";
import {LayerFactory} from "../../../core/factory/layer/LayerFactory.js";
import fs from "fs";
import {findPointByAngleAndCircle} from "../../../core/math/drawingMath.js";
import {Settings} from "../../../core/Settings.js";
import {LensFlareConfig} from "./LensFlareConfig.js";

export class LensFlareEffect extends LayerEffect {

    static _name_ = 'upgraded-lens-flare';

    constructor({
                    name = LensFlareEffect._name_,
                    requiresLayer = true,
                    config = new LensFlareConfig({}),
                    additionalEffects = [],
                    ignoreAdditionalEffects = false,
                    settings = new Settings({})
                }) {
        super({
            name: name,
            requiresLayer: requiresLayer,
            config: config,
            additionalEffects: additionalEffects,
            ignoreAdditionalEffects: ignoreAdditionalEffects,
            settings: settings
        });
        this.#generate(settings)
    }


    async #drawHexArray(context, array) {
        async function hex(i) {
            return new Promise(async (innerResolve) => {
                const tempFileName = this.workingDirectory + 'lens-flare-ring' + randomId() + '.png'

                const angleGaston = findValue(context.data.angleRangeFlareHex.lower, context.data.angleRangeFlareHex.upper, context.data.angleGastonTimes, context.numberOfFrames, context.currentFrame);

                const pos = findPointByAngleAndCircle(context.data.center, angleGaston, array[i].offset)

                const theOpacityGaston = findValue(array[i].opacity.lower, array[i].opacity.upper, array[i].opacityTimes, context.numberOfFrames, context.currentFrame)

                await context.canvas.drawFilledPolygon2d(array[i].size, pos, array[i].sides, array[i].angle, array[i].color, theOpacityGaston);
                await context.canvas.drawPolygon2d(array[i].size, pos, array[i].sides, array[i].angle, 1.5, array[i].strokeColor, 1.5, array[i].strokeColor, theOpacityGaston);

                await context.canvas.toFile(tempFileName);
                const tempLayer = await LayerFactory.getLayerFromFile(tempFileName, this.fileConfig);

                fs.unlinkSync(tempFileName);
                innerResolve(tempLayer);
            });
        }

        return new Promise(async (resolve) => {
            const promiseArray = [];

            for (let i = 0; i < array.length; i++) {
                promiseArray.push(hex(i));
            }

            //when all effect promises complete
            Promise.all(promiseArray).then(async (layers) => {
                resolve(layers); //we have completed a single frame
            });
        });
    }

    async #rings(i, array, context) {
        return new Promise(async (innerResolve) => {
            try {
                const tempFileName = this.workingDirectory + 'lens-flare-ring' + randomId() + '.png'
                const canvas = await Canvas2dFactory.getNewCanvas(context.data.width, context.data.height);

                const theOpacityGaston = findValue(array[i].opacity.lower, array[i].opacity.upper, array[i].opacityTimes, context.numberOfFrames, context.currentFrame)
                const theRadiusGaston = findValue(array[i].size + array[i].gastonRange.lower, array[i].size + array[i].gastonRange.upper, array[i].gastonTimes, context.numberOfFrames, context.currentFrame, array[i].gastonInvert)
                const theBlurGaston = Math.ceil(findValue(array[i].blurRange.lower, array[i].blurRange.upper, array[i].blurTimes, context.numberOfFrames, context.currentFrame));


                await canvas.drawRing2d(context.data.center, theRadiusGaston, array[i].stroke, array[i].color, array[i].stroke, array[i].color, theOpacityGaston);

                await canvas.toFile(tempFileName);

                const tempLayer = await LayerFactory.getLayerFromFile(tempFileName, this.fileConfig);

                await tempLayer.blur(theBlurGaston);
                await tempLayer.adjustLayerOpacity(theOpacityGaston);

                fs.unlinkSync(tempFileName);

                innerResolve(tempLayer);

            } catch (e) {
                console.log(e);
            }
        });
    }

    async #drawRingArray(context, array) {
        return new Promise(async (resolve) => {
            const ringPromiseArray = [];

            for (let i = 0; i < array.length; i++) {
                ringPromiseArray.push(this.#rings(i, array, context));
            }

            //when all effect promises complete
            Promise.all(ringPromiseArray).then(async (layers) => {
                resolve(layers); //we have completed a single frame
            });
        });
    }

    async #rays(i, array, context) {
        return new Promise(async (innerResolve) => {
            try {
                const tempFileName = this.workingDirectory + 'lens-flare-ray' + randomId() + '.png'
                const canvas = await Canvas2dFactory.getNewCanvas(context.data.width, context.data.height);

                const theOpacityGaston = findValue(array[i].opacity.lower, array[i].opacity.upper, array[i].opacityTimes, context.numberOfFrames, context.currentFrame)
                const theBlurGaston = Math.ceil(findValue(array[i].blurRange.lower, array[i].blurRange.upper, array[i].blurTimes, context.numberOfFrames, context.currentFrame));

                const theAngleGaston = findValue(array[i].angle + array[i].gastonRange.lower, array[i].angle + array[i].gastonRange.upper, array[i].gastonTimes, context.numberOfFrames, context.currentFrame, array[i].gastonInvert)

                const start = findPointByAngleAndCircle(context.data.center, theAngleGaston, array[i].offset);
                const end = findPointByAngleAndCircle(context.data.center, theAngleGaston, array[i].size);

                await canvas.drawLine2d(start, end, array[i].stroke, array[i].color, array[i].stroke, array[i].color, theOpacityGaston);
                await canvas.toFile(tempFileName);

                const tempLayer = await LayerFactory.getLayerFromFile(tempFileName, this.fileConfig);

                await tempLayer.blur(theBlurGaston);
                await tempLayer.adjustLayerOpacity(theOpacityGaston);

                fs.unlinkSync(tempFileName);

                innerResolve(tempLayer);
            } catch (e) {
                console.log(e);
            }

        });
    }

    async #drawRayArray(context, array) {
        return new Promise(async (resolve) => {
            const promiseArray = [];
            for (let i = 0; i < array.length; i++) {
                promiseArray.push(this.#rays(i, array, context));
            }
            //when all effect promises complete
            Promise.all(promiseArray).then(async (layers) => {
                resolve(layers); //we have completed a single frame
            });
        });
    }

    async #createLensFlare(context) {
        return new Promise(async (resolve) => {

            const promiseArray = [];

            promiseArray.push(this.#drawHexArray(context, context.data.hexArray));
            promiseArray.push(this.#drawRingArray(context, context.data.ringArray));
            promiseArray.push(this.#drawRayArray(context, context.data.rayArray));

            //when all effect promises complete
            Promise.all(promiseArray).then(async (layers) => {
                for (let i = 0; i < layers.length; i++) {
                    if (layers[i].length > 0) {
                        for (let inner = 0; inner < layers[i].length; inner++) {
                            await context.layer.compositeLayerOver(layers[i][inner]);
                        }
                    }
                }
                resolve();
            });
        });
    }


    async #lensFlare(layer, currentFrame, numberOfFrames) {
        const context = {
            currentFrame: currentFrame,
            numberOfFrames: numberOfFrames,
            canvas: await Canvas2dFactory.getNewCanvas(this.data.width, this.data.height),
            data: this.data,
            layer: layer
        };

        await this.#createLensFlare(context);

        const theOpacityGaston = findValue(this.data.layerOpacityRange.lower, this.data.layerOpacityRange.upper, this.data.layerOpacityTimes, numberOfFrames, currentFrame)
        await layer.adjustLayerOpacity(theOpacityGaston);
    }

    #generate(settings) {
        const data =
            {
                height: this.finalSize.height,
                width: this.finalSize.width,
                center: {
                    x: this.finalSize.width / 2,
                    y: this.finalSize.height / 2
                },

                numberOfFlareHex: getRandomIntInclusive(this.config.numberOfFlareHex.lower, this.config.numberOfFlareHex.upper),
                numberOfFlareRings: getRandomIntInclusive(this.config.numberOfFlareRings.lower, this.config.numberOfFlareRings.upper),
                numberOfFlareRays: getRandomIntInclusive(this.config.numberOfFlareRays.lower, this.config.numberOfFlareRays.upper),

                layerOpacityRange: {
                    lower: randomNumber(this.config.layerOpacityRange.bottom.lower, this.config.layerOpacityRange.bottom.upper),
                    upper: randomNumber(this.config.layerOpacityRange.top.lower, this.config.layerOpacityRange.top.upper)
                },
                layerOpacityTimes: getRandomIntInclusive(this.config.layerOpacityTimes.lower, this.config.layerOpacityTimes.upper),

                blurRange: {
                    lower: getRandomIntInclusive(this.config.blurRange.bottom.lower, this.config.blurRange.bottom.upper),
                    upper: getRandomIntInclusive(this.config.blurRange.top.lower, this.config.blurRange.top.upper)
                },
                blurTimes: getRandomIntInclusive(this.config.blurTimes.lower, this.config.blurTimes.upper),

                angleRangeFlareHex: {
                    lower: randomNumber(this.config.angleRangeFlareHex.bottom.lower, this.config.angleRangeFlareHex.bottom.upper),
                    upper: randomNumber(this.config.angleRangeFlareHex.top.lower, this.config.angleRangeFlareHex.top.upper)
                },
                angleGastonTimes: getRandomIntInclusive(this.config.angleGastonTimes.lower, this.config.angleGastonTimes.upper),

                strategy: this.config.strategy[getRandomIntExclusive(0, this.config.strategy.length)],

                getInfo: () => {

                }
            };


        const getFlareHexArray = (num, strategy) => {
            const info = [];

            for (let i = 0; i < num; i++) {
                info.push({
                    size: getRandomIntInclusive(this.config.flareHexSizeRange.lower(this.finalSize), this.config.flareHexSizeRange.upper(this.finalSize)),
                    color: this.config.getFlareColor(strategy, settings, this.config),
                    strokeColor: this.config.getFlareColor(strategy, settings, this.config),
                    sides: getRandomIntInclusive(6, 6), //ended up with hex...
                    angle: getRandomIntInclusive(0, 360),
                    offset: getRandomIntInclusive(this.finalSize.width * 0.15, this.finalSize.width * 0.15),
                    opacity: {
                        lower: randomNumber(this.config.elementOpacityRange.bottom.lower, this.config.elementOpacityRange.bottom.upper),
                        upper: randomNumber(this.config.elementOpacityRange.top.lower, this.config.elementOpacityRange.top.upper)
                    },
                    opacityTimes: getRandomIntInclusive(this.config.elementOpacityTimes.lower, this.config.elementOpacityTimes.upper),
                });
            }

            return info;
        }

        const getFlareRingArray = (num, strategy) => {
            const info = [];

            for (let i = 0; i <= num; i++) {
                info.push({
                    size: getRandomIntInclusive(this.config.flareRingsSizeRange.lower(this.finalSize), this.config.flareRingsSizeRange.upper(this.finalSize)),
                    stroke: getRandomIntInclusive(this.config.flareRingStroke.lower, this.config.flareRingStroke.upper),
                    color: this.config.getFlareColor(strategy, settings, this.config),
                    opacity: {
                        lower: randomNumber(this.config.elementOpacityRange.bottom.lower, this.config.elementOpacityRange.bottom.upper),
                        upper: randomNumber(this.config.elementOpacityRange.top.lower, this.config.elementOpacityRange.top.upper)
                    },
                    opacityTimes: getRandomIntInclusive(this.config.elementOpacityTimes.lower, this.config.elementOpacityTimes.upper),
                    gastonRange: {
                        lower: randomNumber(this.config.elementGastonRange.bottom.lower, this.config.elementGastonRange.bottom.upper),
                        upper: randomNumber(this.config.elementGastonRange.top.lower, this.config.elementGastonRange.top.upper)
                    },
                    gastonTimes: getRandomIntInclusive(this.config.elementGastonTimes.lower, this.config.elementGastonTimes.upper),
                    gastonInvert: getRandomIntInclusive(0, 1) > 0,

                    blurRange: {
                        lower: getRandomIntInclusive(this.config.blurRange.bottom.lower, this.config.blurRange.bottom.upper),
                        upper: getRandomIntInclusive(this.config.blurRange.top.lower, this.config.blurRange.top.upper)
                    },
                    blurTimes: getRandomIntInclusive(this.config.blurTimes.lower, this.config.blurTimes.upper),
                });
            }

            return info;
        }

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
                        upper: randomNumber(this.config.elementOpacityRange.top.lower, this.config.elementOpacityRange.top.upper)
                    },
                    opacityTimes: getRandomIntInclusive(this.config.elementOpacityTimes.lower, this.config.elementOpacityTimes.upper),
                    offset: getRandomIntInclusive(this.finalSize.width * 0.15, this.finalSize.width * 0.25,),
                    gastonRange: {
                        lower: randomNumber(this.config.elementGastonRange.bottom.lower, this.config.elementGastonRange.bottom.upper),
                        upper: randomNumber(this.config.elementGastonRange.top.lower, this.config.elementGastonRange.top.upper)
                    },
                    gastonTimes: getRandomIntInclusive(this.config.elementGastonTimes.lower, this.config.elementGastonTimes.upper),
                    gastonInvert: getRandomIntInclusive(0, 1) > 0,

                    blurRange: {
                        lower: getRandomIntInclusive(this.config.blurRange.bottom.lower, this.config.blurRange.bottom.upper),
                        upper: getRandomIntInclusive(this.config.blurRange.top.lower, this.config.blurRange.top.upper)
                    },
                    blurTimes: getRandomIntInclusive(this.config.blurTimes.lower, this.config.blurTimes.upper),
                });
            }

            return info;
        }

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
        return `${this.name}: ${this.data.strategy} strategy, ${this.data.numberOfFlareHex} polygons, ${this.data.numberOfFlareRings} rings, ${this.data.numberOfFlareRays} rays`
    }
}




