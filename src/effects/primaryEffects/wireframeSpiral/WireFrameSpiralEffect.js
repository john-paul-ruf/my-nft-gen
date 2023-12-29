import {LayerEffect} from "../../LayerEffect.js";
import {GlobalSettings} from "../../../core/GlobalSettings.js";
import {getRandomFromArray, getRandomIntInclusive, randomId, randomNumber} from "../../../core/math/random.js";
import fs from "fs";
import {findPointByAngleAndCircle} from "../../../core/math/drawingMath.js";
import {LayerFactory} from "../../../core/factory/layer/LayerFactory.js";
import {Canvas2dFactory} from "../../../core/factory/canvas/Canvas2dFactory.js";
import {findValue} from "../../../core/math/findValue.js";

export class WireFrameSpiralEffect extends LayerEffect {
    constructor({
                    name = 'wireframe-spiral',
                    requiresLayer = true,
                    config = {
                        layerOpacity: 0.4,
                        underLayerOpacityRange: {bottom: {lower: 0.3, upper: 0.35}, top: {lower: 0.4, upper: 0.45}},
                        underLayerOpacityTimes: {lower: 1, upper: 6},
                        startTwistCount: {lower: 1, upper: 2},
                        stroke: [0],
                        thickness: [1, 2, 3],
                        sparsityFactor: [30, 36, 40, 45, 60],
                        speed: {lower: 4, upper: 8},
                        counterClockwise: {lower: 0, upper: 1},
                        unitLength: {lower: 2, upper: 6},
                        unitLengthChangeConstant: [2, 4, 8],
                        radiusConstant: [50, 75, 150],
                        accentRange: {bottom: {lower: 0, upper: 1}, top: {lower: 0, upper: 0}},
                        blurRange: {bottom: {lower: 0, upper: 0}, top: {lower: 0, upper: 0}},
                        featherTimes: {lower: 0, upper: 0},
                    }},
                additionalEffects = [],
                ignoreAdditionalEffects = false) {
        super({name: name, requiresLayer: requiresLayer, config: config}, additionalEffects, ignoreAdditionalEffects);
    }

    async #drawLine(angle, loopControl, context, flipTwist, thickness, color){
        angle = angle + (((context.data.sparsityFactor * context.data.speed) / context.numberOfFrames) * context.currentFrame) * context.data.direction;

        const start = findPointByAngleAndCircle(context.data.center, angle, loopControl.n2 + context.data.radiusConstant)
        const end = findPointByAngleAndCircle(context.data.center, angle + (loopControl.twistCount * flipTwist * context.data.sparsityFactor), loopControl.nextTerm + context.data.radiusConstant);

        await context.canvas.drawLine2d(start, end, thickness, color, thickness, color);
    }

    async #spiral(context, thickness, color) {

        const unitLength = context.data.unitLength + context.theUnitLengthGaston;

        const loopControl = {
            twistCount: context.data.startTwistCount,
            n1: unitLength,
            n2: unitLength,
            nextTerm: unitLength + unitLength
        }

        while (loopControl.nextTerm <= context.data.drawHeight) {

            for (let i = 0; i < 360; i = i + context.data.sparsityFactor) {
                await this.#drawLine(i, loopControl, context, 1, thickness, color)
                await this.#drawLine(i, loopControl, context, -1, thickness, color)
            }

            //assignment for next loop
            loopControl.twistCount++;
            loopControl.n1 = loopControl.n2;
            loopControl.n2 = loopControl.nextTerm;
            loopControl.nextTerm = loopControl.n1 + loopControl.n2;
        }
    }

    async #drawUnderlay(context, filename){
        await this.#spiral(context, context.data.thickness + context.data.stroke + context.theAccentGaston, context.data.outerColor);
        await context.canvas.toFile(filename)
    }

    async #draw(context, filename){
        await this.#spiral(context, context.data.thickness, context.data.innerColor);
        await context.canvas.toFile(filename)
    }


    async #compositeImage(context, layer) {
        let tempLayer = await LayerFactory.getLayerFromFile(context.drawing);
        let underlayLayer = await LayerFactory.getLayerFromFile(context.underlayName);

        await underlayLayer.blur(context.theBlurGaston);
        await underlayLayer.adjustLayerOpacity(context.theUnderLayerOpacityGaston);

        await tempLayer.adjustLayerOpacity(context.data.layerOpacity);

        await layer.compositeLayerOver(underlayLayer);
        await layer.compositeLayerOver(tempLayer);

    }

    async #processDrawFunction(context){

        await this.#drawUnderlay(context, context.underlayName);

        context.theAccentGaston = 0;
        context.canvas = await Canvas2dFactory.getNewCanvas(context.data.width, context.data.height);

        await this.#draw(context, context.drawing);
    }

    async #wireframeSpiral(layer, currentFrame, numberOfFrames) {

        const context = {
            currentFrame: currentFrame,
            numberOfFrames: numberOfFrames,
            theAccentGaston: findValue(this.data.accentRange.lower, this.data.accentRange.upper, this.data.featherTimes, numberOfFrames, currentFrame),
            theBlurGaston: Math.ceil(findValue(this.data.blurRange.lower, this.data.blurRange.upper, this.data.featherTimes, numberOfFrames, currentFrame)),
            theUnitLengthGaston: findValue(0, this.data.unitLengthChangeConstant, 1, numberOfFrames, currentFrame),
            theUnderLayerOpacityGaston: findValue(this.data.underLayerOpacityRange.lower, this.data.underLayerOpacityRange.upper, this.data.underLayerOpacityTimes, numberOfFrames, currentFrame),
            drawing: GlobalSettings.getWorkingDirectory() + 'wireframe-spiral' + randomId() + '.png',
            underlayName: GlobalSettings.getWorkingDirectory() + 'wireframe-spiral-underlay' + randomId() + '.png',
            canvas: await Canvas2dFactory.getNewCanvas(this.data.width, this.data.height),
            data: this.data,
        }

        await this.#processDrawFunction(context);
        await this.#compositeImage(context, layer);

        fs.unlinkSync(context.underlayName);
        fs.unlinkSync(context.drawing);
    }

    async generate(settings) {

        super.generate(settings);

        const data = {
            layerOpacity: this.config.layerOpacity,
            underLayerOpacityRange: {
                lower: randomNumber(this.config.underLayerOpacityRange.bottom.lower, this.config.underLayerOpacityRange.bottom.upper),
                upper: randomNumber(this.config.underLayerOpacityRange.top.lower, this.config.underLayerOpacityRange.top.upper)
            },
            underLayerOpacityTimes: getRandomIntInclusive(this.config.underLayerOpacityTimes.lower, this.config.underLayerOpacityTimes.upper),
            startTwistCount: getRandomIntInclusive(this.config.startTwistCount.lower, this.config.startTwistCount.upper),
            drawHeight: GlobalSettings.getFinalImageSize().height * 4,
            height: GlobalSettings.getFinalImageSize().height * 2,
            width: GlobalSettings.getFinalImageSize().width * 2,
            stroke: getRandomFromArray(this.config.stroke),
            thickness: getRandomFromArray(this.config.thickness),
            unitLength: getRandomIntInclusive(this.config.unitLength.lower, this.config.unitLength.upper),
            unitLengthChangeConstant: getRandomFromArray(this.config.unitLengthChangeConstant),
            sparsityFactor: getRandomFromArray(this.config.sparsityFactor),
            innerColor: await settings.getColorFromBucket(),
            outerColor: await settings.getColorFromBucket(),
            center: {x: GlobalSettings.getFinalImageSize().width * 2 / 2, y: GlobalSettings.getFinalImageSize().height * 2 / 2},
            speed: getRandomIntInclusive(this.config.speed.lower, this.config.speed.upper),
            counterClockwise: getRandomIntInclusive(this.config.counterClockwise.lower, this.config.counterClockwise.upper),
            radiusConstant: getRandomFromArray(this.config.radiusConstant),
            accentRange: {
                lower: getRandomIntInclusive(this.config.accentRange.bottom.lower, this.config.accentRange.bottom.upper),
                upper: getRandomIntInclusive(this.config.accentRange.top.lower, this.config.accentRange.top.upper)
            },
            blurRange: {
                lower: getRandomIntInclusive(this.config.blurRange.bottom.lower, this.config.blurRange.bottom.upper),
                upper: getRandomIntInclusive(this.config.blurRange.top.lower, this.config.blurRange.top.upper)
            },
            featherTimes: getRandomIntInclusive(this.config.featherTimes.lower, this.config.featherTimes.upper),
        }

        data.direction = data.counterClockwise ? -1 : 1;

        this.data = data;
    }

    async invoke(layer, currentFrame, numberOfFrames) {
        await this.#wireframeSpiral(layer, currentFrame, numberOfFrames);
        await super.invoke(layer, currentFrame, numberOfFrames);
    }

    getInfo() {
        return `${this.name}: sparsity: ${this.data.sparsityFactor.toFixed(3)}, unit: ${this.data.unitLength}, speed: ${this.data.speed}, direction: ${this.data.counterClockwise > 0 ? 'clockwise' : 'counter'}`
    }
}




