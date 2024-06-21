import { promises as fs } from 'fs';
import { LayerEffect } from '../../../core/layer/LayerEffect.js';
import { LayerFactory } from '../../../core/factory/layer/LayerFactory.js';
import { Canvas2dFactory } from '../../../core/factory/canvas/Canvas2dFactory.js';
import {
    getRandomFromArray, getRandomIntInclusive, randomId, randomNumber,
} from '../../../core/math/random.js';
import { findValue } from '../../../core/math/findValue.js';
import { findPointByAngleAndCircle } from '../../../core/math/drawingMath.js';
import { Settings } from '../../../core/Settings.js';
import { EncircledSpiralConfig } from './EncircledSpiralConfig.js';

/** *
 *
 * Encircled Spiral Effect
 * Creates N spirals based on the sequence and number of rings
 *
 */

export class EncircledSpiralEffect extends LayerEffect {
    static _name_ = 'encircled-spiral-round-2';

    constructor({
        name = EncircledSpiralEffect._name_,
        requiresLayer = true,
        config = new EncircledSpiralConfig({}),
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

    async #computeAngle(angle, context, direction, ringIndex) {
        const spindleStartAngle = angle + context.data.ringArray[ringIndex].startAngle;
        const movementConstant = context.data.ringArray[ringIndex].sparsityFactor * context.data.ringArray[ringIndex].speed;
        const movementForFrame = ((movementConstant / context.numberOfFrames) * context.currentFrame);

        const spindleForFrame = spindleStartAngle + movementForFrame;

        const spindle = spindleForFrame * direction;

        return (spindle % 360);
    }

    async #drawLine(angle, context, flipTwist, thickness, color, ringIndex, sequenceIndex) {
        const direction = ringIndex % 2 > 0 ? -1 : 1;
        angle = await this.#computeAngle(angle, context, direction, ringIndex);

        const pointOne = context.data.sequence[sequenceIndex] * context.data.ringArray[ringIndex].sequencePixelConstant;
        const pointTwo = context.data.sequence[sequenceIndex + 1] * context.data.ringArray[ringIndex].sequencePixelConstant;

        const start = findPointByAngleAndCircle(context.data.center, angle, pointOne);
        const end = findPointByAngleAndCircle(context.data.center, (angle + context.data.ringArray[ringIndex].sparsityFactor * flipTwist), pointTwo);

        await context.canvas.drawLine2d(start, end, thickness, color, 0, color);
    }

    async #drawBottomLayer(context, ringIndex) {
        const theAccentGaston = findValue(context.data.ringArray[ringIndex].accentRange.lower, context.data.ringArray[ringIndex].accentRange.upper, context.data.ringArray[ringIndex].featherTimes, context.numberOfFrames, context.currentFrame);
        for (let sequenceIndex = context.data.ringArray[ringIndex].minSequenceIndex; sequenceIndex < context.data.ringArray[ringIndex].minSequenceIndex + context.data.ringArray[ringIndex].numberOfSequenceElements; sequenceIndex++) {
            for (let i = 0; i < 360; i += context.data.ringArray[ringIndex].sparsityFactor) {
                await this.#drawLine(i, context, 1, context.data.ringArray[ringIndex].stroke + context.data.ringArray[ringIndex].thickness + theAccentGaston, context.data.ringArray[ringIndex].outerColor, ringIndex, sequenceIndex);
                await this.#drawLine(i, context, -1, context.data.ringArray[ringIndex].stroke + context.data.ringArray[ringIndex].thickness + theAccentGaston, context.data.ringArray[ringIndex].outerColor, ringIndex, sequenceIndex);
            }
        }
    }

    async #drawTopLayer(context, ringIndex) {
        for (let sequenceIndex = context.data.ringArray[ringIndex].minSequenceIndex; sequenceIndex < context.data.ringArray[ringIndex].minSequenceIndex + context.data.ringArray[ringIndex].numberOfSequenceElements; sequenceIndex++) {
            for (let i = 0; i < 360; i += context.data.ringArray[ringIndex].sparsityFactor) {
                await this.#drawLine(i, context, 1, context.data.ringArray[ringIndex].thickness, context.data.ringArray[ringIndex].innerColor, ringIndex, sequenceIndex);
                await this.#drawLine(i, context, -1, context.data.ringArray[ringIndex].thickness, context.data.ringArray[ringIndex].innerColor, ringIndex, sequenceIndex);
            }
        }
    }

    async #draw(context, filename) {
        for (let i = 0; i < context.data.ringArray.length; i++) {
            if (!context.data.invertLayers) {
                // bottom layer
                context.canvas = await Canvas2dFactory.getNewCanvas(context.data.width, context.data.height);
                await this.#drawBottomLayer(context, i);
                const bottomLayer = await context.canvas.convertToLayer();
                const theBlurGaston = Math.ceil(findValue(context.data.ringArray[i].blurRange.lower, context.data.ringArray[i].blurRange.upper, context.data.ringArray[i].featherTimes, context.numberOfFrames, context.currentFrame));
                await bottomLayer.blur(theBlurGaston);
                await bottomLayer.adjustLayerOpacity(context.data.underLayerOpacity);
                await context.layer.compositeLayerOver(bottomLayer);

                // top Layer
                context.canvas = await Canvas2dFactory.getNewCanvas(context.data.width, context.data.height);
                await this.#drawTopLayer(context, i);
                const topLayer = await context.canvas.convertToLayer();
                await topLayer.adjustLayerOpacity(context.data.layerOpacity);
                await context.layer.compositeLayerOver(topLayer);
            } else {
                // top Layer
                context.canvas = await Canvas2dFactory.getNewCanvas(context.data.width, context.data.height);
                await this.#drawTopLayer(context, i);
                const topLayer = await context.canvas.convertToLayer();
                await topLayer.adjustLayerOpacity(context.data.layerOpacity);
                await context.layer.compositeLayerOver(topLayer);

                // bottom layer
                context.canvas = await Canvas2dFactory.getNewCanvas(context.data.width, context.data.height);
                await this.#drawBottomLayer(context, i);
                const bottomLayer = await context.canvas.convertToLayer();
                const theBlurGaston = Math.ceil(findValue(context.data.ringArray[i].blurRange.lower, context.data.ringArray[i].blurRange.upper, context.data.ringArray[i].featherTimes, context.numberOfFrames, context.currentFrame));
                await bottomLayer.blur(theBlurGaston);
                await bottomLayer.adjustLayerOpacity(context.data.underLayerOpacity);
                await context.layer.compositeLayerOver(bottomLayer);
            }
        }
    }

    async #processDrawFunction(context) {
        await this.#draw(context, context.drawing);
    }

    async #encircledSpiral(layer, currentFrame, numberOfFrames) {
        const context = {
            currentFrame,
            numberOfFrames,
            drawing: `${this.workingDirectory}encircled-spiral${randomId()}.png`,
            underlayName: `${this.workingDirectory}encircled-spiral-underlay${randomId()}.png`,
            canvas: await Canvas2dFactory.getNewCanvas(this.data.width, this.data.height),
            data: this.data,
            layer,
        };
        await this.#processDrawFunction(context);
    }

    #generate(settings) {
        const data = {
            invertLayers: this.config.invertLayers,
            sequence: this.config.sequence,
            numberOfRings: getRandomIntInclusive(this.config.numberOfRings.lower, this.config.numberOfRings.upper),
            layerOpacity: this.config.layerOpacity,
            underLayerOpacity: this.config.underLayerOpacity,
            height: this.finalSize.height,
            width: this.finalSize.width,
            center: this.config.center,
        };

        const getRingArray = (num) => {
            const info = [];

            for (let i = 0; i < num; i++) {
                info.push({
                    // startAngle: getRandomIntInclusive(this.config.startAngle.lower, this.config.startAngle.upper),
                    startAngle: i, // hard coded, for effect //sparsity factor divided by number of rings - even distribution.
                    speed: getRandomIntInclusive(this.config.speed.lower, this.config.speed.upper),
                    stroke: this.config.stroke,
                    thickness: this.config.thickness,
                    sequence: getRandomFromArray(this.config.minSequenceIndex),
                    minSequenceIndex: getRandomFromArray(this.config.minSequenceIndex),
                    numberOfSequenceElements: getRandomFromArray(this.config.numberOfSequenceElements),
                    sequencePixelConstant: randomNumber(this.config.sequencePixelConstant.lower(this.finalSize), this.config.sequencePixelConstant.upper(this.finalSize)),
                    sparsityFactor: getRandomFromArray(this.config.sparsityFactor),
                    innerColor: this.config.innerColor?.getColor(settings) ?? settings.getNeutralFromBucket(),
                    outerColor: this.config.outerColor?.getColor(settings) ?? settings.getColorFromBucket(),
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

        data.ringArray = getRingArray(data.numberOfRings);

        this.data = data;
    }

    async invoke(layer, currentFrame, numberOfFrames) {
        await this.#encircledSpiral(layer, currentFrame, numberOfFrames);
        await super.invoke(layer, currentFrame, numberOfFrames);
    }

    getInfo() {
        return `${this.name}: ${this.data.numberOfRings} rings`;
    }
}
