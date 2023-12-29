import {LayerEffect} from "../../LayerEffect.js";
import {LayerFactory} from "../../../core/factory/layer/LayerFactory.js";
import {Canvas2dFactory} from "../../../core/factory/canvas/Canvas2dFactory.js";
import {GlobalSettings} from "../../../core/GlobalSettings.js";
import {getRandomFromArray, getRandomIntInclusive, randomId, randomNumber} from "../../../core/math/random.js";
import {findValue} from "../../../core/math/findValue.js";
import fs from "fs";
import {findPointByAngleAndCircle} from "../../../core/math/drawingMath.js";
import {Settings} from "../../../core/Settings.js";

export class EncircledSpiralEffect extends LayerEffect {

    static _name_ = 'encircled-spiral-round-2'

    static _config_  = {
        invertLayers: true,
        layerOpacity: 0.55,
        underLayerOpacity: 0.5,
        startAngle: {lower: 0, upper: 360},
        numberOfRings: {lower: 20, upper: 20},
        stroke: 1,
        thickness: 2,
        sparsityFactor: [60],
        sequencePixelConstant: {
            lower: GlobalSettings.getFinalImageSize().shortestSide * 0.001,
            upper: GlobalSettings.getFinalImageSize().shortestSide * 0.001
        },
        sequence: [0, 1, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89, 144, 233, 377, 610, 987, 1597, 2584, 4181],
        minSequenceIndex: [12],
        numberOfSequenceElements: [3],
        speed: {lower: 2, upper: 2},
        accentRange: {bottom: {lower: 1, upper: 1}, top: {lower: 3, upper: 6}},
        blurRange: {bottom: {lower: 1, upper: 1}, top: {lower: 1, upper: 1}},
        featherTimes: {lower: 2, upper: 4},
    }

    constructor({
                    name = EncircledSpiralEffect._name_,
                    requiresLayer = true,
                    config = EncircledSpiralEffect._config_,
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

        const start = findPointByAngleAndCircle(context.data.center, angle, pointOne)
        const end = findPointByAngleAndCircle(context.data.center, (angle + context.data.ringArray[ringIndex].sparsityFactor * flipTwist), pointTwo);


        await context.canvas.drawLine2d(start, end, thickness, color, 0, color);
    }

    async #drawBottomLayer(context, ringIndex) {
        const theAccentGaston = findValue(context.data.ringArray[ringIndex].accentRange.lower, context.data.ringArray[ringIndex].accentRange.upper, context.data.ringArray[ringIndex].featherTimes, context.numberOfFrames, context.currentFrame);
        for (let sequenceIndex = context.data.ringArray[ringIndex].minSequenceIndex; sequenceIndex < context.data.ringArray[ringIndex].minSequenceIndex + context.data.ringArray[ringIndex].numberOfSequenceElements; sequenceIndex++) {
            for (let i = 0; i < 360; i = i + context.data.ringArray[ringIndex].sparsityFactor) {
                await this.#drawLine(i, context, 1, context.data.ringArray[ringIndex].stroke + context.data.ringArray[ringIndex].thickness + theAccentGaston, context.data.ringArray[ringIndex].outerColor, ringIndex, sequenceIndex);
                await this.#drawLine(i, context, -1, context.data.ringArray[ringIndex].stroke + context.data.ringArray[ringIndex].thickness + theAccentGaston, context.data.ringArray[ringIndex].outerColor, ringIndex, sequenceIndex);

                await this.#drawLine(i, context, 1, context.data.ringArray[ringIndex].stroke, context.data.ringArray[ringIndex].innerColor, ringIndex, sequenceIndex);
                await this.#drawLine(i, context, -1, context.data.ringArray[ringIndex].stroke, context.data.ringArray[ringIndex].innerColor, ringIndex, sequenceIndex);
            }
        }
    }

    async #drawTopLayer(context, ringIndex) {
        for (let sequenceIndex = context.data.ringArray[ringIndex].minSequenceIndex; sequenceIndex < context.data.ringArray[ringIndex].minSequenceIndex + context.data.ringArray[ringIndex].numberOfSequenceElements; sequenceIndex++) {
            for (let i = 0; i < 360; i = i + context.data.ringArray[ringIndex].sparsityFactor) {
                await this.#drawLine(i, context, 1, context.data.ringArray[ringIndex].stroke + context.data.ringArray[ringIndex].thickness, context.data.ringArray[ringIndex].outerColor, ringIndex, sequenceIndex);
                await this.#drawLine(i, context, -1, context.data.ringArray[ringIndex].stroke + context.data.ringArray[ringIndex].thickness, context.data.ringArray[ringIndex].outerColor, ringIndex, sequenceIndex);

                await this.#drawLine(i, context, 1, context.data.ringArray[ringIndex].stroke, context.data.ringArray[ringIndex].innerColor, ringIndex, sequenceIndex);
                await this.#drawLine(i, context, -1, context.data.ringArray[ringIndex].stroke, context.data.ringArray[ringIndex].innerColor, ringIndex, sequenceIndex);
            }
        }
    }

    async #draw(context, filename) {

        for (let i = 0; i < context.data.ringArray.length; i++) {

            if (!context.data.invertLayers) {
                //bottom layer
                context.canvas = await Canvas2dFactory.getNewCanvas(context.data.width, context.data.height);
                await this.#drawBottomLayer(context, i);
                await context.canvas.toFile(filename)
                const bottomLayer = await LayerFactory.getLayerFromFile(context.drawing);
                const theBlurGaston = Math.ceil(findValue(context.data.ringArray[i].blurRange.lower, context.data.ringArray[i].blurRange.upper, context.data.ringArray[i].featherTimes, context.numberOfFrames, context.currentFrame))
                await bottomLayer.blur(theBlurGaston);
                await bottomLayer.adjustLayerOpacity(context.data.underLayerOpacity);
                await context.layer.compositeLayerOver(bottomLayer);

                //top Layer
                context.canvas = await Canvas2dFactory.getNewCanvas(context.data.width, context.data.height);
                await this.#drawTopLayer(context, i);
                await context.canvas.toFile(filename)
                const topLayer = await LayerFactory.getLayerFromFile(context.drawing);
                await topLayer.adjustLayerOpacity(context.data.layerOpacity);
                await context.layer.compositeLayerOver(topLayer);
            } else {

                //top Layer
                context.canvas = await Canvas2dFactory.getNewCanvas(context.data.width, context.data.height);
                await this.#drawTopLayer(context, i);
                await context.canvas.toFile(filename)
                const topLayer = await LayerFactory.getLayerFromFile(context.drawing);
                await topLayer.adjustLayerOpacity(context.data.layerOpacity);
                await context.layer.compositeLayerOver(topLayer);

                //bottom layer
                context.canvas = await Canvas2dFactory.getNewCanvas(context.data.width, context.data.height);
                await this.#drawBottomLayer(context, i);
                await context.canvas.toFile(filename)
                const bottomLayer = await LayerFactory.getLayerFromFile(context.drawing);
                const theBlurGaston = Math.ceil(findValue(context.data.ringArray[i].blurRange.lower, context.data.ringArray[i].blurRange.upper, context.data.ringArray[i].featherTimes, context.numberOfFrames, context.currentFrame))
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
            currentFrame: currentFrame,
            numberOfFrames: numberOfFrames,
            drawing: GlobalSettings.getWorkingDirectory() + 'encircled-spiral' + randomId() + '.png',
            underlayName: GlobalSettings.getWorkingDirectory() + 'encircled-spiral-underlay' + randomId() + '.png',
            canvas: await Canvas2dFactory.getNewCanvas(this.data.width, this.data.height),
            data: this.data,
            layer: layer,
        }

        await this.#processDrawFunction(context);

        fs.unlinkSync(context.drawing);
    }


    #generate(settings) {
        const data = {
            invertLayers: this.config.invertLayers,
            sequence: this.config.sequence,
            numberOfRings: getRandomIntInclusive(this.config.numberOfRings.lower, this.config.numberOfRings.upper),
            layerOpacity: this.config.layerOpacity,
            underLayerOpacity: this.config.underLayerOpacity,
            height: GlobalSettings.getFinalImageSize().height,
            width: GlobalSettings.getFinalImageSize().width,
            center: {x: GlobalSettings.getFinalImageSize().width / 2, y: GlobalSettings.getFinalImageSize().height / 2},
        }

        const getRingArray = (num) => {
            const info = [];

            for (let i = 0; i < num; i++) {
                info.push({
                    //startAngle: getRandomIntInclusive(this.config.startAngle.lower, this.config.startAngle.upper),
                    startAngle: i, //hard coded, for effect //sparsity factor divided by number of rings - even distribution.
                    speed: getRandomIntInclusive(this.config.speed.lower, this.config.speed.upper),
                    stroke: this.config.stroke,
                    thickness: this.config.thickness,
                    sequence: getRandomFromArray(this.config.minSequenceIndex),
                    minSequenceIndex: getRandomFromArray(this.config.minSequenceIndex),
                    numberOfSequenceElements: getRandomFromArray(this.config.numberOfSequenceElements),
                    sequencePixelConstant: randomNumber(this.config.sequencePixelConstant.lower, this.config.sequencePixelConstant.upper),
                    sparsityFactor: getRandomFromArray(this.config.sparsityFactor),
                    innerColor: settings.getNeutralFromBucket(),
                    outerColor: settings.getColorFromBucket(),
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

        data.ringArray = getRingArray(data.numberOfRings);

        this.data = data;
    }

    async invoke(layer, currentFrame, numberOfFrames) {
        await this.#encircledSpiral(layer, currentFrame, numberOfFrames);
        await super.invoke(layer, currentFrame, numberOfFrames);
    }

    getInfo() {
        return `${this.name}: ${this.data.numberOfRings} rings`
    }
}



