import { promises as fs } from 'fs';
import { LayerEffect } from '../../../core/layer/LayerEffect.js';
import { findOneWayValue } from '../../../core/math/findOneWayValue.js';
import { LayerFactory } from '../../../core/factory/layer/LayerFactory.js';
import { Canvas2dFactory } from '../../../core/factory/canvas/Canvas2dFactory.js';
import { getRandomIntExclusive, getRandomIntInclusive, randomId } from '../../../core/math/random.js';
import { findValue } from '../../../core/math/findValue.js';
import { Settings } from '../../../core/Settings.js';
import { GatesConfig } from './GatesConfig.js';

/** *
 *
 * Creates number of polygons with fuzz
 *
 */

export class GatesEffect extends LayerEffect {
    static _name_ = 'gates';

    constructor({
        name = GatesEffect._name_,
        requiresLayer = true,
        config = new GatesConfig({}),
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

    async #drawUnderlay(context, filename) {
    // quick fix
        for (let i = 0; i < context.data.numberOfGates; i++) {
            const loopCount = i + 1;
            const direction = loopCount % 2;
            const invert = direction <= 0;
            const theAngleGaston = (findOneWayValue(0, 360 / context.data.numberOfSides, 1, context.numberOfFrames, context.currentFrame, invert) + context.data.gates[i].startingAngle) % 360;
            const theAccentGaston = context.useAccentGaston ? findValue(context.data.gates[i].accentRange.lower, context.data.gates[i].accentRange.upper, context.data.gates[i].featherTimes, context.numberOfFrames, context.currentFrame) : 0;
            await context.canvas.drawPolygon2d(context.data.gates[i].radius, context.data.center, context.data.numberOfSides, theAngleGaston, context.data.thickness, context.data.gates[i].color, context.data.stroke + theAccentGaston, context.data.gates[i].color);
        }

        await context.canvas.toFile(filename);
    }

    async #draw(context, filename) {
        for (let i = 0; i < context.data.numberOfGates; i++) {
            const loopCount = i + 1;
            const direction = loopCount % 2;
            const invert = direction <= 0;
            const theAngleGaston = (findOneWayValue(0, 360 / context.data.numberOfSides, 1, context.numberOfFrames, context.currentFrame, invert) + context.data.gates[i].startingAngle) % 360;
            await context.canvas.drawPolygon2d(context.data.gates[i].radius, context.data.center, context.data.numberOfSides, theAngleGaston, context.data.thickness, context.data.gates[i].innerColor, 0, context.data.gates[i].innerColor);
        }

        await context.canvas.toFile(filename);
    }

    async #compositeImage(context, layer) {
        const tempLayer = await LayerFactory.getLayerFromFile(context.drawing, this.fileConfig);
        const underlayLayer = await LayerFactory.getLayerFromFile(context.underlayName, this.fileConfig);

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
            currentFrame,
            numberOfFrames,
            useAccentGaston: true,
            theBlurGaston: Math.ceil(findValue(this.data.blurRange.lower, this.data.blurRange.upper, this.data.featherTimes, numberOfFrames, currentFrame)),
            drawing: `${this.workingDirectory}gate${randomId()}.png`,
            underlayName: `${this.workingDirectory}gate-underlay${randomId()}.png`,
            canvas: await Canvas2dFactory.getNewCanvas(this.data.width, this.data.height),
            data: this.data,
        };

        await this.#processDrawFunction(context);
        await this.#compositeImage(context, layer);

        await fs.unlink(context.underlayName);
        await fs.unlink(context.drawing);
    }

    #generate(settings) {
        const data = {
            layerOpacity: this.config.layerOpacity,
            underLayerOpacity: this.config.underLayerOpacity,
            numberOfGates: getRandomIntInclusive(this.config.gates.lower, this.config.gates.upper),
            numberOfSides: getRandomIntInclusive(this.config.numberOfSides.lower, this.config.numberOfSides.upper),
            height: this.finalSize.height,
            width: this.finalSize.width,
            thickness: this.config.thickness,
            stroke: this.config.stroke,
            center: this.config.center,
            blurRange: {
                lower: getRandomIntInclusive(this.config.blurRange.bottom.lower, this.config.blurRange.bottom.upper),
                upper: getRandomIntInclusive(this.config.blurRange.top.lower, this.config.blurRange.top.upper),
            },
        };

        const computeInitialInfo = (num) => {
            const info = [];
            for (let i = 0; i <= num; i++) {
                info.push({
                    radius: getRandomIntExclusive(this.finalSize.shortestSide * 0.05, this.finalSize.shortestSide * 0.48),
                    innerColor: this.config.innerColor.getColor(settings),
                    color: this.config.outerColor.getColor(settings),
                    accentRange: {
                        lower: getRandomIntInclusive(this.config.accentRange.bottom.lower, this.config.accentRange.bottom.upper),
                        upper: getRandomIntInclusive(this.config.accentRange.top.lower, this.config.accentRange.top.upper),
                    },
                    featherTimes: getRandomIntInclusive(this.config.featherTimes.lower, this.config.featherTimes.upper),
                    startingAngle: 45,
                });
            }
            return info;
        };

        data.gates = computeInitialInfo(data.numberOfGates);

        this.data = data;
    }

    async invoke(layer, currentFrame, numberOfFrames) {
        await this.#gates(layer, currentFrame, numberOfFrames);
        await super.invoke(layer, currentFrame, numberOfFrames);
    }

    getInfo() {
        return `${this.name}: ${this.data.numberOfGates} gates`;
    }
}
