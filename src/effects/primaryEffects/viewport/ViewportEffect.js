import {LayerEffect} from "../../LayerEffect.js";
import {GlobalSettings} from "../../../core/GlobalSettings.js";
import {getRandomFromArray, getRandomIntInclusive, randomId, randomNumber} from "../../../core/math/random.js";
import fs from "fs";
import {findValue} from "../../../core/math/findValue.js";
import {LayerFactory} from "../../../core/factory/layer/LayerFactory.js";
import {Canvas2dFactory} from "../../../core/factory/canvas/Canvas2dFactory.js";

export class ViewportEffect extends LayerEffect {
    constructor({
                    name = 'viewport',
                    requiresLayer = true,
                    config = {
                        invertLayers: true,
                        layerOpacity: 1,
                        underLayerOpacity: 0.8,
                        stroke: 2,
                        thickness: 18,
                        ampStroke: 0,
                        ampThickness: 1,
                        radius: [350],
                        startAngle: [270],
                        ampLength: [/*20, 30, 40,*/ 50, 75, 100],
                        ampRadius: [50, 75, 100],
                        sparsityFactor: [3, 4, 5, 6,],
                        amplitude: {lower: 210, upper: 210},
                        times: {lower: 2, upper: 4},
                        accentRange: {bottom: {lower: 0, upper: 0}, top: {lower: 20, upper: 30}},
                        blurRange: {bottom: {lower: 2, upper: 3}, top: {lower: 5, upper: 8}},
                        featherTimes: {lower: 2, upper: 4},
                    }
                },
                additionalEffects = [],
                ignoreAdditionalEffects = false) {
        super({name: name, requiresLayer: requiresLayer, config: config}, additionalEffects, ignoreAdditionalEffects);
    }

    async #draw(context, filename) {
        const thePolyGaston = findValue(context.data.radius, context.data.radius + context.data.amplitude, context.data.times, context.numberOfFrames, context.currentFrame);
        await context.canvas.drawPolygon2d(thePolyGaston, context.data.center, 3, context.data.startAngle, context.data.thickness, context.data.innerColor, context.data.stroke + context.theAccentGaston, context.data.color)

        await context.canvas.toFile(filename);
    }

    async #compositeImage(context, layer) {
        let tempLayer = await LayerFactory.getLayerFromFile(context.drawing);
        let underlayLayer = await LayerFactory.getLayerFromFile(context.underlayName);

        await underlayLayer.blur(context.theBlurGaston);

        await underlayLayer.adjustLayerOpacity(context.data.underLayerOpacity);
        await tempLayer.adjustLayerOpacity(context.data.layerOpacity);

        if (!context.data.invertLayers) {
            await layer.compositeLayerOver(underlayLayer);
            await layer.compositeLayerOver(tempLayer);
        } else {
            await layer.compositeLayerOver(tempLayer);
            await layer.compositeLayerOver(underlayLayer);
        }

    }

    async #processDrawFunction(context) {

        await this.#draw(context, context.underlayName);

        context.theAccentGaston = 0;
        context.canvas = await Canvas2dFactory.getNewCanvas(context.data.width, context.data.height);

        await this.#draw(context, context.drawing);
    }

    async #viewport(layer, currentFrame, numberOfFrames) {

        const context = {
            currentFrame: currentFrame,
            numberOfFrames: numberOfFrames,
            theAccentGaston: findValue(this.data.accentRange.lower, this.data.accentRange.upper, this.data.featherTimes, numberOfFrames, currentFrame),
            theBlurGaston: Math.ceil(findValue(this.data.blurRange.lower, this.data.blurRange.upper, this.data.featherTimes, numberOfFrames, currentFrame)),
            drawing: GlobalSettings.getWorkingDirectory() + 'viewport' + randomId() + '.png',
            underlayName: GlobalSettings.getWorkingDirectory() + 'viewport-underlay' + randomId() + '.png',
            canvas: await Canvas2dFactory.getNewCanvas(this.data.width, this.data.height),
            data: this.data,
        }

        await this.#processDrawFunction(context);
        await this.#compositeImage(context, layer);

        fs.unlinkSync(context.drawing);
        fs.unlinkSync(context.underlayName);
    }

    async generate(settings) {

        super.generate(settings);

        this.data = {
            invertLayers: this.config.invertLayers,
            layerOpacity: this.config.layerOpacity,
            underLayerOpacity: this.config.underLayerOpacity,
            height: GlobalSettings.getFinalImageSize().height,
            width: GlobalSettings.getFinalImageSize().width,
            stroke: this.config.stroke,
            thickness: this.config.thickness,
            innerColor: settings.getNeutralFromBucket(),
            radius: getRandomFromArray(this.config.radius),
            startAngle: getRandomFromArray(this.config.startAngle),
            ampStroke: this.config.ampStroke,
            ampThickness: this.config.ampThickness,
            ampLength: getRandomFromArray(this.config.ampLength),
            ampRadius: getRandomFromArray(this.config.ampRadius),
            sparsityFactor: getRandomFromArray(this.config.sparsityFactor),
            amplitude: randomNumber(this.config.amplitude.lower, this.config.amplitude.upper),
            times: getRandomIntInclusive(this.config.times.lower, this.config.times.upper),
            color: settings.getColorFromBucket(),
            ampInnerColor: settings.getColorFromBucket(),
            ampOuterColor: settings.getColorFromBucket(),
            featherTimes: getRandomIntInclusive(this.config.featherTimes.lower, this.config.featherTimes.upper),
            accentRange: {
                lower: getRandomIntInclusive(this.config.accentRange.bottom.lower, this.config.accentRange.bottom.upper),
                upper: getRandomIntInclusive(this.config.accentRange.top.lower, this.config.accentRange.top.upper)
            },
            blurRange: {
                lower: getRandomIntInclusive(this.config.blurRange.bottom.lower, this.config.blurRange.bottom.upper),
                upper: getRandomIntInclusive(this.config.blurRange.top.lower, this.config.blurRange.top.upper)
            },
            center: {x: GlobalSettings.getFinalImageSize().width / 2, y: GlobalSettings.getFinalImageSize().height / 2},
        }
    }

    async invoke(layer, currentFrame, numberOfFrames) {
        await this.#viewport(layer, currentFrame, numberOfFrames);
        await super.invoke(layer, currentFrame, numberOfFrames);
    }

    getInfo() {
        return `${this.name}: start angle ${this.data.startAngle}`
    }
}




