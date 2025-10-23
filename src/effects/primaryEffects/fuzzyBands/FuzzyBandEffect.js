import { promises as fs } from 'fs';
import { LayerEffect } from 'my-nft-gen';
import { LayerFactory } from 'my-nft-gen/src/core/factory/layer/LayerFactory.js';
import { Canvas2dFactory } from 'my-nft-gen/src/core/factory/canvas/Canvas2dFactory.js';
import { findValue } from 'my-nft-gen/src/core/math/findValue.js';
import { getRandomIntInclusive, randomId, randomNumber } from 'my-nft-gen/src/core/math/random.js';
import { Settings } from 'my-nft-gen/src/core/Settings.js';
import { FuzzyBandConfig } from './FuzzyBandConfig.js';
import { Range } from 'my-nft-gen/src/core/layer/configType/Range.js';
import { DynamicRange } from 'my-nft-gen/src/core/layer/configType/DynamicRange.js';
import { ColorPicker } from 'my-nft-gen/src/core/layer/configType/ColorPicker.js';
import { Position } from 'my-nft-gen/src/core/position/Position.js';
import { PercentageRange } from 'my-nft-gen/src/core/layer/configType/PercentageRange.js';
import { PercentageShortestSide } from 'my-nft-gen/src/core/layer/configType/PercentageShortestSide.js';
import { PercentageLongestSide } from 'my-nft-gen/src/core/layer/configType/PercentageLongestSide.js';

export class FuzzyBandEffect extends LayerEffect {
    static _name_ = 'fuzz-bands-mark-two';

    static presets = [
        {
            name: 'simple-fuzzy-bands',
            effect: 'fuzz-bands-mark-two',
            percentChance: 100,
            currentEffectConfig: {
                color: new ColorPicker(ColorPicker.SelectionType.colorBucket),
                innerColor: new ColorPicker(ColorPicker.SelectionType.colorBucket),
                invertLayers: true,
                layerOpacity: 0.8,
                center: new Position({x: 1080 / 2, y: 1920 / 2}),
                underLayerOpacityRange: { bottom: { lower: 0.5, upper: 0.6 }, top: { lower: 0.7, upper: 0.75 } },
                underLayerOpacityTimes: { lower: 1, upper: 3 },
                circles: { lower: 3, upper: 5 },
                stroke: 0,
                thickness: 3,
                radius: new PercentageRange(new PercentageShortestSide(0.15), new PercentageLongestSide(0.35)),
                accentRange: { bottom: { lower: 3, upper: 6 }, top: { lower: 12, upper: 20 } },
                blurRange: { bottom: { lower: 1, upper: 2 }, top: { lower: 4, upper: 6 } },
                featherTimes: { lower: 1, upper: 3 },
            }
        },
        {
            name: 'classic-fuzzy-bands',
            effect: 'fuzz-bands-mark-two',
            percentChance: 100,
            currentEffectConfig: {
                color: new ColorPicker(ColorPicker.SelectionType.colorBucket),
                innerColor: new ColorPicker(ColorPicker.SelectionType.colorBucket),
                invertLayers: true,
                layerOpacity: 1,
                center: new Position({x: 1080 / 2, y: 1920 / 2}),
                underLayerOpacityRange: { bottom: { lower: 0.7, upper: 0.8 }, top: { lower: 0.9, upper: 0.95 } },
                underLayerOpacityTimes: { lower: 2, upper: 6 },
                circles: { lower: 6, upper: 10 },
                stroke: 0,
                thickness: 4,
                radius: new PercentageRange(new PercentageShortestSide(0.10), new PercentageLongestSide(0.45)),
                accentRange: { bottom: { lower: 6, upper: 12 }, top: { lower: 25, upper: 45 } },
                blurRange: { bottom: { lower: 1, upper: 3 }, top: { lower: 8, upper: 12 } },
                featherTimes: { lower: 2, upper: 6 },
            }
        },
        {
            name: 'complex-fuzzy-bands',
            effect: 'fuzz-bands-mark-two',
            percentChance: 100,
            currentEffectConfig: {
                color: new ColorPicker(ColorPicker.SelectionType.colorBucket),
                innerColor: new ColorPicker(ColorPicker.SelectionType.colorBucket),
                invertLayers: true,
                layerOpacity: 1,
                center: new Position({x: 1080 / 2, y: 1920 / 2}),
                underLayerOpacityRange: { bottom: { lower: 0.8, upper: 0.9 }, top: { lower: 0.95, upper: 1 } },
                underLayerOpacityTimes: { lower: 4, upper: 10 },
                circles: { lower: 12, upper: 18 },
                stroke: 1,
                thickness: 5,
                radius: new PercentageRange(new PercentageShortestSide(0.05), new PercentageLongestSide(0.5)),
                accentRange: { bottom: { lower: 10, upper: 20 }, top: { lower: 35, upper: 60 } },
                blurRange: { bottom: { lower: 2, upper: 5 }, top: { lower: 12, upper: 18 } },
                featherTimes: { lower: 4, upper: 10 },
            }
        }
    ];

/** *
 *
 * Creates a set of rings with fuzz
 *
 */

    constructor({
        name = FuzzyBandEffect._name_,
        requiresLayer = true,
        config = new FuzzyBandConfig({}),
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

    async #top(context, i) {
        const canvas = await Canvas2dFactory.getNewCanvas(context.data.width, context.data.height);

        // draw
        await canvas.drawRing2d(context.data.center.getPosition(context.currentFrame, context.numberOfFrames), context.data.circles[i].radius, context.data.thickness, context.data.circles[i].innerColor, context.data.stroke, context.data.circles[i].color);

        // opacity
        const tempLayer = await canvas.convertToLayer();
        await tempLayer.adjustLayerOpacity(context.data.layerOpacity);

        return tempLayer;
    }

    async #bottom(context, i) {
        const canvas = await Canvas2dFactory.getNewCanvas(context.data.width, context.data.height);

        // draw underlay
        const theAccentGaston = findValue(context.data.circles[i].accentRange.lower, context.data.circles[i].accentRange.upper, context.data.circles[i].featherTimes, context.numberOfFrames, context.currentFrame);
        await canvas.drawRing2d(context.data.center.getPosition(context.currentFrame, context.numberOfFrames), context.data.circles[i].radius, context.data.thickness, context.data.circles[i].innerColor, (context.data.stroke + theAccentGaston), context.data.circles[i].color);

        const underlayLayer = await canvas.convertToLayer();

        // blur
        const theBlurGaston = Math.ceil(findValue(context.data.circles[i].blurRange.lower, context.data.circles[i].blurRange.upper, context.data.circles[i].featherTimes, context.numberOfFrames, context.currentFrame));
        await underlayLayer.blur(theBlurGaston);

        // opacity
        const theUnderLayerOpacityGaston = findValue(context.data.circles[i].underLayerOpacityRange.lower, context.data.circles[i].underLayerOpacityRange.upper, context.data.circles[i].underLayerOpacityTimes, context.numberOfFrames, context.currentFrame);
        await underlayLayer.adjustLayerOpacity(theUnderLayerOpacityGaston);

        return underlayLayer;
    }

    async #buildLayers(context) {
        const top = [];
        const bottom = [];

        // draw with top, opacity
        for (let i = 0; i < context.data.numberOfCircles; i++) {
            top.push(await this.#top(context, i));
        }

        // draw underlay, blur, and opacity
        for (let i = 0; i < context.data.numberOfCircles; i++) {
            bottom.push(await this.#bottom(context, i));
        }

        return { top, bottom };
    }

    async #createThoseFuzzyBands(context) {
        const { top, bottom } = await this.#buildLayers(context);

        // Combine top and bottom layers
        if (!context.data.invertLayers) {
            for (let i = 0; i < bottom.length; i++) {
                await context.layer.compositeLayerOver(bottom[i]);
            }

            for (let i = 0; i < top.length; i++) {
                await context.layer.compositeLayerOver(top[i]);
            }
        } else {
            for (let i = 0; i < top.length; i++) {
                await context.layer.compositeLayerOver(top[i]);
            }

            for (let i = 0; i < bottom.length; i++) {
                await context.layer.compositeLayerOver(bottom[i]);
            }
        }
    }

    async #fuzzBands(layer, currentFrame, numberOfFrames) {
        const context = {
            currentFrame,
            numberOfFrames,
            data: this.data,
            layer,
        };

        await this.#createThoseFuzzyBands(context);
    }

    #generate(settings) {
        const data = {
            invertLayers: this.config.invertLayers,
            layerOpacity: this.config.layerOpacity,
            numberOfCircles: getRandomIntInclusive(this.config.circles.lower, this.config.circles.upper),
            height: this.finalSize.height,
            width: this.finalSize.width,
            stroke: this.config.stroke,
            thickness: this.config.thickness,
            center: this.config.center,
        };

        const computeInitialInfo = (num) => {
            const info = [];
            for (let i = 0; i <= num; i++) {
                info.push({
                    radius: getRandomIntInclusive(this.config.radius.lower(this.finalSize), this.config.radius.upper(this.finalSize)),
                    color: this.config.color.getColor(settings),
                    innerColor: this.config.innerColor.getColor(settings),
                    accentRange: {
                        lower: getRandomIntInclusive(this.config.accentRange.bottom.lower, this.config.accentRange.bottom.upper),
                        upper: getRandomIntInclusive(this.config.accentRange.top.lower, this.config.accentRange.top.upper),
                    },
                    blurRange: {
                        lower: getRandomIntInclusive(this.config.blurRange.bottom.lower, this.config.blurRange.bottom.upper),
                        upper: getRandomIntInclusive(this.config.blurRange.top.lower, this.config.blurRange.top.upper),
                    },
                    featherTimes: getRandomIntInclusive(this.config.featherTimes.lower, this.config.featherTimes.upper),
                    underLayerOpacityRange: {
                        lower: randomNumber(this.config.underLayerOpacityRange.bottom.lower, this.config.underLayerOpacityRange.bottom.upper),
                        upper: randomNumber(this.config.underLayerOpacityRange.top.lower, this.config.underLayerOpacityRange.top.upper),
                    },
                    underLayerOpacityTimes: getRandomIntInclusive(this.config.underLayerOpacityTimes.lower, this.config.underLayerOpacityTimes.upper),
                });
            }
            return info;
        };

        data.circles = computeInitialInfo(data.numberOfCircles);

        this.data = data;
    }

    async invoke(layer, currentFrame, numberOfFrames) {
        await this.#fuzzBands(layer, currentFrame, numberOfFrames);
        await super.invoke(layer, currentFrame, numberOfFrames);
    }

    getInfo() {
        return `${this.name}: ${this.data.numberOfCircles} fuzzy bands`;
    }
}
