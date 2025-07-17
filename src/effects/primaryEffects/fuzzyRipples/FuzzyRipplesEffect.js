import {promises as fs} from 'fs';
import {LayerEffect} from '../../../core/layer/LayerEffect.js';
import {findOneWayValue} from '../../../core/math/findOneWayValue.js';
import {LayerFactory} from '../../../core/factory/layer/LayerFactory.js';
import {Canvas2dFactory} from '../../../core/factory/canvas/Canvas2dFactory.js';
import {getRandomIntInclusive, randomId} from '../../../core/math/random.js';
import {findValue} from '../../../core/math/findValue.js';
import {findPointByAngleAndCircle} from '../../../core/math/drawingMath.js';
import {Settings} from '../../../core/Settings.js';
import {FuzzyRipplesConfig} from './FuzzyRipplesConfig.js';

/** *
 *
 * Creates a set of six outer rings, connected by a hexagon, with a larger set of rings generated from the center, with fuzz
 *
 */

export class FuzzyRipplesEffect extends LayerEffect {
    static _name_ = 'fuzzy-ripples';

    constructor({
                    name = FuzzyRipplesEffect._name_,
                    requiresLayer = true,
                    config = new FuzzyRipplesConfig({}),
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

    async #drawRing(canvas, pos, radius, thickness, color, stoke, outerColor, context) {
        const theGaston = findValue(radius, radius + context.data.ripple, context.data.times, context.numberOfFrames, context.currentFrame);
        await canvas.drawRing2d(pos, theGaston, thickness, color, stoke, outerColor);
    }

    async #drawRings(canvas, context, pos, radius, numberOfRings, thickness, color, stoke, outerColor) {
        for (let i = 0; i < numberOfRings; i++) {
            await this.#drawRing(canvas, pos, radius / numberOfRings * i, thickness, color, stoke, outerColor, context);
        }
    }

    async #drawUnderlay(context) {
        const canvas = await Canvas2dFactory.getNewCanvas(context.data.width, context.data.height);

        // outer color
        await this.#drawRings(canvas, context, context.data.center, context.data.largeRadius, context.data.largeNumberOfRings, context.data.thickness, context.data.innerColor, context.data.stroke + context.theAccentGaston, context.data.outerColor);
        for (let i = 30; i <= 330; i += 60) {
            await this.#drawRings(
                canvas,
                context,
                findPointByAngleAndCircle(context.data.center, i + context.theAngleGaston, context.data.smallerRingsGroupRadius),
                context.data.smallRadius,
                context.data.smallNumberOfRings,
                context.data.thickness, context.data.innerColor, context.data.stroke + context.theAccentGaston, context.data.outerColor
            );
        }
        await canvas.drawPolygon2d(context.data.smallerRingsGroupRadius, context.data.center, 6, 30 + context.theAngleGaston, context.data.thickness, context.data.outerColor, context.data.stroke + context.theAccentGaston, context.data.outerColor);

        return canvas.convertToLayer();
    }

    async #draw(context) {
        const canvas = await Canvas2dFactory.getNewCanvas(context.data.width, context.data.height);

        if (context.data.stroke > 0) {
            // outer color
            await this.#drawRings(canvas, context, context.data.center, context.data.largeRadius, context.data.largeNumberOfRings, context.data.thickness, context.data.innerColor, context.data.stroke + context.theAccentGaston, context.data.outerColor);
            for (let i = 30; i <= 330; i += 60) {
                await this.#drawRings(
                    canvas,
                    context,
                    findPointByAngleAndCircle(context.data.center, i + context.theAngleGaston, context.data.smallerRingsGroupRadius),
                    context.data.smallRadius,
                    context.data.smallNumberOfRings,
                    context.data.thickness, context.data.innerColor, context.data.stroke + context.theAccentGaston, context.data.outerColor
                );
            }
            await canvas.drawPolygon2d(context.data.smallerRingsGroupRadius, context.data.center, 6, 30 + context.theAngleGaston, context.data.thickness, context.data.outerColor, context.data.stroke, context.data.outerColor);
        }

        // inner color
        await this.#drawRings(canvas, context, context.data.center, context.data.largeRadius, context.data.largeNumberOfRings, context.data.thickness, context.data.innerColor, context.data.stroke + context.theAccentGaston, context.data.outerColor);
        for (let i = 30; i <= 330; i += 60) {
            await this.#drawRings(
                canvas,
                context,
                findPointByAngleAndCircle(context.data.center, i + context.theAngleGaston, context.data.smallerRingsGroupRadius),
                context.data.smallRadius,
                context.data.smallNumberOfRings,
                context.data.thickness, context.data.innerColor, context.data.stroke + context.theAccentGaston, context.data.outerColor
            );
        }
        await canvas.drawPolygon2d(context.data.smallerRingsGroupRadius, context.data.center, 6, 30 + context.theAngleGaston, context.data.thickness, context.data.innerColor, 0, context.data.innerColor);

        return canvas.convertToLayer();
    }

    async #compositeImage(context, layer) {
        const underlayLayer = await this.#drawUnderlay(context, context.underlayName);

        context.theAccentGaston = 0;

        const tempLayer = await this.#draw(context, context.drawing);

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

    async #fuzzyRipple(layer, currentFrame, numberOfFrames) {
        const context = {
            currentFrame,
            numberOfFrames,
            theAccentGaston: findValue(this.data.accentRange.lower, this.data.accentRange.upper, this.data.featherTimes, numberOfFrames, currentFrame),
            theBlurGaston: Math.ceil(findValue(this.data.blurRange.lower, this.data.blurRange.upper, this.data.featherTimes, numberOfFrames, currentFrame)),
            theAngleGaston: findOneWayValue(0, this.data.speed * 60, 1, numberOfFrames, currentFrame, this.data.invertDirection),
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
            innerColor: this.config.innerColor.getColor(settings),
            outerColor: this.config.outerColor.getColor(settings),
            speed: this.config.speed,
            invertDirection: this.config.invertDirection,
            largeRadius: getRandomIntInclusive(this.config.largeRadius.lower(this.finalSize), this.config.largeRadius.upper(this.finalSize)),
            smallRadius: getRandomIntInclusive(this.config.smallRadius.lower(this.finalSize), this.config.smallRadius.upper(this.finalSize)),
            largeNumberOfRings: getRandomIntInclusive(this.config.largeNumberOfRings.lower, this.config.largeNumberOfRings.upper),
            smallNumberOfRings: getRandomIntInclusive(this.config.smallNumberOfRings.lower, this.config.smallNumberOfRings.upper),
            ripple: getRandomIntInclusive(this.config.ripple.lower(this.finalSize), this.config.ripple.upper(this.finalSize)),
            smallerRingsGroupRadius: getRandomIntInclusive(this.config.smallerRingsGroupRadius.lower(this.finalSize), this.config.smallerRingsGroupRadius.upper(this.finalSize)),
            times: getRandomIntInclusive(this.config.times.lower, this.config.times.upper),
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

        };
    }

    async invoke(layer, currentFrame, numberOfFrames) {
        await this.#fuzzyRipple(layer, currentFrame, numberOfFrames);
        await super.invoke(layer, currentFrame, numberOfFrames);
    }

    getInfo() {
        return `${this.name}: large rings: ${this.data.largeNumberOfRings}, small rings x6: ${this.data.smallNumberOfRings}, ripple: ${this.data.ripple}`;
    }
}
