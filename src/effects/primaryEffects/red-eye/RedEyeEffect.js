import {LayerEffect} from "../../../core/layer/LayerEffect.js";
import {LayerFactory} from "../../../core/factory/layer/LayerFactory.js";
import {Canvas2dFactory} from "../../../core/factory/canvas/Canvas2dFactory.js";
import {getRandomFromArray, getRandomIntInclusive, randomId} from "../../../core/math/random.js";
import {findValue} from "../../../core/math/findValue.js";
import {promises as fs} from 'fs'
import {findPointByAngleAndCircle} from "../../../core/math/drawingMath.js";
import {Settings} from "../../../core/Settings.js";
import {RedEyeConfig} from "./RedEyeConfig.js";
import {distanceBetweenTwoPoints} from "../../../core/math/distanceBetweenTwoPoints.js";
import {findPointByDistanceBetweenTwoPoints} from "../../../core/math/findPointByDistanceBetweenTwoPoints.js";
import {findOneWayValue} from "../../../core/math/findOneWayValue.js";

export class RedEyeEffect extends LayerEffect {

    static _name_ = 'red-eye'

    constructor({
                    name = RedEyeEffect._name_,
                    requiresLayer = true,
                    config = new RedEyeConfig({}),
                    additionalEffects = [],
                    ignoreAdditionalEffects = false,
                    settings = new Settings({})
                }) {
        super({
            name: name,
            requiresLayer: requiresLayer,
            config: config,
            additionalEffects: additionalEffects,
            ignoreAdditionalEffects: ignoreAdditionalEffects,
            settings: settings
        });
        this.#generate(settings)
    }

    async #drawNextSegment(context, canvas, isUnderlay, point1, point2, lineStartGaston, lineEndGaston, totalPathLength, currentLineDistance) {
        const stageLength = distanceBetweenTwoPoints(point1, point2);
        let lineFinished = false;

        if (lineStartGaston <= totalPathLength
            && lineEndGaston >= totalPathLength + stageLength) {
            ///////////////////////////////////////////////////
            //line already start and ends after this segment
            ///////////////////////////////////////////////////
            await canvas.drawLine2d(
                point1,
                point2,
                context.data.thickness,
                context.data.innerColor,
                context.data.thickness + isUnderlay ? context.data.stroke : 0,
                context.data.outerColor);
            currentLineDistance += stageLength;

        } else if (lineStartGaston <= totalPathLength
            && lineEndGaston <= totalPathLength + stageLength) {
            ///////////////////////////////////////////////////
            //line already started and ends in this segment
            ///////////////////////////////////////////////////
            await canvas.drawLine2d(
                point1,
                findPointByDistanceBetweenTwoPoints(point1, point2, lineEndGaston - totalPathLength),
                context.data.thickness,
                context.data.innerColor,
                context.data.thickness + isUnderlay ? context.data.stroke : 0,
                context.data.outerColor);

            lineFinished = true;
        } else if (lineStartGaston >= totalPathLength
            && lineStartGaston <= totalPathLength + stageLength
            && lineEndGaston >= totalPathLength + stageLength) {
            ///////////////////////////////////////////////////
            //line starts in this segment and ends after this segment
            ///////////////////////////////////////////////////
            const newDistance = lineStartGaston - totalPathLength;
            await canvas.drawLine2d(
                findPointByDistanceBetweenTwoPoints(point1, point2, newDistance),
                point2,
                context.data.thickness,
                context.data.innerColor,
                context.data.thickness + isUnderlay ? context.data.stroke : 0,
                context.data.outerColor);

            currentLineDistance += newDistance;
        } else if (lineStartGaston >= totalPathLength
            && lineStartGaston <= totalPathLength + stageLength
            && lineEndGaston <= totalPathLength + stageLength) {
            ///////////////////////////////////////////////////
            //line starts and ends in this segment
            ///////////////////////////////////////////////////
            const newDistance = lineStartGaston - totalPathLength;
            await canvas.drawLine2d(
                findPointByDistanceBetweenTwoPoints(point1, point2, newDistance),
                findPointByDistanceBetweenTwoPoints(point1, point2, lineEndGaston - totalPathLength),
                context.data.thickness,
                context.data.innerColor,
                context.data.thickness + isUnderlay ? context.data.stroke : 0,
                context.data.outerColor);

            lineFinished = true;
        }

        return {
            totalPathLength: totalPathLength + stageLength,
            lineFinished: lineFinished,
            currentLineDistance: currentLineDistance
        }
    }

    async #drawRedEye(context, pathIndex, isUnderlay) {

        const canvas = await Canvas2dFactory.getNewCanvas(context.data.width, context.data.height);

        let totalPathLength = 0;
        let currentLineDistance = 0;
        let lineFinished = false

        while (!lineFinished) {
            for (let i = 0; i < context.data.pathsArray[pathIndex].path.length; i++) {

                const node = context.data.pathsArray[pathIndex].path[i]

                const lineStartGaston = findOneWayValue(0, context.data.pathsArray[pathIndex].pathLength + context.data.lineLength, context.data.numberOfLoops, context.numberOfFrames, context.currentFrame);
                const lineEndGaston = lineStartGaston + context.data.lineLength;

                let results = await this.#drawNextSegment(
                    context,
                    canvas,
                    isUnderlay,
                    node.linePoint1.point,
                    node.linePoint2.point,
                    lineStartGaston,
                    lineEndGaston,
                    totalPathLength,
                    currentLineDistance
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
                    currentLineDistance
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
            currentFrame: currentFrame,
            numberOfFrames: numberOfFrames,
            overlayName: this.workingDirectory + 'red-eye' + randomId() + '.png',
            underlayName: this.workingDirectory + 'red-eye-underlay' + randomId() + '.png',
            theAccentGaston: findValue(this.data.accentRange.lower, this.data.accentRange.upper, this.data.featherTimes, numberOfFrames, currentFrame),
            data: this.data,
            layer: layer,
        }

        for (let i = 0; i < context.data.pathsArray.length; i++) {
            //underlay
            const underlay = await this.#drawRedEye(context, i, true)
            await underlay.toFile(context.underlayName);
            const underlayLayer = await LayerFactory.getLayerFromFile(context.underlayName, this.fileConfig);
            const theBlurGaston = Math.ceil(findValue(context.data.blurRange.lower, context.data.blurRange.upper, context.data.featherTimes, context.numberOfFrames, context.currentFrame))
            await underlayLayer.blur(theBlurGaston);
            await underlayLayer.adjustLayerOpacity(context.data.underLayerOpacity);

            //layer
            const overlay = await this.#drawRedEye(context, i, false)
            await overlay.toFile(context.overlayName);
            const overlayLayer = await LayerFactory.getLayerFromFile(context.overlayName, this.fileConfig);
            await overlayLayer.adjustLayerOpacity(context.data.layerOpacity);


            if (!context.data.invertLayers) {
                await context.layer.compositeLayerOver(underlayLayer);
                await context.layer.compositeLayerOver(overlayLayer);
            } else {
                await context.layer.compositeLayerOver(overlayLayer);
                await context.layer.compositeLayerOver(underlayLayer);
            }

            await fs.unlink(context.underlayName);
            await fs.unlink(context.overlayName);
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
            numberOfSegments: this.config.numberOfSegments,
            lineLength: getRandomIntInclusive(this.config.lineLength.lower, this.config.lineLength.upper),
            numberOfLoops: getRandomIntInclusive(this.config.numberOfLoops.lower, this.config.numberOfLoops.upper),
            accentRange: {
                lower: getRandomIntInclusive(this.config.accentRange.bottom.lower, this.config.accentRange.bottom.upper),
                upper: getRandomIntInclusive(this.config.accentRange.top.lower, this.config.accentRange.top.upper)
            },
            blurRange: {
                lower: getRandomIntInclusive(this.config.blurRange.bottom.lower, this.config.blurRange.bottom.upper),
                upper: getRandomIntInclusive(this.config.blurRange.top.lower, this.config.blurRange.top.upper)
            },
            featherTimes: getRandomIntInclusive(this.config.featherTimes.lower, this.config.featherTimes.upper)
        }

        const generatePath = (data, startAngle) => {

            const endAngle = startAngle + data.sparsityFactor;
            const midPoint = startAngle + (data.sparsityFactor / 2);
            const pathArray = [];
            let angle = endAngle;
            let currentLength = data.innerRadius;

            while (currentLength < data.outerRadius) {

                const linePoint1 = {
                    point: findPointByAngleAndCircle(data.center, angle, currentLength),
                    angle: angle,
                    radius: currentLength
                }

                currentLength += getRandomIntInclusive(this.config.possibleJumpRangeInPixels.lower, this.config.possibleJumpRangeInPixels.upper);

                const linePoint2 = {
                    point: findPointByAngleAndCircle(data.center, angle, currentLength),
                    angle: angle,
                    radius: currentLength
                }

                angle = getRandomIntInclusive(startAngle, endAngle);

                const arcPoint = {
                    point: findPointByAngleAndCircle(data.center, angle, currentLength),
                    angle: angle,
                    radius: currentLength
                }

                const node = {
                    linePoint1: linePoint1,
                    linePoint2: linePoint2,
                    arcPoint: arcPoint,
                }
                pathArray.push(node);
            }

            return pathArray;
        }

        const getPathArray = (numberOfPaths) => {

            const info = [];

            const getPathLength = (path) => {
                let totalPathLength = 0
                for (let i = 0; i < path.length - 1; i++) {
                    totalPathLength += distanceBetweenTwoPoints(path[i].linePoint1.point, path[i].linePoint2.point);
                    totalPathLength += distanceBetweenTwoPoints(path[i].linePoint2.point, path[i].arcPoint.point);
                }
                return totalPathLength;
            }

            for (let i = 0; i < 360; i += numberOfPaths) {
                const path = generatePath(data, i);
                info.push({
                    path: path,
                    pathLength: getPathLength(path),
                    lineLength: getRandomIntInclusive(this.config.lineLength.lower, this.config.lineLength.upper),
                });
            }

            return info;
        }

        data.pathsArray = getPathArray(data.sparsityFactor);

        this.data = data;
    }

    async invoke(layer, currentFrame, numberOfFrames) {
        await this.#redEye(layer, currentFrame, numberOfFrames);
        await super.invoke(layer, currentFrame, numberOfFrames);
    }

    getInfo() {
        return `${this.name}: ${this.data.sparsityFactor} sparsity factor`
    }


}




