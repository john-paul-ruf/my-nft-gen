import {promises as fs} from 'fs';
import {LayerEffect} from 'my-nft-gen/src/core/layer/LayerEffect.js';
import {LayerFactory} from 'my-nft-gen/src/core/factory/layer/LayerFactory.js';
import {Canvas2dFactory} from 'my-nft-gen/src/core/factory/canvas/Canvas2dFactory.js';
import {getRandomFromArray, getRandomIntInclusive, randomId} from 'my-nft-gen/src/core/math/random.js';
import {findValue} from 'my-nft-gen/src/core/math/findValue.js';
import {findPointByAngleAndCircle} from 'my-nft-gen/src/core/math/drawingMath.js';
import {Settings} from 'my-nft-gen/src/core/Settings.js';
import {CurvedRedEyeConfig} from './CurvedRedEyeConfig.js';
import {distanceBetweenTwoPoints} from 'my-nft-gen/src/core/math/distanceBetweenTwoPoints.js';
import {findPointByDistanceBetweenTwoPoints} from 'my-nft-gen/src/core/math/findPointByDistanceBetweenTwoPoints.js';
import {findOneWayValue} from 'my-nft-gen/src/core/math/findOneWayValue.js';
import {Range} from 'my-nft-gen/src/core/layer/configType/Range.js';
import {DynamicRange} from 'my-nft-gen/src/core/layer/configType/DynamicRange.js';
import {ColorPicker} from 'my-nft-gen/src/core/layer/configType/ColorPicker.js';
import {Point2D} from 'my-nft-gen/src/core/layer/configType/Point2D.js';

export class CurvedRedEyeEffect extends LayerEffect {
    static _name_ = 'curved-red-eye';

    static presets = [
        {
            name: 'simple-curved-eye',
            effect: 'curved-red-eye',
            percentChance: 100,
            currentEffectConfig: {
                layerOpacity: 0.45,
                underLayerOpacity: 0.65,
                innerColor: new ColorPicker(ColorPicker.SelectionType.neutralBucket),
                outerColor: new ColorPicker(ColorPicker.SelectionType.colorBucket),
                stroke: 2,
                thickness: 1,
                center: new Point2D(1080 / 2, 1920 / 2),
                numberOfSpokes: new Range(15, 30),
                sparsityFactor: [12],
                arcSteps: new Range(15, 30),
                innerRadius: 50,
                outerRadius: 300,
                possibleJumpRangeInPixels: new Range(5, 15),
                lineLength: new Range(40, 60),
                numberOfLoops: new Range(1, 1),
                accentRange: new DynamicRange(new Range(1, 1), new Range(2, 3)),
                blurRange: new DynamicRange(new Range(1, 1), new Range(1, 1)),
                featherTimes: new Range(1, 2),
            }
        },
        {
            name: 'classic-curved-eye',
            effect: 'curved-red-eye',
            percentChance: 100,
            currentEffectConfig: {
                layerOpacity: 0.55,
                underLayerOpacity: 0.75,
                innerColor: new ColorPicker(ColorPicker.SelectionType.neutralBucket),
                outerColor: new ColorPicker(ColorPicker.SelectionType.colorBucket),
                stroke: 2,
                thickness: 1,
                center: new Point2D(1080 / 2, 1920 / 2),
                numberOfSpokes: new Range(20, 100),
                sparsityFactor: [12],
                arcSteps: new Range(20, 50),
                innerRadius: 75,
                outerRadius: 450,
                possibleJumpRangeInPixels: new Range(10, 30),
                lineLength: new Range(50, 75),
                numberOfLoops: new Range(1, 1),
                accentRange: new DynamicRange(new Range(1, 1), new Range(3, 6)),
                blurRange: new DynamicRange(new Range(1, 1), new Range(1, 1)),
                featherTimes: new Range(2, 4),
            }
        },
        {
            name: 'complex-curved-eye',
            effect: 'curved-red-eye',
            percentChance: 100,
            currentEffectConfig: {
                layerOpacity: 0.7,
                underLayerOpacity: 0.85,
                innerColor: new ColorPicker(ColorPicker.SelectionType.neutralBucket),
                outerColor: new ColorPicker(ColorPicker.SelectionType.colorBucket),
                stroke: 3,
                thickness: 2,
                center: new Point2D(1080 / 2, 1920 / 2),
                numberOfSpokes: new Range(100, 200),
                sparsityFactor: [8, 12, 16],
                arcSteps: new Range(40, 80),
                innerRadius: 100,
                outerRadius: 600,
                possibleJumpRangeInPixels: new Range(15, 50),
                lineLength: new Range(75, 125),
                numberOfLoops: new Range(1, 2),
                accentRange: new DynamicRange(new Range(2, 3), new Range(6, 10)),
                blurRange: new DynamicRange(new Range(1, 2), new Range(2, 3)),
                featherTimes: new Range(4, 8),
            }
        }
    ];

    constructor({
                    name = CurvedRedEyeEffect._name_,
                    requiresLayer = true,
                    config = new CurvedRedEyeConfig({}),
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

    randomStep() {
        return getRandomIntInclusive(this.config.possibleJumpRangeInPixels.lower, this.config.possibleJumpRangeInPixels.upper);
    }

    polarToXY(r, angle) {
        return {
            x: this.data.center.x + r * Math.cos(angle),
            y: this.data.center.y + r * Math.sin(angle)
        };
    }

    distance(p1, p2) {
        return Math.hypot(p2.x - p1.x, p2.y - p1.y);
    }

    getPathSegment(points, length, lineLength, numberOfLoops, frame, totalFrames) {
        const progress = (frame / totalFrames) * numberOfLoops;
        const startLen = (progress * length) % length;
        const endLen = (startLen + lineLength) % length;

        const draw = (sLen, eLen) => {
            let pathLength = 0;
            let d = "";
            let started = false;

            for (let i = 1; i < points.length; i++) {
                const p0 = points[i - 1];
                const p1 = points[i];
                const segLen = this.distance(p0, p1);
                const segStart = pathLength;
                const segEnd = pathLength + segLen;

                if (segEnd < sLen || segStart > eLen) {
                    pathLength += segLen;
                    continue;
                }

                const drawFrom = Math.max(sLen, segStart);
                const drawTo = Math.min(eLen, segEnd);
                const fromT = (drawFrom - segStart) / segLen;
                const toT = (drawTo - segStart) / segLen;

                const fromX = p0.x + (p1.x - p0.x) * fromT;
                const fromY = p0.y + (p1.y - p0.y) * fromT;
                const toX = p0.x + (p1.x - p0.x) * toT;
                const toY = p0.y + (p1.y - p0.y) * toT;

                if (!started) {
                    d += `M ${fromX} ${fromY} `;
                    started = true;
                }
                d += `L ${toX} ${toY} `;
                pathLength += segLen;
            }

            return d;
        };

        if (startLen < endLen) {
            return draw(startLen, endLen);
        } else {
            return draw(startLen, length) + draw(0, endLen);
        }
    }

    #generate(settings) {
        const data = {
            height: this.finalSize.height,
            width: this.finalSize.width,
            invertLayers: this.config.invertLayers,
            layerOpacity: this.config.layerOpacity,
            underLayerOpacity: this.config.underLayerOpacity,
            stroke: this.config.stroke,
            thickness: this.config.thickness,
            numberOfLoops: getRandomIntInclusive(this.config.numberOfLoops.lower, this.config.numberOfLoops.upper),
            accentRange: {
                lower: getRandomIntInclusive(this.config.accentRange.bottom.lower, this.config.accentRange.bottom.upper),
                upper: getRandomIntInclusive(this.config.accentRange.top.lower, this.config.accentRange.top.upper),
            },
            blurRange: {
                lower: getRandomIntInclusive(this.config.blurRange.bottom.lower, this.config.blurRange.bottom.upper),
                upper: getRandomIntInclusive(this.config.blurRange.top.lower, this.config.blurRange.top.upper),
            },
            featherTimes: getRandomIntInclusive(this.config.featherTimes.lower, this.config.featherTimes.upper),
            center: this.config.center,
            sparsityFactor: getRandomFromArray(this.config.sparsityFactor),
            numberOfSpokes: getRandomIntInclusive(this.config.numberOfSpokes.lower, this.config.numberOfSpokes.upper),
            arcSteps: getRandomIntInclusive(this.config.arcSteps.lower, this.config.arcSteps.upper),
            innerRadius: this.config.innerRadius,
            outerRadius: this.config.outerRadius,
        };

        this.data = data;

        const precomputePaths = () => {

            const paths = [];

            for (let i = 0; i < this.data.numberOfSpokes; i++) {
                const baseAngle = (2 * Math.PI / this.data.numberOfSpokes) * i;
                let radius = this.data.innerRadius;
                let angle = baseAngle;
                const points = [this.polarToXY(radius, angle)];

                while (radius < this.data.outerRadius) {
                    radius += this.randomStep();
                    points.push(this.polarToXY(radius, angle));

                    const circumference = 2 * Math.PI * radius;
                    const arcLen = (circumference / this.data.sparsityFactor) * (0.5 + Math.random() * 0.4);
                    const arcAngle = arcLen / radius;
                    const direction = Math.random() < 0.5 ? -1 : 1;
                    const newAngle = angle + arcAngle * direction;

                    for (let j = 1; j <= this.data.arcSteps; j++) {
                        const t = j / this.data.arcSteps;
                        const a = angle + t * (newAngle - angle);
                        points.push(this.polarToXY(radius, a));
                    }

                    angle = newAngle;
                    radius += this.randomStep();
                    points.push(this.polarToXY(radius, angle));
                }

                let totalLength = 0;
                for (let j = 1; j < points.length; j++) {
                    totalLength += this.distance(points[j - 1], points[j]);
                }

                paths.push({
                    points,
                    length: totalLength,
                    lineLength: getRandomIntInclusive(this.config.lineLength.lower, this.config.lineLength.upper),
                    numberOfLoops: getRandomIntInclusive(this.config.numberOfLoops.lower, this.config.numberOfLoops.upper),
                    innerColor: this.config.innerColor?.getColor(settings) ?? settings.getNeutralFromBucket(),
                    outerColor: this.config.outerColor?.getColor(settings) ?? settings.getColorFromBucket(),
                });
            }

            return paths;
        }

        this.data.paths = precomputePaths();
    }

    async drawSegment(context, pathSegment, thickness, innerColor, stroke, outerColor) {
        const canvas = await Canvas2dFactory.getNewCanvas(context.data.width, context.data.height);
        await canvas.drawPath(pathSegment, thickness, innerColor, stroke, outerColor)
        return canvas;
    }

    async invoke(layer, currentFrame, numberOfFrames) {

        const context = {
            currentFrame,
            numberOfFrames,
            theAccentGaston: findValue(this.data.accentRange.lower, this.data.accentRange.upper, this.data.featherTimes, numberOfFrames, currentFrame),
            theBlurGaston: Math.ceil(findValue(this.data.blurRange.lower, this.data.blurRange.upper, this.data.featherTimes, numberOfFrames, currentFrame)),
            data: this.data,
        };

        for (const {points, length, innerColor, outerColor, lineLength, numberOfLoops} of context.data.paths) {

            const d = this.getPathSegment(points, length, lineLength, numberOfLoops, currentFrame, numberOfFrames);
            if (!d.trim()) continue;

            const underlayCanvas = await this.drawSegment(context, d, context.data.thickness, innerColor, context.data.stroke + context.theAccentGaston, outerColor);
            const underlayLayer = await underlayCanvas.convertToLayer();

            // layer
            const layerCanvas = await this.drawSegment(context, d, context.data.thickness, innerColor, context.data.stroke, outerColor);
            const topLayer = await layerCanvas.convertToLayer();

            await underlayLayer.blur(context.theBlurGaston);

            await underlayLayer.adjustLayerOpacity(context.data.underLayerOpacity);
            await topLayer.adjustLayerOpacity(context.data.layerOpacity);

            if (!context.data.invertLayers) {
                await layer.compositeLayerOver(underlayLayer);
                await layer.compositeLayerOver(topLayer);
            } else {
                await layer.compositeLayerOver(topLayer);
                await layer.compositeLayerOver(underlayLayer);
            }
        }

        await super.invoke(layer, currentFrame, numberOfFrames);
    }

    getInfo() {
        const avgLineLength = this.data.paths ?
            Math.round(this.data.paths.reduce((sum, path) => sum + path.lineLength, 0) / this.data.paths.length) :
            'calculating';
        const avgLoops = this.data.paths ?
            Math.round(this.data.paths.reduce((sum, path) => sum + path.numberOfLoops, 0) / this.data.paths.length) :
            'calculating';

        return `${this.name}: ${this.data.numberOfSpokes} spokes, line: ${avgLineLength}px, loops: ${avgLoops}x, blur: ${this.data.blurRange.lower}-${this.data.blurRange.upper}px (${this.data.featherTimes} times)`;
    }
}
