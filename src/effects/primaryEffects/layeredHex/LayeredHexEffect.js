import {LayerEffect} from "../../LayerEffect.js";
import {GlobalSettings} from "../../../core/GlobalSettings.js";
import {getRandomIntInclusive, randomId, randomNumber} from "../../../core/math/random.js";
import fs from "fs";
import {findPointByAngleAndCircle, getPointsForLayerAndDensity} from "../../../core/math/drawingMath.js";
import {findValue} from "../../../core/math/findValue.js";
import {findOneWayValue} from "../../../core/math/findOneWayValue.js";
import {Canvas2dFactory} from "../../../core/factory/canvas/Canvas2dFactory.js";
import {LayerFactory} from "../../../core/factory/layer/LayerFactory.js";

export class LayeredHexEffect extends LayerEffect {
    constructor({
                    name = 'layered-hex-now-with-fuzz',
                    requiresLayer = true,
                    config = {
                        invertLayers: true,

                        thickness: 1,
                        stroke: 1,

                        layerOpacityRange: {bottom: {lower: 1, upper: 1}, top: {lower: 1, upper: 1}},
                        layerOpacityTimes: {lower: 2, upper: 4},

                        indexOpacityRange: {bottom: {lower: 0.3, upper: 0.5}, top: {lower: 0.9, upper: 1}},
                        indexOpacityTimes: {lower: 2, upper: 4},

                        radius: {lower: 60, upper: 80},
                        offsetRadius: {lower: 70, upper: 120},

                        numberOfIndex: {lower: 10, upper: 20},
                        startIndex: {lower: 10, upper: 12},

                        startAngle: 15,

                        movementGaston: {lower: 1, upper: 6},

                        initialNumberOfPoints: 12,
                        scaleByFactor: 1.125,

                        accentRange: {bottom: {lower: 1, upper: 1}, top: {lower: 3, upper: 6}},
                        blurRange: {bottom: {lower: 1, upper: 1}, top: {lower: 1, upper: 1}},
                        featherTimes: {lower: 2, upper: 4},
                    }
                },
                additionalEffects = [],
                ignoreAdditionalEffects = false) {
        super({name: name, requiresLayer: requiresLayer, config: config}, additionalEffects, ignoreAdditionalEffects);
    }


    async #drawHexElement(arrayIndex, context, useAccentGaston) {
        const count = arrayIndex + 1;

        const numberOfPoints = getPointsForLayerAndDensity(context.data.initialNumberOfPoints, context.data.scaleByFactor, count);
        const startingAngle = 360 / numberOfPoints;

        const element = context.data.hexArray[arrayIndex];
        const theAccentGaston = findValue(element.accentRange.lower, element.accentRange.upper, element.featherTimes, context.numberOfFrames, context.currentFrame);

        const invert = (count % 2) > 0;
        const theAngleGaston = findOneWayValue(0, context.data.hexArray[arrayIndex].movementGaston * startingAngle, context.numberOfFrames, context.currentFrame, invert);

        const tempCanvas = await Canvas2dFactory.getNewCanvas(context.data.width, context.data.height);

        for (let i = 1; i <= numberOfPoints; i++) {

            const angle = ((startingAngle * i) + theAngleGaston) % 360;
            const offset = context.data.offsetRadius * count;

            const pos = findPointByAngleAndCircle(context.data.center, angle, offset);

            const theOpacityGaston = findValue(element.opacity.lower, element.opacity.upper, element.opacityTimes, context.numberOfFrames, context.currentFrame, invert)

            if (useAccentGaston) {
                await tempCanvas.drawPolygon2d(context.data.hexArray[arrayIndex].radius, pos, 6, context.data.startAngle, context.data.thickness, element.color, context.data.thickness + context.data.stroke + theAccentGaston, element.outline, theOpacityGaston);
            } else {
                await tempCanvas.drawPolygon2d(context.data.hexArray[arrayIndex].radius, pos, 6, context.data.startAngle, context.data.thickness, element.color, context.data.thickness + context.data.stroke, element.outline, theOpacityGaston);
            }
        }
        return {element, tempCanvas};
    }

    async #drawLayer(context, arrayIndex, useAccentGaston) {
        return new Promise(async (innerResolve) => {
            try {
                const tempFileName = GlobalSettings.getWorkingDirectory() + 'layered-hex-element' + randomId() + '.png'
                const {element, tempCanvas} = await this.#drawHexElement(arrayIndex, context, useAccentGaston);
                await tempCanvas.toFile(tempFileName)
                const tempLayer = await LayerFactory.getLayerFromFile(tempFileName);
                const theBlurGaston = Math.ceil(findValue(element.blurRange.lower, element.blurRange.upper, element.featherTimes, context.numberOfFrames, context.currentFrame))
                await tempLayer.blur(theBlurGaston);
                fs.unlinkSync(tempFileName);
                innerResolve(tempLayer);
            } catch (e) {
                console.log(e);
            }
        });
    }

    async #createLayers(context) {

        return new Promise(async (resolve) => {

            const promiseBottomArray = [];
            const promiseTopArray = [];

            for (let i = 0; i < context.data.hexArray.length; i++) {
                promiseBottomArray.push(this.#drawLayer(context, i, true));
            }

            for (let i = 0; i < context.data.hexArray.length; i++) {
                promiseTopArray.push(this.#drawLayer(context, i, false));
            }

            //when all effect promises complete
            Promise.all([Promise.all(promiseBottomArray), Promise.all(promiseTopArray)]).then(async (layers) => {

                const theOpacityGaston = findValue(context.data.layerOpacityRange.lower, context.data.layerOpacityRange.upper, context.data.layerOpacityTimes, context.numberOfFrames, context.currentFrame)

                if (!context.data.invertLayers) {
                    for (let i = 0; i < layers.length; i++) {
                        if (layers[i].length > 0) {
                            for (let inner = 0; inner < layers[i].length; inner++) {
                                await layers[i][inner].adjustLayerOpacity(theOpacityGaston);
                                await context.layer.compositeLayerOver(layers[i][inner]);
                            }
                        }
                    }
                } else {
                    for (let i = layers.length - 1; i >= 0; i--) {
                        if (layers[i].length > 0) {
                            for (let inner = 0; inner < layers[i].length; inner++) {
                                await layers[i][inner].adjustLayerOpacity(theOpacityGaston);
                                await context.layer.compositeLayerOver(layers[i][inner]);
                            }
                        }
                    }
                }
                resolve();
            });
        });

    }


    async #layeredHex(layer, currentFrame, numberOfFrames) {
        const context = {
            currentFrame: currentFrame,
            numberOfFrames: numberOfFrames,
            top: GlobalSettings.getWorkingDirectory() + 'layered-hex-top' + randomId() + '.png',
            bottom: GlobalSettings.getWorkingDirectory() + 'layered-hex-bottom' + randomId() + '.png',
            data: this.data,
            layer: layer
        };

        await this.#createLayers(context);
    }


    async generate(settings) {

        super.generate(settings);

        const data =
            {
                invertLayers: this.config.invertLayers,

                height: GlobalSettings.getFinalImageSize().height,
                width: GlobalSettings.getFinalImageSize().width,
                center: {
                    x: GlobalSettings.getFinalImageSize().width / 2,
                    y: GlobalSettings.getFinalImageSize().height / 2
                },

                startAngle: this.config.startAngle,
                thickness: this.config.thickness,
                stroke: this.config.stroke,

                initialNumberOfPoints: this.config.initialNumberOfPoints,
                scaleByFactor: this.config.scaleByFactor,

                numberOfIndex: getRandomIntInclusive(this.config.numberOfIndex.lower, this.config.numberOfIndex.upper),
                startIndex: getRandomIntInclusive(this.config.startIndex.lower, this.config.startIndex.upper),

                layerOpacityRange: {
                    lower: randomNumber(this.config.layerOpacityRange.bottom.lower, this.config.layerOpacityRange.bottom.upper),
                    upper: randomNumber(this.config.layerOpacityRange.top.lower, this.config.layerOpacityRange.top.upper)
                },
                layerOpacityTimes: getRandomIntInclusive(this.config.layerOpacityTimes.lower, this.config.layerOpacityTimes.upper),

                offsetRadius: getRandomIntInclusive(this.config.offsetRadius.lower, this.config.offsetRadius.upper),

                getInfo: () => {

                }
            };


        const getHexIndexArray = async (num) => {
            const info = [];

            for (let i = 0; i <= num; i++) {
                info.push({
                    color: settings.getNeutralFromBucket(),
                    outline: settings.getColorFromBucket(),

                    opacity: {
                        lower: randomNumber(this.config.indexOpacityRange.bottom.lower, this.config.indexOpacityRange.bottom.upper),
                        upper: randomNumber(this.config.indexOpacityRange.top.lower, this.config.indexOpacityRange.top.upper)
                    },
                    opacityTimes: getRandomIntInclusive(this.config.indexOpacityTimes.lower, this.config.indexOpacityTimes.upper),
                    movementGaston: getRandomIntInclusive(this.config.movementGaston.lower, this.config.movementGaston.upper),
                    radius: getRandomIntInclusive(this.config.radius.lower, this.config.radius.upper),

                    accentRange: {
                        lower: getRandomIntInclusive(this.config.accentRange.bottom.lower, this.config.accentRange.bottom.upper),
                        upper: getRandomIntInclusive(this.config.accentRange.top.lower, this.config.accentRange.top.upper)
                    },
                    blurRange: {
                        lower: getRandomIntInclusive(this.config.blurRange.bottom.lower, this.config.blurRange.bottom.upper),
                        upper: getRandomIntInclusive(this.config.blurRange.top.lower, this.config.blurRange.top.upper)
                    },
                    featherTimes: getRandomIntInclusive(this.config.featherTimes.lower, this.config.featherTimes.upper),
                });
            }

            return info;
        }

        data.hexArray = await getHexIndexArray(data.numberOfIndex);

        this.data = data;
    }

    async invoke(layer, currentFrame, numberOfFrames) {
        await this.#layeredHex(layer, currentFrame, numberOfFrames);
        await super.invoke(layer, currentFrame, numberOfFrames);
    }

    getInfo() {
        return `${this.name}: ${this.data.offsetRadius} offset radius, ${this.data.numberOfIndex} layers, ${this.data.startIndex} offset`
    }
}




