import { promises as fs } from 'fs';
import { LayerEffect } from 'my-nft-gen';
import { getRandomIntInclusive, randomId, randomNumber } from 'my-nft-gen/src/core/math/random.js';
import { findPointByAngleAndCircle, getPointsForLayerAndDensity } from 'my-nft-gen/src/core/math/drawingMath.js';
import { findValue } from 'my-nft-gen/src/core/math/findValue.js';
import { findOneWayValue } from 'my-nft-gen/src/core/math/findOneWayValue.js';
import { Canvas2dFactory } from 'my-nft-gen/src/core/factory/canvas/Canvas2dFactory.js';
import { LayerFactory } from 'my-nft-gen/src/core/factory/layer/LayerFactory.js';
import { Settings } from 'my-nft-gen/src/core/Settings.js';
import { LayeredHexConfig } from './LayeredHexConfig.js';
import { Range } from 'my-nft-gen/src/core/layer/configType/Range.js';
import { DynamicRange } from 'my-nft-gen/src/core/layer/configType/DynamicRange.js';
import { Position } from 'my-nft-gen/src/core/position/Position.js';

export class LayeredHexEffect extends LayerEffect {
    static _name_ = 'layered-hex-now-with-fuzz';
    static configClass = LayeredHexConfig;

    static presets = [
        {
            name: 'simple-layered-hex',
            effect: 'layered-hex-now-with-fuzz',
            percentChance: 100,
            currentEffectConfig: {
                invertLayers: true,
                thickness: 1,
                stroke: 1,
                layerOpacityRange: new DynamicRange(new Range(0.8, 0.8), new Range(1, 1)),
                layerOpacityTimes: new Range(1, 2),
                indexOpacityRange: new DynamicRange(new Range(0.3, 0.4), new Range(0.7, 0.8)),
                indexOpacityTimes: new Range(1, 2),
                radius: new Range(30, 60),
                offsetRadius: new Range(40 , 60),
                numberOfIndex: new Range(6, 15),
                startIndex: new Range(5, 8),
                startAngle: 15,
                movementGaston: new Range(1, 3),
                initialNumberOfPoints: 8,
                scaleByFactor: 1.2,
                accentRange: new DynamicRange(new Range(0.5, 0.5), new Range(2, 4)),
                blurRange: new DynamicRange(new Range(1, 1), new Range(1, 1)),
                featherTimes: new Range(1, 2),
                center: new Position({x: 1080 / 2, y: 1920 / 2}),
            }
        },
        {
            name: 'classic-layered-hex',
            effect: 'layered-hex-now-with-fuzz',
            percentChance: 100,
            currentEffectConfig: {
                invertLayers: true,
                thickness: 1,
                stroke: 1,
                layerOpacityRange: new DynamicRange(new Range(0.8, 0.8), new Range(1, 1)),
                layerOpacityTimes: new Range(1, 2),
                indexOpacityRange: new DynamicRange(new Range(0.3, 0.4), new Range(0.7, 0.8)),
                indexOpacityTimes: new Range(1, 2),
                radius: new Range(40, 80),
                offsetRadius: new Range(40 , 60),
                numberOfIndex: new Range(10, 30),
                startIndex: new Range(5, 8),
                startAngle: 15,
                movementGaston: new Range(1, 3),
                initialNumberOfPoints: 8,
                scaleByFactor: 1.2,
                accentRange: new DynamicRange(new Range(0.5, 0.5), new Range(2, 4)),
                blurRange: new DynamicRange(new Range(1, 1), new Range(1, 1)),
                featherTimes: new Range(1, 2),
                center: new Position({x: 1080 / 2, y: 1920 / 2}),
            }
        },
        {
            name: 'complex-layered-hex',
            effect: 'layered-hex-now-with-fuzz',
            percentChance: 100,
            currentEffectConfig: {
                invertLayers: true,
                thickness: 1,
                stroke: 1,
                layerOpacityRange: new DynamicRange(new Range(0.8, 0.8), new Range(1, 1)),
                layerOpacityTimes: new Range(1, 2),
                indexOpacityRange: new DynamicRange(new Range(0.3, 0.4), new Range(0.7, 0.8)),
                indexOpacityTimes: new Range(1, 2),
                radius: new Range(40, 80),
                numberOfIndex: new Range(10, 30),
                startIndex: new Range(5, 8),
                startIndex: new Range(5, 8),
                startAngle: 15,
                movementGaston: new Range(1, 3),
                initialNumberOfPoints: 12,
                scaleByFactor: 1.2,
                accentRange: new DynamicRange(new Range(0.5, 0.5), new Range(2, 4)),
                blurRange: new DynamicRange(new Range(1, 1), new Range(1, 1)),
                featherTimes: new Range(1, 2),
                center: new Position({x: 1080 / 2, y: 1920 / 2}),
            }
        }
    ];

    constructor({
        name = LayeredHexEffect._name_,
        requiresLayer = true,
        config = new LayeredHexConfig({}),
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

    async #drawHexElement(arrayIndex, context, useAccentGaston) {
        const count = arrayIndex + 1;

        const numberOfPoints = getPointsForLayerAndDensity(context.data.initialNumberOfPoints, context.data.scaleByFactor, count);
        const startingAngle = 360 / numberOfPoints;

        const element = context.data.hexArray[arrayIndex];
        const theAccentGaston = findValue(element.accentRange.lower, element.accentRange.upper, element.featherTimes, context.numberOfFrames, context.currentFrame);

        const invert = (count % 2) > 0;
        const theAngleGaston = findOneWayValue(0, context.data.hexArray[arrayIndex].movementGaston * startingAngle, 1, context.numberOfFrames, context.currentFrame, invert);

        const tempCanvas = await Canvas2dFactory.getNewCanvas(context.data.width, context.data.height);

        for (let i = 1; i <= numberOfPoints; i++) {
            const angle = ((startingAngle * i) + theAngleGaston) % 360;
            const offset = context.data.offsetRadius * count;

            const pos = findPointByAngleAndCircle(context.data.center.getPosition(context.currentFrame, context.numberOfFrames), angle, offset);

            const theOpacityGaston = findValue(element.opacity.lower, element.opacity.upper, element.opacityTimes, context.numberOfFrames, context.currentFrame, invert);

            if (useAccentGaston) {
                await tempCanvas.drawPolygon2d(context.data.hexArray[arrayIndex].radius, pos, 6, context.data.startAngle, context.data.thickness, element.outline, context.data.thickness + context.data.stroke + theAccentGaston, element.outline, theOpacityGaston);
            } else {
                await tempCanvas.drawPolygon2d(context.data.hexArray[arrayIndex].radius, pos, 6, context.data.startAngle, context.data.thickness, element.color, context.data.thickness, element.color, theOpacityGaston);
            }
        }
        return { tempCanvas };
    }

    async #drawLayer(context, arrayIndex, useAccentGaston) {
        const { tempCanvas } = await this.#drawHexElement(arrayIndex, context, useAccentGaston);
        return await tempCanvas.convertToLayer();
    }

    async #createLayers(context) {
        const topLayers = [];

        for (let i = context.data.startIndex; i < context.data.hexArray.length; i++) {
            topLayers.push(await this.#drawLayer(context, i, false));
        }

        const bottomLayers = [];

        for (let i = context.data.startIndex; i < context.data.hexArray.length; i++) {
            bottomLayers.push(await this.#drawLayer(context, i, true));
        }

        const theOpacityGaston = findValue(context.data.layerOpacityRange.lower, context.data.layerOpacityRange.upper, context.data.layerOpacityTimes, context.numberOfFrames, context.currentFrame);

        const layers = [];
        layers.push(topLayers);
        layers.push(bottomLayers);

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
    }

    async #layeredHex(layer, currentFrame, numberOfFrames) {
        const context = {
            currentFrame,
            numberOfFrames,
            data: this.data,
            layer,
        };

        await this.#createLayers(context);
    }

    #generate(settings) {
        const data = {
            invertLayers: this.config.invertLayers,

            height: this.finalSize.height,
            width: this.finalSize.width,
            center: this.config.center,

            startAngle: this.config.startAngle,
            thickness: this.config.thickness,
            stroke: this.config.stroke,

            initialNumberOfPoints: this.config.initialNumberOfPoints,
            scaleByFactor: this.config.scaleByFactor,

            numberOfIndex: getRandomIntInclusive(this.config.numberOfIndex.lower, this.config.numberOfIndex.upper),
            startIndex: getRandomIntInclusive(this.config.startIndex.lower, this.config.startIndex.upper),

            layerOpacityRange: {
                lower: randomNumber(this.config.layerOpacityRange.bottom.lower, this.config.layerOpacityRange.bottom.upper),
                upper: randomNumber(this.config.layerOpacityRange.top.lower, this.config.layerOpacityRange.top.upper),
            },
            layerOpacityTimes: getRandomIntInclusive(this.config.layerOpacityTimes.lower, this.config.layerOpacityTimes.upper),

            offsetRadius: getRandomIntInclusive(this.config.offsetRadius.lower, this.config.offsetRadius.upper),

            getInfo: () => {

            },
        };

        const getHexIndexArray = (num) => {
            const info = [];

            for (let i = 0; i <= num; i++) {
                info.push({
                    color: '#FFFFFF',
                    outline: settings.getColorFromBucket(),

                    opacity: {
                        lower: randomNumber(this.config.indexOpacityRange.bottom.lower, this.config.indexOpacityRange.bottom.upper),
                        upper: randomNumber(this.config.indexOpacityRange.top.lower, this.config.indexOpacityRange.top.upper),
                    },
                    opacityTimes: getRandomIntInclusive(this.config.indexOpacityTimes.lower, this.config.indexOpacityTimes.upper),
                    movementGaston: getRandomIntInclusive(this.config.movementGaston.lower, this.config.movementGaston.upper),
                    radius: getRandomIntInclusive(this.config.radius.lower, this.config.radius.upper),

                    accentRange: {
                        lower: getRandomIntInclusive(this.config.accentRange.bottom.lower, this.config.accentRange.bottom.upper),
                        upper: getRandomIntInclusive(this.config.accentRange.top.lower, this.config.accentRange.top.upper),
                    },
                    blurRange: {
                        lower: getRandomIntInclusive(this.config.blurRange.bottom.lower, this.config.blurRange.bottom.upper),
                        upper: getRandomIntInclusive(this.config.blurRange.top.lower, this.config.blurRange.top.upper),
                    },
                    featherTimes: getRandomIntInclusive(this.config.featherTimes.lower, this.config.featherTimes.upper),
                });
            }

            return info;
        };

        data.hexArray = getHexIndexArray(data.numberOfIndex);

        this.data = data;
    }

    async invoke(layer, currentFrame, numberOfFrames) {
        await this.#layeredHex(layer, currentFrame, numberOfFrames);
        await super.invoke(layer, currentFrame, numberOfFrames);
    }

    getInfo() {
        return `${this.name}: ${this.data.offsetRadius} offset radius, ${this.data.numberOfIndex} layers, ${this.data.startIndex} offset`;
    }
}
