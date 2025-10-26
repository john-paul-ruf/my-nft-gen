import { promises as fs } from 'fs';
import { LayerEffect } from 'my-nft-gen';
import { LayerFactory } from 'my-nft-gen/src/core/factory/layer/LayerFactory.js';
import { Canvas2dFactory } from 'my-nft-gen/src/core/factory/canvas/Canvas2dFactory.js';
import { getRandomFromArray, getRandomIntInclusive, randomId } from 'my-nft-gen/src/core/math/random.js';
import { findValue } from 'my-nft-gen/src/core/math/findValue.js';
import { findPointByAngleAndCircle } from 'my-nft-gen/src/core/math/drawingMath.js';
import { Settings } from 'my-nft-gen/src/core/Settings.js';
import { RedEyeConfig } from './RedEyeConfig.js';
import { distanceBetweenTwoPoints } from 'my-nft-gen/src/core/math/distanceBetweenTwoPoints.js';
import { findPointByDistanceBetweenTwoPoints } from 'my-nft-gen/src/core/math/findPointByDistanceBetweenTwoPoints.js';
import { findOneWayValue } from 'my-nft-gen/src/core/math/findOneWayValue.js';
import { Position } from 'my-nft-gen/src/core/position/Position.js';
import { ColorPicker } from 'my-nft-gen/src/core/layer/configType/ColorPicker.js';

export class RedEyeEffect extends LayerEffect {
    static _name_ = 'red-eye';
    static configClass = RedEyeConfig;

    static presets = [
        {
            name: 'subtle-red-eye',
            effect: 'red-eye',
            percentChance: 100,
            currentEffectConfig: {
                invertLayers: true,
                layerOpacity: 0.45,
                underLayerOpacity: 0.65,
                center: new Position({x: 1080 / 2, y: 1920 / 2}),
                innerColor: new ColorPicker(ColorPicker.SelectionType.neutralBucket),
                outerColor: new ColorPicker(ColorPicker.SelectionType.colorBucket),
                stroke: 2,
                thickness: 1,
                sparsityFactor: [15],
                innerRadius: 100,
                outerRadius: 350,
                possibleJumpRangeInPixels: { lower: 8, upper: 20 },
                lineLength: { lower: 40, upper: 60 },
                numberOfLoops: { lower: 1, upper: 1 },
                accentRange: { bottom: { lower: 1, upper: 1 }, top: { lower: 2, upper: 4 } },
                blurRange: { bottom: { lower: 1, upper: 1 }, top: { lower: 1, upper: 1 } },
                featherTimes: { lower: 2, upper: 3 },
            }
        },
        {
            name: 'classic-red-eye',
            effect: 'red-eye',
            percentChance: 100,
            currentEffectConfig: {
                invertLayers: true,
                layerOpacity: 0.55,
                underLayerOpacity: 0.75,
                center: new Position({x: 1080 / 2, y: 1920 / 2}),
                innerColor: new ColorPicker(ColorPicker.SelectionType.neutralBucket),
                outerColor: new ColorPicker(ColorPicker.SelectionType.colorBucket),
                stroke: 2,
                thickness: 1,
                sparsityFactor: [12],
                innerRadius: 75,
                outerRadius: 450,
                possibleJumpRangeInPixels: { lower: 10, upper: 30 },
                lineLength: { lower: 50, upper: 75 },
                numberOfLoops: { lower: 1, upper: 1 },
                accentRange: { bottom: { lower: 1, upper: 1 }, top: { lower: 3, upper: 6 } },
                blurRange: { bottom: { lower: 1, upper: 1 }, top: { lower: 1, upper: 1 } },
                featherTimes: { lower: 2, upper: 4 },
            }
        },
        {
            name: 'intense-red-eye',
            effect: 'red-eye',
            percentChance: 100,
            currentEffectConfig: {
                invertLayers: true,
                layerOpacity: 0.65,
                underLayerOpacity: 0.85,
                center: new Position({x: 1080 / 2, y: 1920 / 2}),
                innerColor: new ColorPicker(ColorPicker.SelectionType.neutralBucket),
                outerColor: new ColorPicker(ColorPicker.SelectionType.colorBucket),
                stroke: 3,
                thickness: 2,
                sparsityFactor: [8],
                innerRadius: 50,
                outerRadius: 550,
                possibleJumpRangeInPixels: { lower: 15, upper: 40 },
                lineLength: { lower: 60, upper: 100 },
                numberOfLoops: { lower: 1, upper: 2 },
                accentRange: { bottom: { lower: 2, upper: 2 }, top: { lower: 4, upper: 8 } },
                blurRange: { bottom: { lower: 1, upper: 2 }, top: { lower: 2, upper: 3 } },
                featherTimes: { lower: 3, upper: 6 },
            }
        }
    ];

    constructor({
                    name = RedEyeEffect._name_,
                    requiresLayer = true,
                    config = new RedEyeConfig({}),
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

    async #drawRedEye(context, pathIndex, isUnderlay) {
        const canvas = await Canvas2dFactory.getNewCanvas(context.data.width, context.data.height);

        let totalPathLength = 0;
        let currentLineDistance = 0;
        let lineFinished = false;
        const lineStartGaston = findOneWayValue(0, context.data.pathsArray[pathIndex].pathLength, context.data.numberOfLoops, context.numberOfFrames, context.currentFrame);
        const lineEndGaston = lineStartGaston + context.data.pathsArray[pathIndex].lineLength;

        while (!lineFinished) {
            for (let i = 0; i < context.data.pathsArray[pathIndex].path.length; i++) {
                const node = context.data.pathsArray[pathIndex].path[i];

                let results = await this.#drawNextSegment(
                    context,
                    canvas,
                    isUnderlay,
                    node.linePoint1.point,
                    node.linePoint2.point,
                    lineStartGaston,
                    lineEndGaston,
                    totalPathLength,
                    currentLineDistance,
                );

                totalPathLength = results.totalPathLength;
                currentLineDistance = results.currentLineDistance;
                lineFinished = results.lineFinished;

                if (lineFinished) {
                    break;
                }

                results = await this.#drawNextSegment(
                    context,
                    canvas,
                    isUnderlay,
                    node.linePoint2.point,
                    node.arcPoint.point,
                    lineStartGaston,
                    lineEndGaston,
                    totalPathLength,
                    currentLineDistance,
                );

                totalPathLength = results.totalPathLength;
                currentLineDistance = results.currentLineDistance;
                lineFinished = results.lineFinished;

                if (lineFinished) {
                    break;
                }
            }
        }

        return canvas;
    }

    async #redEye(layer, currentFrame, numberOfFrames) {
        const context = {
            currentFrame,
            numberOfFrames,
            theAccentGaston: findValue(this.data.accentRange.lower, this.data.accentRange.upper, this.data.featherTimes, numberOfFrames, currentFrame),
            theBlurGaston: Math.ceil(findValue(this.data.blurRange.lower, this.data.blurRange.upper, this.data.featherTimes, numberOfFrames, currentFrame)),
            data: this.data,
            layer,
        };

        for (let i = 0; i < context.data.pathsArray.length; i++) {
            const overlayName = `${this.workingDirectory}red-eye${randomId()}.png`;
            const underlayName = `${this.workingDirectory}red-eye-underlay${randomId()}.png`;

            const underlayCanvas = await this.#drawRedEye(context, i, true);
            const underlayLayer = await underlayCanvas.convertToLayer();

            // layer
            const layerCanvas = await this.#drawRedEye(context, i, false);
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
    }

    #generate(settings) {
        const data = {
            height: this.finalSize.height,
            width: this.finalSize.width,
            invertLayers: this.config.invertLayers,
            layerOpacity: this.config.layerOpacity,
            underLayerOpacity: this.config.underLayerOpacity,
            center: this.config.center,
            innerColor: this.config.innerColor?.getColor(settings) ?? settings.getNeutralFromBucket(),
            outerColor: this.config.outerColor?.getColor(settings) ?? settings.getColorFromBucket(),
            stroke: this.config.stroke,
            thickness: this.config.thickness,
            sparsityFactor: getRandomFromArray(this.config.sparsityFactor),
            innerRadius: this.config.innerRadius,
            outerRadius: this.config.outerRadius,
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

        const generatePath = (data, startAngle) => {
            const endAngle = startAngle + data.sparsityFactor;
            const midPoint = startAngle + (data.sparsityFactor / 2);
            const pathArray = [];
            let angle = endAngle;
            let currentLength = data.innerRadius;

            while (currentLength < data.outerRadius) {
                const linePoint1 = {
                    point: findPointByAngleAndCircle(data.center, angle, currentLength),
                    angle,
                    radius: currentLength,
                };

                currentLength += getRandomIntInclusive(this.config.possibleJumpRangeInPixels.lower, this.config.possibleJumpRangeInPixels.upper);

                const linePoint2 = {
                    point: findPointByAngleAndCircle(data.center, angle, currentLength),
                    angle,
                    radius: currentLength,
                };

                angle = getRandomIntInclusive(startAngle, endAngle);

                const arcPoint = {
                    point: findPointByAngleAndCircle(data.center, angle, currentLength),
                    angle,
                    radius: currentLength,
                };

                const node = {
                    linePoint1,
                    linePoint2,
                    arcPoint,
                };
                pathArray.push(node);
            }

            return pathArray;
        };

        const getPathArray = (numberOfPaths) => {
            const info = [];

            const getPathLength = (path) => {
                let totalPathLength = 0;
                for (let i = 0; i < path.length; i++) {
                    totalPathLength += distanceBetweenTwoPoints(path[i].linePoint1.point, path[i].linePoint2.point);
                    totalPathLength += distanceBetweenTwoPoints(path[i].linePoint2.point, path[i].arcPoint.point);
                }
                return totalPathLength;
            };

            for (let i = 0; i < 360; i += numberOfPaths) {
                const path = generatePath(data, i);
                info.push({
                    path,
                    pathLength: getPathLength(path),
                    lineLength: getRandomIntInclusive(this.config.lineLength.lower, this.config.lineLength.upper),
                });
            }

            return info;
        };

        data.pathsArray = getPathArray(data.sparsityFactor);

        this.data = data;
    }

    async invoke(layer, currentFrame, numberOfFrames) {
        await this.#redEye(layer, currentFrame, numberOfFrames);
        await super.invoke(layer, currentFrame, numberOfFrames);
    }

    getInfo() {
        return `${this.name}: ${this.data.sparsityFactor} sparsity factor`;
    }
}
