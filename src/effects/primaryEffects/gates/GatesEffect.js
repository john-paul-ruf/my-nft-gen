import {LayerEffect} from "../../LayerEffect.js";
import {findOneWayValue} from "../../../core/math/findOneWayValue.js";
import {LayerFactory} from "../../../core/factory/layer/LayerFactory.js";
import {Canvas2dFactory} from "../../../core/factory/canvas/Canvas2dFactory.js";
import {GlobalSettings} from "../../../core/GlobalSettings.js";
import {getRandomIntExclusive, getRandomIntInclusive, randomId} from "../../../core/math/random.js";
import {findValue} from "../../../core/math/findValue.js";
import fs from "fs";

export class GatesEffect extends LayerEffect {
    constructor({
                    name = 'gates',
                    requiresLayer = true,
                    config = {
                        layerOpacity: 1,
                        underLayerOpacity: 0.5,
                        gates: {lower: 1, upper: 3},
                        numberOfSides: {lower: 4, upper: 4},
                        thickness: 24,
                        stroke: 0,
                        accentRange: {bottom: {lower: 2, upper: 5}, top: {lower: 10, upper: 15}},
                        blurRange: {bottom: {lower: 1, upper: 2}, top: {lower: 3, upper: 4}},
                        featherTimes: {lower: 2, upper: 4},
                    }
                },
                additionalEffects = [],
                ignoreAdditionalEffects = false) {
        super({name: name, requiresLayer: requiresLayer, config: config}, additionalEffects, ignoreAdditionalEffects);
    }

    async #drawUnderlay(context, filename) {

        //quick fix
        for (let i = 0; i < context.data.numberOfGates; i++) {
            const loopCount = i + 1;
            const direction = loopCount % 2;
            const invert = direction <= 0;
            const theAngleGaston = (findOneWayValue(0, 360 / context.data.numberOfSides, context.numberOfFrames, context.currentFrame, invert) + context.data.gates[i].startingAngle) % 360;
            const theAccentGaston = context.useAccentGaston ? findValue(context.data.gates[i].accentRange.lower, context.data.gates[i].accentRange.upper, context.data.gates[i].featherTimes, context.numberOfFrames, context.currentFrame) : 0;
            await context.canvas.drawPolygon2d(context.data.gates[i].radius, context.data.center, context.data.numberOfSides, theAngleGaston, context.data.thickness, context.data.gates[i].color, context.data.stroke + theAccentGaston, context.data.gates[i].color)
        }

        await context.canvas.toFile(filename);
    }

    async #draw(context, filename) {
        for (let i = 0; i < context.data.numberOfGates; i++) {
            const loopCount = i + 1;
            const direction = loopCount % 2;
            const invert = direction <= 0;
            const theAngleGaston = (findOneWayValue(0, 360 / context.data.numberOfSides, context.numberOfFrames, context.currentFrame, invert) + context.data.gates[i].startingAngle) % 360;
            await context.canvas.drawPolygon2d(context.data.gates[i].radius, context.data.center, context.data.numberOfSides, theAngleGaston, context.data.thickness, context.data.gates[i].innerColor, 0, context.data.gates[i].innerColor)
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

        await this.#drawUnderlay(context, context.underlayName);

        context.useAccentGaston = false;
        context.canvas = await Canvas2dFactory.getNewCanvas(context.data.width, context.data.height);

        await this.#draw(context, context.drawing);
    }

    async #gates(layer, currentFrame, numberOfFrames) {

        const context = {
            currentFrame: currentFrame,
            numberOfFrames: numberOfFrames,
            useAccentGaston: true,
            theBlurGaston: Math.ceil(findValue(this.data.blurRange.lower, this.data.blurRange.upper, this.data.featherTimes, numberOfFrames, currentFrame)),
            drawing: GlobalSettings.getWorkingDirectory() + 'gate' + randomId() + '.png',
            underlayName: GlobalSettings.getWorkingDirectory() + 'gate-underlay' + randomId() + '.png',
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
            underLayerOpacity: this.config.underLayerOpacity,
            numberOfGates: getRandomIntInclusive(this.config.gates.lower, this.config.gates.upper),
            numberOfSides: getRandomIntInclusive(this.config.numberOfSides.lower, this.config.numberOfSides.upper),
            height: GlobalSettings.getFinalImageSize().height,
            width: GlobalSettings.getFinalImageSize().width,
            thickness: this.config.thickness,
            stroke: this.config.stroke,
            center: {x: GlobalSettings.getFinalImageSize().width / 2, y: GlobalSettings.getFinalImageSize().height / 2},
            blurRange: {
                lower: getRandomIntInclusive(this.config.blurRange.bottom.lower, this.config.blurRange.bottom.upper),
                upper: getRandomIntInclusive(this.config.blurRange.top.lower, this.config.blurRange.top.upper)
            },
        };

        const computeInitialInfo = async (num) => {
            const info = [];
            for (let i = 0; i <= num; i++) {
                info.push({
                    radius: getRandomIntExclusive(GlobalSettings.getFinalImageSize().shortestSide * 0.05, GlobalSettings.getFinalImageSize().shortestSide * 0.48),
                    color: settings.getColorFromBucket(),
                    innerColor: settings.getNeutralFromBucket(),
                    accentRange: {
                        lower: getRandomIntInclusive(this.config.accentRange.bottom.lower, this.config.accentRange.bottom.upper),
                        upper: getRandomIntInclusive(this.config.accentRange.top.lower, this.config.accentRange.top.upper)
                    },
                    featherTimes: getRandomIntInclusive(this.config.featherTimes.lower, this.config.featherTimes.upper),
                    startingAngle: 45,
                });
            }
            return info;
        }

        data.gates = await computeInitialInfo(data.numberOfGates);

        this.data = data;
    }

    async invoke(layer, currentFrame, numberOfFrames) {
        await this.#gates(layer, currentFrame, numberOfFrames);
        await super.invoke(layer, currentFrame, numberOfFrames);
    }

    getInfo() {
        return `${this.name}: ${this.data.numberOfGates} gates`
    }
}




