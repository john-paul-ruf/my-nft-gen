import {LayerEffect} from "../../LayerEffect.js";

import {getRandomFromArray, getRandomIntInclusive, randomId, randomNumber} from "../../../core/math/random.js";
import fs from "fs";
import {findOneWayValue} from "../../../core/math/findOneWayValue.js";
import {findValue} from "../../../core/math/findValue.js";
import {findPointByAngleAndCircle} from "../../../core/math/drawingMath.js";
import {Canvas2dFactory} from "../../../core/factory/canvas/Canvas2dFactory.js";
import {LayerFactory} from "../../../core/factory/layer/LayerFactory.js";
import {Settings} from "../../../core/Settings.js";

export class ScopesEffect extends LayerEffect {

    static _name_ = 'scopes';

    static _config_  = {
        layerOpacity: 1,
        sparsityFactor: [4, 5, 6, 8, 9, 10],
        gapFactor: {lower: 0.2, upper: 0.4},
        radiusFactor: {lower: 0.1, upper: 0.2},
        scaleFactor: 1.2,
        alphaRange: {bottom: {lower: 0.3, upper: 0.5}, top: {lower: 0.8, upper: 1}},
        alphaTimes: {lower: 2, upper: 8},
        rotationTimes: {lower: 0, upper: 0},
        numberOfScopesInALine: 40,
    }

    constructor({
                    name = ScopesEffect._name_,
                    requiresLayer = true,
                    config = ScopesEffect._config_,
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


    async #drawHexLine(angle, index, color, alphaRange, alphaTimes, rotationTimes, context) {
        const loopCount = index + 1;
        const direction = loopCount % 2;
        const invert = direction <= 0;

        const theRotateGaston = findOneWayValue(angle, angle + (360 * rotationTimes), context.numberOfFrames, context.currentFrame, invert);
        const theAlphaGaston = findValue(alphaRange.lower, alphaRange.upper, alphaTimes, context.numberOfFrames, context.currentFrame);

        const scaleBy = (context.data.scaleFactor * loopCount);
        const radius = context.data.radiusFactor * scaleBy;
        const gapRadius = ((this.finalSize.height * .05) + radius + (context.data.gapFactor * scaleBy) * loopCount)
        const pos = findPointByAngleAndCircle(context.data.center, angle, gapRadius)

        await context.canvas.drawFilledPolygon2d(radius, pos, 6, theRotateGaston, color, theAlphaGaston)
    }

    async #draw(context, filename) {
        for (let s = 0; s < context.data.scopes.length; s++) {
            await this.#drawHexLine(context.data.scopes[s].angle, context.data.scopes[s].loopCount, context.data.scopes[s].color, context.data.scopes[s].alphaRange, context.data.scopes[s].alphaTimes, context.data.scopes[s].rotationTimes, context)
        }
        await context.canvas.toFile(filename);
    }

    async #scopes(layer, currentFrame, numberOfFrames) {
        const context = {
            currentFrame: currentFrame,
            numberOfFrames: numberOfFrames,
            drawing: this.workingDirectory + 'scopes' + randomId() + '.png',
            canvas: await Canvas2dFactory.getNewCanvas(this.data.width, this.data.height),
            data: this.data
        }

        await this.#draw(context, context.drawing);

        let tempLayer = await LayerFactory.getLayerFromFile(context.drawing, this.fileConfig);

        await tempLayer.adjustLayerOpacity(context.data.layerOpacity);

        await layer.compositeLayerOver(tempLayer)

        fs.unlinkSync(context.drawing);
    }

    #generate(settings) {
        const data = {
            layerOpacity: this.config.layerOpacity,
            height: this.finalSize.height,
            width: this.finalSize.width,
            sparsityFactor: getRandomFromArray(this.config.sparsityFactor),
            gapFactor: randomNumber(this.config.gapFactor.lower, this.config.gapFactor.upper),
            radiusFactor: randomNumber(this.config.radiusFactor.lower, this.config.radiusFactor.upper),
            scaleFactor: this.config.scaleFactor,
            center: {x: this.finalSize.width / 2, y: this.finalSize.height / 2},
        }

        const getHexLine = (sparsityFactor, info, i) => {
            for (let a = 0; a < 360; a = a + sparsityFactor) {
                info.push({
                    loopCount: i + 1,
                    angle: a,
                    alphaRange: {
                        lower: randomNumber(this.config.alphaRange.bottom.lower, this.config.alphaRange.bottom.upper),
                        upper: randomNumber(this.config.alphaRange.top.lower, this.config.alphaRange.top.upper)
                    },
                    alphaTimes: getRandomIntInclusive(this.config.alphaTimes.lower, this.config.alphaTimes.upper),
                    rotationTimes: getRandomIntInclusive(this.config.rotationTimes.lower, this.config.rotationTimes.upper),
                    color: settings.getColorFromBucket(),
                });
            }
        }

        const computeInitialInfo = (sparsityFactor) => {
            const info = [];
            for (let i = 0; i < this.config.numberOfScopesInALine; i++) {
                getHexLine(sparsityFactor, info, i);
            }
            return info;
        }

        data.scopes = computeInitialInfo(data.sparsityFactor);

        this.data = data;
    }

    async invoke(layer, currentFrame, numberOfFrames) {
        await this.#scopes(layer, currentFrame, numberOfFrames);
        await super.invoke(layer, currentFrame, numberOfFrames);
    }

    getInfo() {
        return `${this.name}: sparsityFactor: ${this.data.sparsityFactor.toFixed(3)}, gapFactor: ${this.data.gapFactor.toFixed(3)}, radiusFactor: ${this.data.radiusFactor.toFixed(3)}`
    }
}




