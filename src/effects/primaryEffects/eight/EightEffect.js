import {LayerEffect} from "../../LayerEffect.js";
import {findOneWayValue} from "../../../core/math/findOneWayValue.js";
import {LayerFactory} from "../../../core/factory/layer/LayerFactory.js";
import {Canvas2dFactory} from "../../../core/factory/canvas/Canvas2dFactory.js";
import {GlobalSettings} from "../../../core/GlobalSettings.js";
import {getRandomIntInclusive, randomId} from "../../../core/math/random.js";
import {findValue} from "../../../core/math/findValue.js";
import fs from "fs";
import {findPointByAngleAndCircle} from "../../../core/math/drawingMath.js";
import {Settings} from "../../../core/Settings.js";

export class EightEffect extends LayerEffect {

    static _name_ = 'eight'

    constructor({
                    name = EightEffect._name_,
                    requiresLayer = true,
                    config = {
                        layerOpacity: 1,
                        underLayerOpacity: 0.3,
                        stroke: 1,
                        thickness: 4,
                        smallRadius: {
                            lower: GlobalSettings.getFinalImageSize().longestSide * 0.10,
                            upper: GlobalSettings.getFinalImageSize().longestSide * 0.15
                        },
                        smallNumberOfRings: {lower: 12, upper: 16},
                        ripple: {
                            lower: GlobalSettings.getFinalImageSize().shortestSide * 0.05,
                            upper: GlobalSettings.getFinalImageSize().shortestSide * 0.10
                        },
                        times: {lower: 2, upper: 4},
                        smallerRingsGroupRadius: {
                            lower: GlobalSettings.getFinalImageSize().shortestSide * 0.25,
                            upper: GlobalSettings.getFinalImageSize().shortestSide * 0.30
                        },
                        accentRange: {bottom: {lower: 0, upper: 0}, top: {lower: 4, upper: 8}},
                        blurRange: {bottom: {lower: 0, upper: 0}, top: {lower: 1, upper: 1}},
                        featherTimes: {lower: 2, upper: 4},
                    }
                },
                additionalEffects = [],
                ignoreAdditionalEffects = false,
                settings = new Settings({})) {
        super({name: name, requiresLayer: requiresLayer, config: config}, additionalEffects, ignoreAdditionalEffects, settings);
        this.#generate(settings)
    }


    async #drawRing(pos, radius, innerStroke, innerColor, outerStroke, outerColor, context) {
        const theGaston = findValue(radius, radius + context.data.ripple, context.data.times, context.numberOfFrames, context.currentFrame);
        await context.canvas.drawRing2d(pos, theGaston, innerStroke, innerColor, outerStroke + context.theAccentGaston, outerColor)
    }

    async #drawRings(pos, color, radius, numberOfRings, context, weight) {
        for (let i = 0; i < numberOfRings; i++) {
            await this.#drawRing(pos, radius / numberOfRings * i, weight, color, 0, color, context);
        }
    }

    async #draw(context, filename) {
        for (let i = 0; i < 360; i += 45) {
            await this.#drawRings(findPointByAngleAndCircle(context.data.center, i + context.theAngleGaston, context.data.smallerRingsGroupRadius), context.data.outerColor, context.data.smallRadius, context.data.smallNumberOfRings, context, context.data.thickness + context.data.stroke);
        }

        for (let i = 0; i < 360; i += 45) {
            await this.#drawRings(findPointByAngleAndCircle(context.data.center, i + context.theAngleGaston, context.data.smallerRingsGroupRadius), context.data.innerColor, context.data.smallRadius, context.data.smallNumberOfRings, context, context.data.thickness);
        }

        await context.canvas.toFile(filename);
    }

    async #compositeImage(context, layer) {
        let tempLayer = await LayerFactory.getLayerFromFile(context.drawing);
        let underlayLayer = await LayerFactory.getLayerFromFile(context.underlayName);

        await underlayLayer.blur(context.theBlurGaston);

        await underlayLayer.adjustLayerOpacity(context.data.underLayerOpacity);
        await tempLayer.adjustLayerOpacity(context.data.layerOpacity);

        await layer.compositeLayerOver(underlayLayer);
        await layer.compositeLayerOver(tempLayer);

    }

    async #processDrawFunction(context) {

        await this.#draw(context, context.underlayName);

        context.theAccentGaston = 0;
        context.canvas = await Canvas2dFactory.getNewCanvas(context.data.width, context.data.height);

        await this.#draw(context, context.drawing);
    }

    async #eight(layer, currentFrame, numberOfFrames) {
        const context = {
            currentFrame: currentFrame,
            numberOfFrames: numberOfFrames,
            theAccentGaston: findValue(this.data.accentRange.lower, this.data.accentRange.upper, this.data.featherTimes, numberOfFrames, currentFrame),
            theBlurGaston: Math.ceil(findValue(this.data.blurRange.lower, this.data.blurRange.upper, this.data.featherTimes, numberOfFrames, currentFrame)),
            theAngleGaston: findOneWayValue(0, 45, numberOfFrames, currentFrame),
            drawing: GlobalSettings.getWorkingDirectory() + 'eight' + randomId() + '.png',
            underlayName: GlobalSettings.getWorkingDirectory() + 'eight-underlay' + randomId() + '.png',
            canvas: await Canvas2dFactory.getNewCanvas(this.data.width, this.data.height),
            data: this.data,
        }

        await this.#processDrawFunction(context);
        await this.#compositeImage(context, layer);

        fs.unlinkSync(context.drawing);
        fs.unlinkSync(context.underlayName);
    }

    #generate(settings) {
        this.data = {
            layerOpacity: this.config.layerOpacity,
            underLayerOpacity: this.config.underLayerOpacity,
            height: GlobalSettings.getFinalImageSize().height,
            width: GlobalSettings.getFinalImageSize().width,
            stroke: this.config.stroke,
            thickness: this.config.thickness,
            innerColor: settings.getNeutralFromBucket(),
            outerColor: settings.getColorFromBucket(),
            smallRadius: getRandomIntInclusive(this.config.smallRadius.lower, this.config.smallRadius.upper),
            smallNumberOfRings: getRandomIntInclusive(this.config.smallNumberOfRings.lower, this.config.smallNumberOfRings.upper),
            ripple: getRandomIntInclusive(this.config.ripple.lower, this.config.ripple.upper),
            smallerRingsGroupRadius: getRandomIntInclusive(this.config.smallerRingsGroupRadius.lower, this.config.smallerRingsGroupRadius.upper),
            times: getRandomIntInclusive(this.config.times.lower, this.config.times.upper),
            center: {x: GlobalSettings.getFinalImageSize().width / 2, y: GlobalSettings.getFinalImageSize().height / 2},
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
    }

    async invoke(layer, currentFrame, numberOfFrames) {
        await this.#eight(layer, currentFrame, numberOfFrames);
        await super.invoke(layer, currentFrame, numberOfFrames);
    }

    getInfo() {
        return `${this.name}: ripple: ${this.data.ripple.toFixed(3)}`
    }
}




