import {promises as fs} from 'fs';
import {LayerEffect} from '../../../core/layer/LayerEffect.js';
import {LayerFactory} from '../../../core/factory/layer/LayerFactory.js';
import {Canvas2dFactory} from '../../../core/factory/canvas/Canvas2dFactory.js';
import {getRandomFromArray, getRandomIntInclusive, randomId} from '../../../core/math/random.js';
import {findValue} from '../../../core/math/findValue.js';
import {findPointByAngleAndCircle} from '../../../core/math/drawingMath.js';
import {Settings} from '../../../core/Settings.js';
import {CurvedRedEyeConfig} from './CurvedRedEyeConfig.js';
import {distanceBetweenTwoPoints} from '../../../core/math/distanceBetweenTwoPoints.js';
import {findPointByDistanceBetweenTwoPoints} from '../../../core/math/findPointByDistanceBetweenTwoPoints.js';
import {findOneWayValue} from '../../../core/math/findOneWayValue.js';

export class CurvedRedEyeEffect extends LayerEffect {
    static _name_ = 'curved-red-eye';

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
        return `${this.name}`;
    }
}
