import {LayerEffect} from '../../../core/layer/LayerEffect.js';
import {findOneWayValue} from '../../../core/math/findOneWayValue.js';
import {Canvas2dFactory} from '../../../core/factory/canvas/Canvas2dFactory.js';
import {getRandomFromArray, getRandomIntInclusive, randomId} from '../../../core/math/random.js';
import {findValue} from '../../../core/math/findValue.js';
import {Settings} from '../../../core/Settings.js';
import {AmpConfig} from './AmpConfig.js';

/** *
 *
 * Amp Effect
 * Creates a wheel of 'rays' based on the sparsity factor that spins based on the speed
 *
 */

export class AmpEffect extends LayerEffect {
    static _name_ = 'amp';

    constructor({
                    name = AmpEffect._name_,
                    requiresLayer = true,
                    config = new AmpConfig({}),
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

    async #drawUnderlay(context) {
        const theRayGaston = findOneWayValue(0, context.data.sparsityFactor * context.data.speed, 1, context.numberOfFrames, context.currentFrame);
        for (let i = 0; i < 360; i += context.data.sparsityFactor) {

            const angle = this.data.invertDirection ? ((i - theRayGaston) % 360) : (i + theRayGaston) % 360

            await context.canvas.drawRay2d(
                context.data.center,
                angle,
                context.data.lineStart + context.data.stroke,
                context.data.length + context.data.stroke,
                context.data.stroke,
                context.data.outerColor,
                context.data.stroke + context.theAccentGaston,
                context.data.outerColor,
            );
        }

        return await context.canvas.convertToLayer();
    }

    async #draw(context) {
        const theRayGaston = findOneWayValue(0, context.data.sparsityFactor * context.data.speed, 1, context.numberOfFrames, context.currentFrame);

        for (let i = 0; i < 360; i += context.data.sparsityFactor) {

            const angle = this.data.invertDirection ? ((i - theRayGaston) % 360) : (i + theRayGaston) % 360

            await context.canvas.drawRay2d(
                context.data.center,
                angle,
                context.data.lineStart,
                context.data.length,
                context.data.thickness,
                context.data.innerColor,
                context.data.thickness,
                context.data.outerColor,
            );
        }

        return await context.canvas.convertToLayer();
    }

    async #amp(layer, currentFrame, numberOfFrames) {
        const context = {
            currentFrame,
            numberOfFrames,
            drawing: `${this.workingDirectory}amp${randomId()}.png`,
            underlayName: `${this.workingDirectory}amp-underlay${randomId()}.png`,
            theAccentGaston: findValue(this.data.accentRange.lower, this.data.accentRange.upper, this.data.featherTimes, numberOfFrames, currentFrame),
            theBlurGaston: Math.ceil(findValue(this.data.blurRange.lower, this.data.blurRange.upper, this.data.featherTimes, numberOfFrames, currentFrame)),
            canvas: await Canvas2dFactory.getNewCanvas(this.data.width, this.data.height),
            data: this.data,
        };

        const underlayLayer = await this.#drawUnderlay(context);

        context.theAccentGaston = 0;
        context.canvas = await Canvas2dFactory.getNewCanvas(context.data.width, context.data.height);

        const tempLayer = await this.#draw(context);

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

    #generate(settings) {
        const finalImageSize = this.finalSize;

        this.data = {
            invertLayers: this.config.invertLayers,
            invertDirection: this.config.invertDirection,
            layerOpacity: this.config.layerOpacity,
            underLayerOpacity: this.config.underLayerOpacity,
            sparsityFactor: getRandomFromArray(this.config.sparsityFactor),
            height: finalImageSize.height,
            width: finalImageSize.width,
            stroke: this.config.stroke,
            thickness: this.config.thickness,
            innerColor: this.config.innerColor?.getColor(settings) ?? settings.getNeutralFromBucket(),
            outerColor: this.config.outerColor?.getColor(settings) ?? settings.getColorFromBucket(),
            length: this.config.length,
            lineStart: this.config.lineStart,
            center: this.config.center,
            accentRange: {
                lower: getRandomIntInclusive(this.config.accentRange.bottom.lower, this.config.accentRange.bottom.upper),
                upper: getRandomIntInclusive(this.config.accentRange.top.lower, this.config.accentRange.top.upper),
            },
            blurRange: {
                lower: getRandomIntInclusive(this.config.blurRange.bottom.lower, this.config.blurRange.bottom.upper),
                upper: getRandomIntInclusive(this.config.blurRange.top.lower, this.config.blurRange.top.upper),
            },
            featherTimes: getRandomIntInclusive(this.config.featherTimes.lower, this.config.featherTimes.upper),
            speed: getRandomIntInclusive(this.config.speed.lower, this.config.speed.upper),
        };
    }

    async invoke(layer, currentFrame, numberOfFrames) {
        await this.#amp(layer, currentFrame, numberOfFrames);
        await super.invoke(layer, currentFrame, numberOfFrames);
    }

    getInfo() {
        return `${this.name}: sparsity factor: ${this.data.sparsityFactor.toFixed(3)}`;
    }
}
