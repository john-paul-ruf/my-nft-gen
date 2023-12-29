import {LayerEffect} from "../../LayerEffect.js";
import {GlobalSettings} from "../../../core/GlobalSettings.js";
import {getRandomFromArray, getRandomIntInclusive, randomId} from "../../../core/math/random.js";
import {findValue} from "../../../core/math/findValue.js";
import {findOneWayValue} from "../../../core/math/findOneWayValue.js";
import {findPointByAngleAndCircle} from "../../../core/math/drawingMath.js";
import {LayerFactory} from "../../../core/factory/layer/LayerFactory.js";
import {Canvas2dFactory} from "../../../core/factory/canvas/Canvas2dFactory.js";
import fs from "fs";
import {Settings} from "../../../core/Settings.js";

export class NthRingsEffect extends LayerEffect {

    static _name_ = 'nth-rings';

    static _config_ = {
        invertLayers: true,
        totalRingCount: {lower: 12, upper: 16},
        layerOpacity: 0.5,
        underLayerOpacity: 0.4,
        stroke: 2,
        thickness: 2,
        smallRadius: [GlobalSettings.getFinalImageSize().longestSide * 0.10, GlobalSettings.getFinalImageSize().longestSide * 0.1/*5, finalImageSize.longestSide * 0.2*/],
        smallNumberOfRings: {lower: 8, upper: 12},
        ripple: [GlobalSettings.getFinalImageSize().shortestSide * 0.05, GlobalSettings.getFinalImageSize().shortestSide * 0.10,/* finalImageSize.shortestSide * 0.15, finalImageSize.shortestSide * 0.20*/],
        times: {lower: 2, upper: 4},
        smallerRingsGroupRadius: [GlobalSettings.getFinalImageSize().shortestSide * 0.45, GlobalSettings.getFinalImageSize().shortestSide * 0.50, GlobalSettings.getFinalImageSize().shortestSide * 0.55,],
        accentRange: {bottom: {lower: 1, upper: 1}, top: {lower: 3, upper: 5}},
        blurRange: {bottom: {lower: 1, upper: 1}, top: {lower: 2, upper: 4}},
        featherTimes: {lower: 2, upper: 4},
    }

    constructor({
                    name = NthRingsEffect._name_,
                    requiresLayer = true,
                    config = NthRingsEffect._config_,
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


    async #drawRing(pos, radius, innerColor, outerColor, context) {
        const theGaston = findValue(radius, radius + context.data.ripple, context.data.times, context.numberOfFrames, context.currentFrame);
        await context.canvas.drawRing2d(pos, theGaston, context.data.thickness, innerColor, context.data.stroke + context.theAccentGaston, outerColor)
    }

    async #drawRings(pos, radius, numberOfRings, context) {
        for (let i = 0; i < numberOfRings; i++) {
            await this.#drawRing(pos, radius / numberOfRings * i, context.data.innerColor, context.data.outerColor, context);
        }
    }

    async #draw(context, filename) {

        const angle = (360 / context.data.totalRingCount);

        const theAngleGaston = findOneWayValue(0, angle, context.numberOfFrames, context.currentFrame)

        for (let i = 0; i < 360; i += angle) {
            await this.#drawRings(
                findPointByAngleAndCircle(context.data.center, i + theAngleGaston, context.data.smallerRingsGroupRadius),
                context.data.smallRadius,
                context.data.smallNumberOfRings,
                context,
            );
        }

        await context.canvas.toFile(filename);
    }

    async #drawUnderlay(context, filename) {

        const angle = (360 / context.data.totalRingCount);

        const theAngleGaston = findOneWayValue(0, angle, context.numberOfFrames, context.currentFrame)

        for (let i = 0; i < 360; i += angle) {
            await this.#drawRings(
                findPointByAngleAndCircle(context.data.center, i + theAngleGaston, context.data.smallerRingsGroupRadius),
                context.data.smallRadius,
                context.data.smallNumberOfRings,
                context);
        }

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

        await this.#drawUnderlay(context, context.underlayName);

        context.theAccentGaston = 0;
        context.canvas = await Canvas2dFactory.getNewCanvas(context.data.width, context.data.height);

        await this.#draw(context, context.drawing);
    }

    async #nthRings(layer, currentFrame, numberOfFrames) {
        const context = {
            currentFrame: currentFrame,
            numberOfFrames: numberOfFrames,
            theAccentGaston: findValue(this.data.accentRange.lower, this.data.accentRange.upper, this.data.featherTimes, numberOfFrames, currentFrame),
            theBlurGaston: Math.ceil(findValue(this.data.blurRange.lower, this.data.blurRange.upper, this.data.featherTimes, numberOfFrames, currentFrame)),
            drawing: GlobalSettings.getWorkingDirectory() + 'nth-rings' + randomId() + '.png',
            underlayName: GlobalSettings.getWorkingDirectory() + 'nth-rings-underlay' + randomId() + '.png',
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
            invertLayers: this.config.invertLayers,
            totalRingCount: getRandomIntInclusive(this.config.totalRingCount.lower, this.config.totalRingCount.upper),
            layerOpacity: this.config.layerOpacity,
            underLayerOpacity: this.config.underLayerOpacity,
            height: GlobalSettings.getFinalImageSize().height,
            width: GlobalSettings.getFinalImageSize().width,
            stroke: this.config.stroke,
            thickness: this.config.thickness,
            innerColor: settings.getNeutralFromBucket(),
            outerColor: settings.getColorFromBucket(),
            smallRadius: getRandomFromArray(this.config.smallRadius),
            smallNumberOfRings: getRandomIntInclusive(this.config.smallNumberOfRings.lower, this.config.smallNumberOfRings.upper),
            ripple: getRandomFromArray(this.config.ripple),
            smallerRingsGroupRadius: getRandomFromArray(this.config.smallerRingsGroupRadius),
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
            getInfo: () => {

            }
        }
    }

    async invoke(layer, currentFrame, numberOfFrames) {
        await this.#nthRings(layer, currentFrame, numberOfFrames);
        await super.invoke(layer, currentFrame, numberOfFrames);
    }

    getInfo() {
        return `${this.name}: ${this.data.totalRingCount} ring groups, ripple: ${this.data.ripple.toFixed(2)}`
    }
}




