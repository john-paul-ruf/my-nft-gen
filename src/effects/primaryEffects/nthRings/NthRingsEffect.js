import { promises as fs } from 'fs';
import { LayerEffect } from 'my-nft-gen';
import { getRandomFromArray, getRandomIntInclusive, randomId } from 'my-nft-gen/src/core/math/random.js';
import { findValue } from 'my-nft-gen/src/core/math/findValue.js';
import { findOneWayValue } from 'my-nft-gen/src/core/math/findOneWayValue.js';
import { findPointByAngleAndCircle } from 'my-nft-gen/src/core/math/drawingMath.js';
import { LayerFactory } from 'my-nft-gen/src/core/factory/layer/LayerFactory.js';
import { Canvas2dFactory } from 'my-nft-gen/src/core/factory/canvas/Canvas2dFactory.js';
import { Settings } from 'my-nft-gen/src/core/Settings.js';
import { NthRingsConfig } from './NthRingsConfig.js';
import { Range } from 'my-nft-gen/src/core/layer/configType/Range.js';
import { DynamicRange } from 'my-nft-gen/src/core/layer/configType/DynamicRange.js';
import { Position } from 'my-nft-gen/src/core/position/Position.js';
import { PercentageRange } from 'my-nft-gen/src/core/layer/configType/PercentageRange.js';
import { PercentageLongestSide } from 'my-nft-gen/src/core/layer/configType/PercentageLongestSide.js';
import { PercentageShortestSide } from 'my-nft-gen/src/core/layer/configType/PercentageShortestSide.js';

export class NthRingsEffect extends LayerEffect {
    static _name_ = 'nth-rings';

    static presets = [
        {
            name: 'simple-nth-rings',
            effect: 'nth-rings',
            percentChance: 100,
            currentEffectConfig: {
                invertLayers: true,
                totalRingCount: new Range(8, 10),
                layerOpacity: 0.4,
                underLayerOpacity: 0.3,
                stroke: 1,
                thickness: 1,
                smallRadius: new PercentageRange(new PercentageShortestSide(0.2), new PercentageShortestSide(0.2)),
                smallNumberOfRings: new Range(5, 8),
                ripple: new PercentageRange(new PercentageShortestSide(0.03), new PercentageShortestSide(0.06)),
                times: new Range(1, 2),
                smallerRingsGroupRadius: new PercentageRange(new PercentageShortestSide(0.2), new PercentageShortestSide(0.2)),
                accentRange: new DynamicRange(new Range(0.5, 0.5), new Range(2, 3)),
                blurRange: new DynamicRange(new Range(1, 1), new Range(1, 2)),
                featherTimes: new Range(1, 2),
                center: new Position({x: 1080 / 2, y: 1920 / 2}),
            }
        },
        {
            name: 'classic-nth-rings',
            effect: 'nth-rings',
            percentChance: 100,
            currentEffectConfig: {
                invertLayers: true,
                totalRingCount: new Range(8, 10),
                layerOpacity: 0.4,
                underLayerOpacity: 0.3,
                stroke: 1,
                thickness: 1,
                smallRadius: new PercentageRange(new PercentageShortestSide(0.3), new PercentageShortestSide(0.3)),
                smallNumberOfRings: new Range(5, 8),
                ripple: new PercentageRange(new PercentageShortestSide(0.03), new PercentageShortestSide(0.06)),
                times: new Range(1, 2),
                smallerRingsGroupRadius: new PercentageRange(new PercentageShortestSide(0.2), new PercentageShortestSide(0.2)),
                accentRange: new DynamicRange(new Range(0.5, 0.5), new Range(2, 3)),
                blurRange: new DynamicRange(new Range(1, 1), new Range(1, 2)),
                featherTimes: new Range(1, 2),
                center: new Position({x: 1080 / 2, y: 1920 / 2}),
            }
        },
        {
            name: 'complex-nth-rings',
            effect: 'nth-rings',
            percentChance: 100,
            currentEffectConfig: {
                invertLayers: true,
                totalRingCount: new Range(12, 18),
                layerOpacity: 0.4,
                underLayerOpacity: 0.3,
                stroke: 1,
                thickness: 1,
                smallRadius: new PercentageRange(new PercentageShortestSide(0.4), new PercentageShortestSide(0.4)),
                smallNumberOfRings: new Range(5, 8),
                ripple: new PercentageRange(new PercentageShortestSide(0.03), new PercentageShortestSide(0.06)),
                times: new Range(1, 2),
                smallerRingsGroupRadius: new PercentageRange(new PercentageShortestSide(0.2), new PercentageShortestSide(0.2)),
                accentRange: new DynamicRange(new Range(0.5, 0.5), new Range(2, 3)),
                blurRange: new DynamicRange(new Range(1, 1), new Range(1, 2)),
                featherTimes: new Range(1, 2),
                center: new Position({x: 1080 / 2, y: 1920 / 2}),
            }
        }
    ];

    constructor({
        name = NthRingsEffect._name_,
        requiresLayer = true,
        config = new NthRingsConfig({}),
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

    async #drawRing(pos, radius, innerColor, outerColor, context) {
        const theGaston = findValue(radius, radius + context.data.ripple, context.data.times, context.numberOfFrames, context.currentFrame);
        await context.canvas.drawRing2d(pos, theGaston, context.data.thickness, innerColor, context.data.stroke + context.theAccentGaston, outerColor);
    }

    async #drawRings(pos, radius, numberOfRings, context) {
        for (let i = 0; i < numberOfRings; i++) {
            await this.#drawRing(pos, radius / numberOfRings * i, context.data.innerColor, context.data.outerColor, context);
        }
    }

    async #draw(context, filename) {
        const angle = (360 / context.data.totalRingCount);

        const theAngleGaston = findOneWayValue(0, angle, 1, context.numberOfFrames, context.currentFrame);

        for (let i = 0; i < 360; i += angle) {
            await this.#drawRings(
                findPointByAngleAndCircle(context.data.center.getPosition(context.currentFrame, context.numberOfFrames), i + theAngleGaston, context.data.smallerRingsGroupRadius),
                context.data.smallRadius,
                context.data.smallNumberOfRings,
                context,
            );
        }

        await context.canvas.toFile(filename);
    }

    async #drawUnderlay(context, filename) {
        const angle = (360 / context.data.totalRingCount);

        const theAngleGaston = findOneWayValue(0, angle, 1, context.numberOfFrames, context.currentFrame);

        for (let i = 0; i < 360; i += angle) {
            await this.#drawRings(
                findPointByAngleAndCircle(context.data.center.getPosition(context.currentFrame, context.numberOfFrames), i + theAngleGaston, context.data.smallerRingsGroupRadius),
                context.data.smallRadius,
                context.data.smallNumberOfRings,
                context,
            );
        }

        await context.canvas.toFile(filename);
    }

    async #compositeImage(context, layer) {
        const tempLayer = await LayerFactory.getLayerFromFile(context.drawing, this.fileConfig);
        const underlayLayer = await LayerFactory.getLayerFromFile(context.underlayName, this.fileConfig);

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

    async #processDrawFunction(context) {
        await this.#drawUnderlay(context, context.underlayName);

        context.theAccentGaston = 0;
        context.canvas = await Canvas2dFactory.getNewCanvas(context.data.width, context.data.height);

        await this.#draw(context, context.drawing);
    }

    async #nthRings(layer, currentFrame, numberOfFrames) {
        const context = {
            currentFrame,
            numberOfFrames,
            theAccentGaston: findValue(this.data.accentRange.lower, this.data.accentRange.upper, this.data.featherTimes, numberOfFrames, currentFrame),
            theBlurGaston: Math.ceil(findValue(this.data.blurRange.lower, this.data.blurRange.upper, this.data.featherTimes, numberOfFrames, currentFrame)),
            drawing: `${this.workingDirectory}nth-rings${randomId()}.png`,
            underlayName: `${this.workingDirectory}nth-rings-underlay${randomId()}.png`,
            canvas: await Canvas2dFactory.getNewCanvas(this.data.width, this.data.height),
            data: this.data,
        };

        await this.#processDrawFunction(context);
        await this.#compositeImage(context, layer);

        await fs.unlink(context.drawing);
        await fs.unlink(context.underlayName);
    }

    #generate(settings) {
        this.data = {
            invertLayers: this.config.invertLayers,
            totalRingCount: getRandomIntInclusive(this.config.totalRingCount.lower, this.config.totalRingCount.upper),
            layerOpacity: this.config.layerOpacity,
            underLayerOpacity: this.config.underLayerOpacity,
            height: this.finalSize.height,
            width: this.finalSize.width,
            stroke: this.config.stroke,
            thickness: this.config.thickness,
            innerColor: settings.getNeutralFromBucket(),
            outerColor: settings.getColorFromBucket(),
            smallRadius: getRandomIntInclusive(this.config.smallRadius.lower(this.finalSize), this.config.smallRadius.upper(this.finalSize)),
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
            getInfo: () => {

            },
        };
    }

    async invoke(layer, currentFrame, numberOfFrames) {
        await this.#nthRings(layer, currentFrame, numberOfFrames);
        await super.invoke(layer, currentFrame, numberOfFrames);
    }

    getInfo() {
        return `${this.name}: ${this.data.totalRingCount} ring groups, ripple: ${this.data.ripple.toFixed(2)}`;
    }
}
