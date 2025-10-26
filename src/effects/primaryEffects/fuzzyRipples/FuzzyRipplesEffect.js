import {promises as fs} from 'fs';
import {LayerEffect} from 'my-nft-gen/src/core/layer/LayerEffect.js';
import {findOneWayValue} from 'my-nft-gen/src/core/math/findOneWayValue.js';
import {LayerFactory} from 'my-nft-gen/src/core/factory/layer/LayerFactory.js';
import {Canvas2dFactory} from 'my-nft-gen/src/core/factory/canvas/Canvas2dFactory.js';
import {getRandomIntInclusive, randomId} from 'my-nft-gen/src/core/math/random.js';
import {findValue} from 'my-nft-gen/src/core/math/findValue.js';
import {findPointByAngleAndCircle} from 'my-nft-gen/src/core/math/drawingMath.js';
import {Settings} from 'my-nft-gen/src/core/Settings.js';
import {FuzzyRipplesConfig} from './FuzzyRipplesConfig.js';
import {Range} from 'my-nft-gen/src/core/layer/configType/Range.js';
import {DynamicRange} from 'my-nft-gen/src/core/layer/configType/DynamicRange.js';
import {ColorPicker} from 'my-nft-gen/src/core/layer/configType/ColorPicker.js';
import {Position} from 'my-nft-gen/src/core/position/Position.js';
import {PercentageRange} from 'my-nft-gen/src/core/layer/configType/PercentageRange.js';
import {PercentageShortestSide} from 'my-nft-gen/src/core/layer/configType/PercentageShortestSide.js';
import {PercentageLongestSide} from 'my-nft-gen/src/core/layer/configType/PercentageLongestSide.js';

/** *
 *
 * Creates a set of six outer rings, connected by a hexagon, with a larger set of rings generated from the center, with fuzz
 *
 */

export class FuzzyRipplesEffect extends LayerEffect {
    static _name_ = 'fuzzy-ripples';
    static configClass = FuzzyRipplesConfig;

    static presets = [
        {
            name: 'subtle-fuzzy-ripples',
            effect: 'fuzzy-ripples',
            percentChance: 100,
            currentEffectConfig: {
                invertLayers: true,
                layerOpacity: 0.8,
                underLayerOpacity: 0.6,
                stroke: 1,
                thickness: 1,
                center: new Position({x: 1080 / 2, y: 1920 / 2}),
                innerColor: new ColorPicker(ColorPicker.SelectionType.colorBucket),
                outerColor: new ColorPicker(ColorPicker.SelectionType.colorBucket),
                speed: 0.5,
                invertDirection: false,
                largeRadius: new PercentageRange(new PercentageLongestSide(0.12), new PercentageLongestSide(0.12)),
                smallRadius: new PercentageRange(new PercentageLongestSide(0.20), new PercentageLongestSide(0.20)),
                largeNumberOfRings: new Range(5, 5),
                smallNumberOfRings: new Range(5, 5),
                ripple: new PercentageRange(new PercentageShortestSide(0.05), new PercentageShortestSide(0.05)),
                times: new Range(1, 2),
                smallerRingsGroupRadius: new PercentageRange(new PercentageShortestSide(0.25), new PercentageShortestSide(0.25)),
                accentRange: new DynamicRange(new Range(0.5, 0.5), new Range(2, 4)),
                blurRange: new DynamicRange(new Range(1, 1), new Range(1, 1)),
                featherTimes: new Range(1, 2),
            }
        },
        {
            name: 'classic-fuzzy-ripples',
            effect: 'fuzzy-ripples',
            percentChance: 100,
            currentEffectConfig: {
                invertLayers: true,
                layerOpacity: 1,
                underLayerOpacity: 0.8,
                stroke: 1,
                thickness: 2,
                center: new Position({x: 1080 / 2, y: 1920 / 2}),
                innerColor: new ColorPicker(ColorPicker.SelectionType.colorBucket),
                outerColor: new ColorPicker(ColorPicker.SelectionType.colorBucket),
                speed: 1,
                invertDirection: false,
                largeRadius: new PercentageRange(new PercentageLongestSide(0.15), new PercentageLongestSide(0.15)),
                smallRadius: new PercentageRange(new PercentageLongestSide(0.25), new PercentageLongestSide(0.25)),
                largeNumberOfRings: new Range(8, 8),
                smallNumberOfRings: new Range(8, 8),
                ripple: new PercentageRange(new PercentageShortestSide(0.10), new PercentageShortestSide(0.10)),
                times: new Range(2, 4),
                smallerRingsGroupRadius: new PercentageRange(new PercentageShortestSide(0.3), new PercentageShortestSide(0.3)),
                accentRange: new DynamicRange(new Range(1, 1), new Range(3, 6)),
                blurRange: new DynamicRange(new Range(1, 1), new Range(1, 1)),
                featherTimes: new Range(2, 4),
            }
        },
        {
            name: 'intense-fuzzy-ripples',
            effect: 'fuzzy-ripples',
            percentChance: 100,
            currentEffectConfig: {
                invertLayers: true,
                layerOpacity: 1,
                underLayerOpacity: 0.9,
                stroke: 2,
                thickness: 3,
                center: new Position({x: 1080 / 2, y: 1920 / 2}),
                innerColor: new ColorPicker(ColorPicker.SelectionType.colorBucket),
                outerColor: new ColorPicker(ColorPicker.SelectionType.colorBucket),
                speed: 2,
                invertDirection: false,
                largeRadius: new PercentageRange(new PercentageLongestSide(0.18), new PercentageLongestSide(0.18)),
                smallRadius: new PercentageRange(new PercentageLongestSide(0.30), new PercentageLongestSide(0.30)),
                largeNumberOfRings: new Range(12, 12),
                smallNumberOfRings: new Range(12, 12),
                ripple: new PercentageRange(new PercentageShortestSide(0.15), new PercentageShortestSide(0.15)),
                times: new Range(4, 8),
                smallerRingsGroupRadius: new PercentageRange(new PercentageShortestSide(0.35), new PercentageShortestSide(0.35)),
                accentRange: new DynamicRange(new Range(2, 2), new Range(5, 10)),
                blurRange: new DynamicRange(new Range(1, 2), new Range(2, 3)),
                featherTimes: new Range(4, 8),
            }
        }
    ];

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
        await this.#drawRings(canvas, context, context.data.center.getPosition(context.currentFrame, context.numberOfFrames), context.data.largeRadius, context.data.largeNumberOfRings, context.data.thickness, context.data.innerColor, context.data.stroke + context.theAccentGaston, context.data.outerColor);
        for (let i = 30; i <= 330; i += 60) {
            await this.#drawRings(
                canvas,
                context,
                findPointByAngleAndCircle(context.data.center.getPosition(context.currentFrame, context.numberOfFrames), i + context.theAngleGaston, context.data.smallerRingsGroupRadius),
                context.data.smallRadius,
                context.data.smallNumberOfRings,
                context.data.thickness, context.data.innerColor, context.data.stroke + context.theAccentGaston, context.data.outerColor
            );
        }
        await canvas.drawPolygon2d(context.data.smallerRingsGroupRadius, context.data.center.getPosition(context.currentFrame, context.numberOfFrames), 6, 30 + context.theAngleGaston, context.data.thickness, context.data.outerColor, context.data.stroke + context.theAccentGaston, context.data.outerColor);

        return canvas.convertToLayer();
    }

    async #draw(context) {
        const canvas = await Canvas2dFactory.getNewCanvas(context.data.width, context.data.height);

        if (context.data.stroke > 0) {
            // outer color
            await this.#drawRings(canvas, context, context.data.center.getPosition(context.currentFrame, context.numberOfFrames), context.data.largeRadius, context.data.largeNumberOfRings, context.data.thickness, context.data.innerColor, context.data.stroke + context.theAccentGaston, context.data.outerColor);
            for (let i = 30; i <= 330; i += 60) {
                await this.#drawRings(
                    canvas,
                    context,
                    findPointByAngleAndCircle(context.data.center.getPosition(context.currentFrame, context.numberOfFrames), i + context.theAngleGaston, context.data.smallerRingsGroupRadius),
                    context.data.smallRadius,
                    context.data.smallNumberOfRings,
                    context.data.thickness, context.data.innerColor, context.data.stroke + context.theAccentGaston, context.data.outerColor
                );
            }
            await canvas.drawPolygon2d(context.data.smallerRingsGroupRadius, context.data.center.getPosition(context.currentFrame, context.numberOfFrames), 6, 30 + context.theAngleGaston, context.data.thickness, context.data.outerColor, context.data.stroke, context.data.outerColor);
        }

        // inner color
        await this.#drawRings(canvas, context, context.data.center.getPosition(context.currentFrame, context.numberOfFrames), context.data.largeRadius, context.data.largeNumberOfRings, context.data.thickness, context.data.innerColor, context.data.stroke + context.theAccentGaston, context.data.outerColor);
        for (let i = 30; i <= 330; i += 60) {
            await this.#drawRings(
                canvas,
                context,
                findPointByAngleAndCircle(context.data.center.getPosition(context.currentFrame, context.numberOfFrames), i + context.theAngleGaston, context.data.smallerRingsGroupRadius),
                context.data.smallRadius,
                context.data.smallNumberOfRings,
                context.data.thickness, context.data.innerColor, context.data.stroke + context.theAccentGaston, context.data.outerColor
            );
        }
        await canvas.drawPolygon2d(context.data.smallerRingsGroupRadius, context.data.center.getPosition(context.currentFrame, context.numberOfFrames), 6, 30 + context.theAngleGaston, context.data.thickness, context.data.innerColor, 0, context.data.innerColor);

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
