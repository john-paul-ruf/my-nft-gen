import { promises as fs } from 'fs';
import { LayerEffect } from '../../../core/layer/LayerEffect.js';
import { getRandomIntInclusive, randomId, randomNumber } from '../../../core/math/random.js';
import { findPointByAngleAndCircle, getPointsForLayerAndDensity } from '../../../core/math/drawingMath.js';
import { findOneWayValue } from '../../../core/math/findOneWayValue.js';
import { findValue } from '../../../core/math/findValue.js';
import { Canvas2dFactory } from '../../../core/factory/canvas/Canvas2dFactory.js';
import { LayerFactory } from '../../../core/factory/layer/LayerFactory.js';
import { Settings } from '../../../core/Settings.js';
import { LayeredRingConfig } from './LayeredRingConfig.js';

export class LayeredRingEffect extends LayerEffect {
    static _name_ = 'layered-rings';

    constructor({
        name = LayeredRingEffect._name_,
        requiresLayer = true,
        config = new LayeredRingConfig({}),
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

    async #drawHexLayer(context, arrayIndex, layer) {
        const numberOfPoints = getPointsForLayerAndDensity(context.data.initialNumberOfPoints, context.data.scaleByFactor, layer);
        const startingAngle = 360 / numberOfPoints;

        const element = context.data.ringArray[arrayIndex];

        const invert = (layer % 2) > 0;
        const theAngleGaston = findOneWayValue(0, context.data.ringArray[arrayIndex].movementGaston * startingAngle, 1, context.numberOfFrames, context.currentFrame, invert);

        for (let i = 1; i <= numberOfPoints; i++) {
            const angle = ((startingAngle * i) + theAngleGaston) % 360;
            const offset = context.data.offsetRadius * layer;

            const pos = findPointByAngleAndCircle(context.data.center, angle, offset);

            const theOpacityGaston = findValue(element.opacity.lower, element.opacity.upper, element.opacityTimes, context.numberOfFrames, context.currentFrame, invert);

            await context.canvas.drawRing2d(pos, context.data.ringArray[arrayIndex].radius, context.data.thickness, element.color, context.data.stroke, element.outline, theOpacityGaston);
        }
    }

    async #createLayers(context) {
        for (let i = 0; i < context.data.ringArray.length; i++) {
            await this.#drawHexLayer(context, i, context.data.startIndex + i);
        }

        await context.canvas.toFile(context.drawing);
    }

    async #layeredRings(layer, currentFrame, numberOfFrames) {
        const context = {
            currentFrame,
            numberOfFrames,
            drawing: `${this.workingDirectory}layered-ring${randomId()}.png`,
            canvas: await Canvas2dFactory.getNewCanvas(this.data.width, this.data.height),
            data: this.data,
        };

        await this.#createLayers(context);

        const drawingLayer = await LayerFactory.getLayerFromFile(context.drawing, this.fileConfig);

        const theOpacityGaston = findValue(this.data.layerOpacityRange.lower, this.data.layerOpacityRange.upper, this.data.layerOpacityTimes, numberOfFrames, currentFrame);
        await drawingLayer.adjustLayerOpacity(theOpacityGaston); // gaston this later

        await layer.compositeLayerOver(drawingLayer);
        await fs.unlink(context.drawing);
    }

    #generate(settings) {
        const data = {
            height: this.finalSize.height,
            width: this.finalSize.width,
            center: {
                x: this.finalSize.width / 2,
                y: this.finalSize.height / 2,
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
                upper: randomNumber(this.config.layerOpacityRange.top.lower, this.config.layerOpacityRange.top.upper),
            },
            layerOpacityTimes: getRandomIntInclusive(this.config.layerOpacityTimes.lower, this.config.layerOpacityTimes.upper),

            offsetRadius: getRandomIntInclusive(this.config.offsetRadius.lower, this.config.offsetRadius.upper),
        };

        const getRingsIndexArray = (num) => {
            const info = [];

            for (let i = 0; i <= num; i++) {
                info.push({
                    color: settings.getColorFromBucket(),
                    outline: settings.getNeutralFromBucket(),
                    opacity: {
                        lower: randomNumber(this.config.indexOpacityRange.bottom.lower, this.config.indexOpacityRange.bottom.upper),
                        upper: randomNumber(this.config.indexOpacityRange.top.lower, this.config.indexOpacityRange.top.upper),
                    },
                    opacityTimes: getRandomIntInclusive(this.config.indexOpacityTimes.lower, this.config.indexOpacityTimes.upper),
                    movementGaston: getRandomIntInclusive(this.config.movementGaston.lower, this.config.movementGaston.upper),
                    radius: getRandomIntInclusive(this.config.radius.lower, this.config.radius.upper),
                });
            }

            return info;
        };

        data.ringArray = getRingsIndexArray(data.numberOfIndex);

        this.data = data;
    }

    async invoke(layer, currentFrame, numberOfFrames) {
        await this.#layeredRings(layer, currentFrame, numberOfFrames);
        await super.invoke(layer, currentFrame, numberOfFrames);
    }

    getInfo() {
        return `${this.name}: ${this.data.offsetRadius} offset radius, ${this.data.numberOfIndex} layers, ${this.data.startIndex} offset`;
    }
}
