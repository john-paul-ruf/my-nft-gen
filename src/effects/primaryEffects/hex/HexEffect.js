import {LayerEffect} from "../../LayerEffect.js";
import {findOneWayValue} from "../../../core/math/findOneWayValue.js";
import {LayerFactory} from "../../../core/factory/layer/LayerFactory.js";
import {Canvas2dFactory} from "../../../core/factory/canvas/Canvas2dFactory.js";
import {GlobalSettings} from "../../../core/GlobalSettings.js";
import {
    getRandomFromArray,
    getRandomIntExclusive,
    getRandomIntInclusive,
    randomId,
    randomNumber
} from "../../../core/math/random.js";
import {findValue} from "../../../core/math/findValue.js";
import fs from "fs";
import {findPointByAngleAndCircle} from "../../../core/math/drawingMath.js";

export class HexEffect extends LayerEffect {
    constructor({
                    name = 'hex',
                    requiresLayer = true,
                    config = {
                        layerOpacity: 1,
                        underLayerOpacity: 0.8,
                        sparsityFactor: [12, 15, 18,/* 20, 24, 30, 36*/],
                        gapFactor: {lower: 3, upper: 6},
                        radiusFactor: {lower: 1, upper: 3},
                        accentRange: {bottom: {lower: 0, upper: 0}, top: {lower: 0.75, upper: 1.5}},
                        blurRange: {bottom: {lower: 0, upper: 1}, top: {lower: 2, upper: 3}},
                        featherTimes: {lower: 2, upper: 4},
                        stroke: 1,
                        thickness: 0.5,
                        scaleFactor: 0.5,
                        numberOfHex: 12,
                        strategy: ['static', 'angle', 'rotate'],
                        overlayStrategy: ['flat', 'overlay'],
                    }},
                additionalEffects = [],
                ignoreAdditionalEffects = false) {
        super({name: name, requiresLayer: requiresLayer, config: config}, additionalEffects, ignoreAdditionalEffects);
    }

    async #drawHexLine(angle, index, context) {

        const finalImageSize = GlobalSettings.getFinalImageSize();

        const loopCount = index + 1;
        const direction = loopCount % 2;
        const invert = direction <= 0;

        const theAngleGaston = findOneWayValue(angle + 30, angle + 30 + context.data.sparsityFactor, context.numberOfFrames, context.currentFrame, invert);
        const theRotateGaston = findOneWayValue(theAngleGaston, theAngleGaston + 360, context.numberOfFrames, context.currentFrame, invert)

        const scaleBy = (context.data.scaleFactor * loopCount);
        const radius = context.data.radiusFactor * scaleBy;
        const gapRadius = ((finalImageSize.height * .05) + radius + (context.data.gapFactor * scaleBy) * loopCount)
        const pos = findPointByAngleAndCircle(context.data.center, theAngleGaston, gapRadius)

        switch (context.data.strategy) {
            case 'rotate':
                await context.canvas.drawPolygon2d(radius, pos, 6, theRotateGaston, context.data.thickness * scaleBy, context.data.innerColor, (context.data.stroke + context.accentBoost) * scaleBy, context.data.color)
                break;
            case 'angle':
                await context.canvas.drawPolygon2d(radius, pos, 6, theAngleGaston, context.data.thickness * scaleBy, context.data.innerColor, (context.data.stroke + context.accentBoost) * scaleBy, context.data.color)
                break;
            case 'static':
                await context.canvas.drawPolygon2d(radius, pos, 6, 30, context.data.thickness * scaleBy, context.data.innerColor, (context.data.stroke + context.accentBoost) * scaleBy, context.data.color)
                break;
        }
    }

    async #drawHexLineOuter(angle, index, context) {

        const finalImageSize = GlobalSettings.getFinalImageSize();

        const loopCount = index + 1;
        const direction = loopCount % 2;
        const invert = direction <= 0;

        const theAngleGaston = findOneWayValue(angle + 30, angle + 30 + context.data.sparsityFactor, context.numberOfFrames, context.currentFrame, invert);
        const theRotateGaston = findOneWayValue(theAngleGaston, theAngleGaston + 360, context.numberOfFrames, context.currentFrame, invert)

        const scaleBy = (context.data.scaleFactor * loopCount);
        const radius = context.data.radiusFactor * scaleBy;
        const gapRadius = ((finalImageSize.height * .05) + radius + (context.data.gapFactor * scaleBy) * loopCount)
        const pos = findPointByAngleAndCircle(context.data.center, theAngleGaston, gapRadius)

        switch (context.data.strategy) {
            case 'rotate':
                await context.canvas.drawPolygon2d(radius, pos, 6, theRotateGaston, context.data.thickness * scaleBy, context.data.color, (context.data.stroke + context.accentBoost) * scaleBy, context.data.color)
                break;
            case 'angle':
                await context.canvas.drawPolygon2d(radius, pos, 6, theAngleGaston, context.data.thickness * scaleBy, context.data.color, (context.data.stroke + context.accentBoost) * scaleBy, context.data.color)
                break;
            case 'static':
                await context.canvas.drawPolygon2d(radius, pos, 6, 30, context.data.thickness * scaleBy, context.data.color, (context.data.stroke + context.accentBoost) * scaleBy, context.data.color)
                break;
        }
    }

    async #drawHexLineInner(angle, index, context) {

        const finalImageSize = GlobalSettings.getFinalImageSize();

        const loopCount = index + 1;
        const direction = loopCount % 2;
        const invert = direction <= 0;

        const theAngleGaston = findOneWayValue(angle + 30, angle + 30 + context.data.sparsityFactor, context.numberOfFrames, context.currentFrame, invert);
        const theRotateGaston = findOneWayValue(theAngleGaston, theAngleGaston + 360, context.numberOfFrames, context.currentFrame, invert)

        const scaleBy = (context.data.scaleFactor * loopCount);
        const radius = context.data.radiusFactor * scaleBy;
        const gapRadius = ((finalImageSize.height * .05) + radius + (context.data.gapFactor * scaleBy) * loopCount)
        const pos = findPointByAngleAndCircle(context.data.center, theAngleGaston, gapRadius)

        switch (context.data.strategy) {
            case 'rotate':
                await context.canvas.drawPolygon2d(radius, pos, 6, theRotateGaston, context.data.thickness * scaleBy, context.data.innerColor, 0, context.data.innerColor)
                break;
            case 'angle':
                await context.canvas.drawPolygon2d(radius, pos, 6, theAngleGaston, context.data.thickness * scaleBy, context.data.innerColor, 0, context.data.innerColor)
                break;
            case 'static':
                await context.canvas.drawPolygon2d(radius, pos, 6, 30, context.data.thickness * scaleBy, context.data.innerColor, 0, context.data.innerColor)
                break;
        }
    }


    async #draw(context, filename) {
        context.accentBoost = context.theAccentGaston;

        switch (context.data.overlayStrategy) {
            case 'overlay':
                for (let i = 0; i < context.data.numberOfHex; i++) {
                    for (let a = 0; a < 360; a = a + context.data.sparsityFactor) {
                        await this.#drawHexLine(a, i, context)
                    }
                }
                break;
            case 'flat':
                for (let i = 0; i < context.data.numberOfHex; i++) {
                    for (let a = 0; a < 360; a = a + context.data.sparsityFactor) {
                        await this.#drawHexLineOuter(a, i, context)
                    }
                }

                for (let i = 0; i < context.data.numberOfHex; i++) {
                    for (let a = 0; a < 360; a = a + context.data.sparsityFactor) {
                        await this.#drawHexLineInner(a, i, context)
                    }
                }
                break;
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

    async #hex(layer, currentFrame, numberOfFrames) {

        const context = {
            currentFrame: currentFrame,
            numberOfFrames: numberOfFrames,
            theAccentGaston: findValue(this.data.accentRange.lower, this.data.accentRange.upper, this.data.featherTimes, numberOfFrames, currentFrame),
            theBlurGaston: Math.ceil(findValue(this.data.blurRange.lower, this.data.blurRange.upper, this.data.featherTimes, numberOfFrames, currentFrame)),
            drawing: GlobalSettings.getWorkingDirectory() + 'hex' + randomId() + '.png',
            underlayName: GlobalSettings.getWorkingDirectory() + 'hex-under' + randomId() + '.png',
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
            numberOfHex: this.config.numberOfHex,
            strategy: this.config.strategy[getRandomIntExclusive(0, this.config.strategy.length)],
            overlayStrategy: this.config.overlayStrategy[getRandomIntExclusive(0, this.config.overlayStrategy.length)],
            layerOpacity: this.config.layerOpacity,
            underLayerOpacity: this.config.underLayerOpacity,
            height: GlobalSettings.getFinalImageSize().height,
            width: GlobalSettings.getFinalImageSize().width,
            stroke: this.config.stroke,
            thickness: this.config.thickness,
            innerColor: settings.getNeutralFromBucket(),
            color: settings.getColorFromBucket(),
            scaleFactor: this.config.scaleFactor,
            sparsityFactor: getRandomFromArray(this.config.sparsityFactor),
            gapFactor: getRandomIntInclusive(this.config.gapFactor.lower, this.config.gapFactor.upper),
            radiusFactor: getRandomIntInclusive(this.config.radiusFactor.lower, this.config.radiusFactor.upper),
            accentRange: {
                lower: randomNumber(this.config.accentRange.bottom.lower, this.config.accentRange.bottom.upper),
                upper: randomNumber(this.config.accentRange.top.lower, this.config.accentRange.top.upper)
            },
            blurRange: {
                lower: getRandomIntInclusive(this.config.blurRange.bottom.lower, this.config.blurRange.bottom.upper),
                upper: getRandomIntInclusive(this.config.blurRange.top.lower, this.config.blurRange.top.upper)
            },
            featherTimes: getRandomIntInclusive(this.config.featherTimes.lower, this.config.featherTimes.upper),
            center: {x: GlobalSettings.getFinalImageSize().width / 2, y: GlobalSettings.getFinalImageSize().height / 2},
        }
    }

    async invoke(layer, currentFrame, numberOfFrames) {
        await this.#hex(layer, currentFrame, numberOfFrames);
        await super.invoke(layer, currentFrame, numberOfFrames);
    }

    getInfo() {
        return `${this.name}: strategy: ${this.data.strategy} - ${this.data.overlayStrategy}, sparsity: ${this.data.sparsityFactor}, gap: ${this.data.gapFactor}, radius: ${this.data.radiusFactor}`
    }
}




