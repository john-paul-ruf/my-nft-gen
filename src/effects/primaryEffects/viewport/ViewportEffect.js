import {promises as fs} from 'fs';
import {LayerEffect} from '../../../core/layer/LayerEffect.js';
import {
    getRandomFromArray, getRandomIntInclusive, randomId, randomNumber,
} from '../../../core/math/random.js';
import {findValue} from '../../../core/math/findValue.js';
import {LayerFactory} from '../../../core/factory/layer/LayerFactory.js';
import {Canvas2dFactory} from '../../../core/factory/canvas/Canvas2dFactory.js';
import {Settings} from '../../../core/Settings.js';
import {ViewportConfig} from './ViewportConfig.js';

export class ViewportEffect extends LayerEffect {
    static _name_ = 'viewport';

    constructor({
                    name = ViewportEffect._name_,
                    requiresLayer = true,
                    config = new ViewportConfig({}),
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

    async #draw(context, isUnderlay) {

        const canvas = await Canvas2dFactory.getNewCanvas(this.data.width, this.data.height);

        const thePolyGaston = findValue(context.data.radius, context.data.radius + context.data.amplitude, context.data.times, context.numberOfFrames, context.currentFrame);
        await canvas.drawPolygon2d(thePolyGaston, context.data.center, 3, context.data.startAngle, context.data.thickness, context.data.innerColor, context.data.stroke + (isUnderlay ? context.theAccentGaston : 0), context.data.color);

        return canvas.convertToLayer();
    }

    async #compositeImage(context, layer) {

        const underlayLayer = await this.#draw(context, context.data.color, true);

        context.theAccentGaston = 0;
        const tempLayer = await this.#draw(context, context.data.innerColor, false);

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

    async #viewport(layer, currentFrame, numberOfFrames) {
        const context = {
            currentFrame,
            numberOfFrames,
            theAccentGaston: findValue(this.data.accentRange.lower, this.data.accentRange.upper, this.data.featherTimes, numberOfFrames, currentFrame),
            theBlurGaston: Math.ceil(findValue(this.data.blurRange.lower, this.data.blurRange.upper, this.data.featherTimes, numberOfFrames, currentFrame)),
            data: this.data,
        };

        await this.#compositeImage(context, layer);
    }

    #generate(settings) {
        this.data = {
            invertLayers: this.config.invertLayers,
            layerOpacity: this.config.layerOpacity,
            underLayerOpacity: this.config.underLayerOpacity,
            height: this.finalSize.height,
            width: this.finalSize.width,
            stroke: this.config.stroke,
            thickness: this.config.thickness,
            innerColor: this.config.innerColor?.getColor(settings) ?? settings.getNeutralFromBucket(),
            radius: getRandomFromArray(this.config.radius),
            startAngle: getRandomFromArray(this.config.startAngle),
            ampStroke: this.config.ampStroke,
            ampThickness: this.config.ampThickness,
            ampLength: getRandomFromArray(this.config.ampLength),
            ampRadius: getRandomFromArray(this.config.ampRadius),
            sparsityFactor: getRandomFromArray(this.config.sparsityFactor),
            amplitude: randomNumber(this.config.amplitude.lower, this.config.amplitude.upper),
            times: getRandomIntInclusive(this.config.times.lower, this.config.times.upper),
            color: this.config.color?.getColor(settings) ?? settings.getColorFromBucket(),
            ampInnerColor: settings.getColorFromBucket(),
            ampOuterColor: settings.getColorFromBucket(),
            featherTimes: getRandomIntInclusive(this.config.featherTimes.lower, this.config.featherTimes.upper),
            accentRange: {
                lower: getRandomIntInclusive(this.config.accentRange.bottom.lower, this.config.accentRange.bottom.upper),
                upper: getRandomIntInclusive(this.config.accentRange.top.lower, this.config.accentRange.top.upper),
            },
            blurRange: {
                lower: getRandomIntInclusive(this.config.blurRange.bottom.lower, this.config.blurRange.bottom.upper),
                upper: getRandomIntInclusive(this.config.blurRange.top.lower, this.config.blurRange.top.upper),
            },
            center: this.config.center,
        };
    }

    async invoke(layer, currentFrame, numberOfFrames) {
        await this.#viewport(layer, currentFrame, numberOfFrames);
        await super.invoke(layer, currentFrame, numberOfFrames);
    }

    getInfo() {
        return `${this.name}: start angle ${this.data.startAngle}`;
    }
}
