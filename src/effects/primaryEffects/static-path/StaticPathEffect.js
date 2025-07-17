import {promises as fs} from 'fs';
import {LayerEffect} from '../../../core/layer/LayerEffect.js';
import {LayerFactory} from '../../../core/factory/layer/LayerFactory.js';
import {Canvas2dFactory} from '../../../core/factory/canvas/Canvas2dFactory.js';
import {getRandomFromArray, getRandomIntInclusive, randomId} from '../../../core/math/random.js';
import {findValue} from '../../../core/math/findValue.js';
import {findPointByAngleAndCircle} from '../../../core/math/drawingMath.js';
import {Settings} from '../../../core/Settings.js';
import {StaticPathConfig} from './StaticPathConfig.js';
import {distanceBetweenTwoPoints} from '../../../core/math/distanceBetweenTwoPoints.js';
import {findPointByDistanceBetweenTwoPoints} from '../../../core/math/findPointByDistanceBetweenTwoPoints.js';
import {findOneWayValue} from '../../../core/math/findOneWayValue.js';

export class StaticPathEffect extends LayerEffect {
    static _name_ = 'static-path';

    constructor({
                    name = StaticPathEffect._name_,
                    requiresLayer = true,
                    config = new StaticPathConfig({}),
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

    async #drawNextSegment(context, canvas, isUnderlay, point1, point2, lineStartGaston, lineEndGaston, totalPathLength, currentLineDistance) {
        const stageLength = distanceBetweenTwoPoints(point1, point2);
        let lineFinished = false;

        if (lineStartGaston <= totalPathLength
            && lineEndGaston >= totalPathLength + stageLength) {
            /// ////////////////////////////////////////////////
            // line already start and ends after this segment
            /// ////////////////////////////////////////////////
            await canvas.drawLine2d(
                point1,
                point2,
                context.data.thickness,
                context.data.innerColor,
                isUnderlay ? context.data.stroke + context.theAccentGaston : 0,
                isUnderlay ? context.data.outerColor : context.data.innerColor,
            );
            currentLineDistance += stageLength;
        } else if (lineStartGaston <= totalPathLength
            && lineEndGaston <= totalPathLength + stageLength) {
            /// ////////////////////////////////////////////////
            // line already started and ends in this segment
            /// ////////////////////////////////////////////////
            await canvas.drawLine2d(
                point1,
                findPointByDistanceBetweenTwoPoints(point1, point2, lineEndGaston - totalPathLength),
                context.data.thickness,
                context.data.innerColor,
                isUnderlay ? context.data.stroke + context.theAccentGaston : 0,
                isUnderlay ? context.data.outerColor : context.data.innerColor,
            );

            lineFinished = true;
        } else if (lineStartGaston >= totalPathLength
            && lineStartGaston <= totalPathLength + stageLength
            && lineEndGaston >= totalPathLength + stageLength) {
            /// ////////////////////////////////////////////////
            // line starts in this segment and ends after this segment
            /// ////////////////////////////////////////////////
            const newDistance = lineStartGaston - totalPathLength;
            await canvas.drawLine2d(
                findPointByDistanceBetweenTwoPoints(point1, point2, newDistance),
                point2,
                context.data.thickness,
                context.data.innerColor,
                isUnderlay ? context.data.stroke + context.theAccentGaston : 0,
                isUnderlay ? context.data.outerColor : context.data.innerColor,
            );

            currentLineDistance += newDistance;
        } else if (lineStartGaston >= totalPathLength
            && lineStartGaston <= totalPathLength + stageLength
            && lineEndGaston <= totalPathLength + stageLength) {
            /// ////////////////////////////////////////////////
            // line starts and ends in this segment
            /// ////////////////////////////////////////////////
            const newDistance = lineStartGaston - totalPathLength;
            await canvas.drawLine2d(
                findPointByDistanceBetweenTwoPoints(point1, point2, newDistance),
                findPointByDistanceBetweenTwoPoints(point1, point2, lineEndGaston - totalPathLength),
                context.data.thickness,
                context.data.innerColor,
                isUnderlay ? context.data.stroke + context.theAccentGaston : 0,
                isUnderlay ? context.data.outerColor : context.data.innerColor,
            );

            lineFinished = true;
        }

        return {
            totalPathLength: totalPathLength + stageLength,
            lineFinished,
            currentLineDistance,
        };
    }

    async #drawStaticPath(context, isUnderlay) {
        const canvas = await Canvas2dFactory.getNewCanvas(context.data.width, context.data.height);

        const lineStartGaston = findOneWayValue(0, context.data.path.pathLength, context.data.numberOfLoops, context.numberOfFrames, context.currentFrame);
        const lineEndGaston = lineStartGaston + context.data.path.lineLength;

        function computeCumulativeDistances(points) {
            if (!Array.isArray(points) || points.length === 0) return [0]; // Handle empty input

            let distances = [0];

            for (let i = 1; i < points.length; i++) {
                let {x: x1, y: y1} = points[i - 1] || {};
                let {x: x2, y: y2} = points[i] || {};

                // Ensure x1, y1, x2, y2 are valid numbers
                if (isNaN(x1) || isNaN(y1) || isNaN(x2) || isNaN(y2)) {
                    throw new Error(`Invalid point at index ${i}: ${JSON.stringify(points[i])}`);
                }

                let dx = x2 - x1;
                let dy = y2 - y1;
                distances.push(distances[distances.length - 1] + Math.hypot(dx, dy));
            }

            return distances;
        }

        function binarySearch(arr, target) {
            let left = 0, right = arr.length - 1;
            while (left < right) {
                let mid = Math.floor((left + right) / 2);
                if (arr[mid] < target) left = mid + 1;
                else right = mid;
            }
            return left;
        }

        function interpolatePoint(p1, p2, d1, d2, target) {
            let t = (target - d1) / (d2 - d1);
            return {
                x: p1.x + t * (p2.x - p1.x),
                y: p1.y + t * (p2.y - p1.y)
            };
        }

        function extractSegment(points, distances, startDist, stopDist) {
            let segment = [];

            // Find start and stop indices
            let startIdx = binarySearch(distances, startDist);
            let stopIdx = binarySearch(distances, stopDist);

            // Interpolate start point if necessary
            if (startIdx > 0 || distances[startIdx] > startDist) {
                segment.push(interpolatePoint(
                    points[startIdx - 1], points[startIdx],
                    distances[startIdx - 1], distances[startIdx],
                    startDist
                ));
            }

            // If the path has only two points, extract only the needed segment
            if (points.length === 2) {
                segment.push(
                    interpolatePoint(points[0], points[1], distances[0], distances[1], startDist),
                    interpolatePoint(points[0], points[1], distances[0], distances[1], stopDist)
                );
                return segment;
            }

            // Add full points within the range
            for (let i = startIdx; i < stopIdx; i++) {
                segment.push(points[i]);
            }

            // Interpolate stop point if necessary
            if (stopIdx < points.length && distances[stopIdx] > stopDist) {
                segment.push(interpolatePoint(
                    points[stopIdx - 1], points[stopIdx],
                    distances[stopIdx - 1], distances[stopIdx],
                    stopDist
                ));
            }

            return segment;
        }

        let distances = computeCumulativeDistances(context.data.path.path);
        let segment = extractSegment(context.data.path.path, distances, lineStartGaston, lineEndGaston);

        for (let i = 0; i < segment.length - 1; i++) {
            await canvas.drawLine2d(
                segment[i],
                segment[i + 1],
                context.data.thickness,
                isUnderlay ? context.data.outerColor : context.data.innerColor,
                isUnderlay ? context.data.stroke + context.theAccentGaston : 0,
                isUnderlay ? context.data.outerColor : context.data.innerColor,
            );
        }

        return canvas;
    }

    async #staticPath(layer, currentFrame, numberOfFrames) {
        const context = {
            currentFrame,
            numberOfFrames,
            theAccentGaston: findValue(this.data.accentRange.lower, this.data.accentRange.upper, this.data.featherTimes, numberOfFrames, currentFrame),
            theBlurGaston: Math.ceil(findValue(this.data.blurRange.lower, this.data.blurRange.upper, this.data.featherTimes, numberOfFrames, currentFrame)),
            data: this.data,
            layer,
        };

        const underlayCanvas = await this.#drawStaticPath(context, true);
        const underlayLayer = await underlayCanvas.convertToLayer();

        // layer
        const layerCanvas = await this.#drawStaticPath(context, false);
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

    #generate(settings) {
        const data = {
            height: this.finalSize.height,
            width: this.finalSize.width,
            invertLayers: this.config.invertLayers,
            layerOpacity: this.config.layerOpacity,
            underLayerOpacity: this.config.underLayerOpacity,
            innerColor: this.config.innerColor?.getColor(settings) ?? settings.getNeutralFromBucket(),
            outerColor: this.config.outerColor?.getColor(settings) ?? settings.getColorFromBucket(),
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
        };

        const getPathLength = (path) => {
            let totalPathLength = 0;
            for (let i = 0; i < path.length - 1; i++) {
                totalPathLength += distanceBetweenTwoPoints(path[i], path[i + 1]);
            }
            return totalPathLength;
        };

        data.path = {
            path: this.config.path,
            pathLength: getPathLength(this.config.path),
            lineLength: getRandomIntInclusive(this.config.lineLength.lower, this.config.lineLength.upper),
        }

        this.data = data;
    }

    async invoke(layer, currentFrame, numberOfFrames) {
        await this.#staticPath(layer, currentFrame, numberOfFrames);
        await super.invoke(layer, currentFrame, numberOfFrames);
    }

    getInfo() {
        return `${this.name}`;
    }
}
