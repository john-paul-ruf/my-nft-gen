import {promises as fs} from 'fs';
import {LayerEffect} from 'my-nft-gen/src/core/layer/LayerEffect.js';
import {
    getRandomFromArray, getRandomIntInclusive, randomId, randomNumber,
} from 'my-nft-gen/src/core/math/random.js';
import {findValue} from 'my-nft-gen/src/core/math/findValue.js';
import {LayerFactory} from 'my-nft-gen/src/core/factory/layer/LayerFactory.js';
import {Canvas2dFactory} from 'my-nft-gen/src/core/factory/canvas/Canvas2dFactory.js';
import {Settings} from 'my-nft-gen/src/core/Settings.js';
import {ViewportConfig} from './ViewportConfig.js';
import {ColorPicker} from 'my-nft-gen/src/core/layer/configType/ColorPicker.js';
import {Position} from 'my-nft-gen/src/core/position/Position.js';
import {getAllFindValueAlgorithms} from 'my-nft-gen/src/core/math/findValue.js';

export class ViewportEffect extends LayerEffect {
    static _name_ = 'viewport';

    static presets = [
        {
            name: 'simple-viewport',
            effect: 'viewport',
            percentChance: 100,
            currentEffectConfig: {
                invertLayers: true,
                layerOpacity: 0.9,
                underLayerOpacity: 0.7,
                center: new Position({x: 1080 / 2, y: 1920 / 2}),
                color: new ColorPicker(ColorPicker.SelectionType.colorBucket),
                innerColor: new ColorPicker(ColorPicker.SelectionType.neutralBucket),
                stroke: 2,
                thickness: 15,
                ampStroke: 0,
                ampThickness: 1,
                radius: [300],
                startAngle: [270],
                ampLength: [40, 60],
                ampRadius: [40, 60],
                sparsityFactor: [4, 5, 6],
                amplitude: {lower: 100, upper: 100},
                times: {lower: 1, upper: 1},
                accentRange: {bottom: {lower: 0, upper: 0}, top: {lower: 15, upper: 20}},
                blurRange: {bottom: {lower: 2, upper: 2}, top: {lower: 4, upper: 6}},
                featherTimes: {lower: 2, upper: 3},
                accentFindValueAlgorithm: getAllFindValueAlgorithms(),
                blurFindValueAlgorithm: getAllFindValueAlgorithms(),
            }
        },
        {
            name: 'classic-viewport',
            effect: 'viewport',
            percentChance: 100,
            currentEffectConfig: {
                invertLayers: true,
                layerOpacity: 1,
                underLayerOpacity: 0.8,
                center: new Position({x: 1080 / 2, y: 1920 / 2}),
                color: new ColorPicker(ColorPicker.SelectionType.colorBucket),
                innerColor: new ColorPicker(ColorPicker.SelectionType.neutralBucket),
                stroke: 2,
                thickness: 18,
                ampStroke: 0,
                ampThickness: 1,
                radius: [350],
                startAngle: [270],
                ampLength: [50, 75, 100],
                ampRadius: [50, 75, 100],
                sparsityFactor: [3, 4, 5, 6],
                amplitude: {lower: 150, upper: 150},
                times: {lower: 1, upper: 2},
                accentRange: {bottom: {lower: 0, upper: 0}, top: {lower: 20, upper: 30}},
                blurRange: {bottom: {lower: 2, upper: 3}, top: {lower: 5, upper: 8}},
                featherTimes: {lower: 2, upper: 4},
                accentFindValueAlgorithm: getAllFindValueAlgorithms(),
                blurFindValueAlgorithm: getAllFindValueAlgorithms(),
            }
        },
        {
            name: 'complex-viewport',
            effect: 'viewport',
            percentChance: 100,
            currentEffectConfig: {
                invertLayers: true,
                layerOpacity: 1,
                underLayerOpacity: 0.9,
                center: new Position({x: 1080 / 2, y: 1920 / 2}),
                color: new ColorPicker(ColorPicker.SelectionType.colorBucket),
                innerColor: new ColorPicker(ColorPicker.SelectionType.neutralBucket),
                stroke: 3,
                thickness: 22,
                ampStroke: 0,
                ampThickness: 2,
                radius: [400],
                startAngle: [270],
                ampLength: [60, 90, 120],
                ampRadius: [60, 90, 120],
                sparsityFactor: [2, 3, 4, 5],
                amplitude: {lower: 200, upper: 200},
                times: {lower: 2, upper: 3},
                accentRange: {bottom: {lower: 0, upper: 0}, top: {lower: 25, upper: 40}},
                blurRange: {bottom: {lower: 3, upper: 4}, top: {lower: 6, upper: 10}},
                featherTimes: {lower: 3, upper: 6},
                accentFindValueAlgorithm: getAllFindValueAlgorithms(),
                blurFindValueAlgorithm: getAllFindValueAlgorithms(),
            }
        }
    ];

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
        await canvas.drawPolygon2d(thePolyGaston, context.data.center.getPosition(context.currentFrame, context.numberOfFrames), 3, context.data.startAngle, context.data.thickness, context.data.innerColor, context.data.stroke + (isUnderlay ? context.theAccentGaston : 0), context.data.color);

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
            theAccentGaston: findValue(this.data.accentRange.lower, this.data.accentRange.upper, this.data.featherTimes, numberOfFrames, currentFrame, this.data.accentFindValueAlgorithm),
            theBlurGaston: Math.ceil(findValue(this.data.blurRange.lower, this.data.blurRange.upper, this.data.featherTimes, numberOfFrames, currentFrame, this.data.blurFindValueAlgorithm)),
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
            blurFindValueAlgorithm: getRandomFromArray(this.config.blurFindValueAlgorithm),
            accentFindValueAlgorithm: getRandomFromArray(this.config.accentFindValueAlgorithm),
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
