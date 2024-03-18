import {LayerEffect} from "../../../core/layer/LayerEffect.js";
import {LayerFactory} from "../../../core/factory/layer/LayerFactory.js";
import {Canvas2dFactory} from "../../../core/factory/canvas/Canvas2dFactory.js";
import {getRandomFromArray, getRandomIntInclusive, randomId, randomNumber} from "../../../core/math/random.js";
import {findValue} from "../../../core/math/findValue.js";
import fs from "fs";
import {findPointByAngleAndCircle} from "../../../core/math/drawingMath.js";
import {Settings} from "../../../core/Settings.js";
import {RedEyeConfig} from "./RedEyeConfig.js";
import {distanceBetweenTwoPoints} from "../../../core/math/distanceBetweenTwoPoints.js";
import {findPointBetweenPointsByDistance} from "../../../core/math/findPointBetweenPointsByDistance.js";

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

    async #drawRedEye(context, pathIndex) {

        const underlay = await Canvas2dFactory.getNewCanvas(context.data.width, context.data.height);

        for (let i = 0; i < context.data.pathsArray[pathIndex].path.length; i++) {
            const node = context.data.pathsArray[pathIndex].path[i];
            await underlay.drawLine2d(
                node.linePoint1.point,
                node.linePoint2.point,
                context.data.thickness,
                context.data.innerColor,
                context.data.thickness + context.data.stroke,
                context.data.outerColor);

            await underlay.drawQuadraticCurveTo2d(
                node.linePoint2.point,
                node.midPoint,
                node.arcPoint.point,
                context.data.thickness,
                context.data.innerColor,
                context.data.thickness + context.data.stroke,
                context.data.outerColor);
        }

        await underlay.toFile(context.underlayName)
    }

    async #redEye(layer, currentFrame, numberOfFrames) {

        const context = {
            currentFrame: currentFrame,
            numberOfFrames: numberOfFrames,
            overlayName: this.workingDirectory + 'red-eye' + randomId() + '.png',
            underlayName: this.workingDirectory + 'red-eye-underlay' + randomId() + '.png',
            data: this.data,
            layer: layer,
        }

        for (let i = 0; i < context.data.pathsArray.length; i++) {
            //underlay

            await this.#drawRedEye(context, i)

            const underlayLayer = await LayerFactory.getLayerFromFile(context.underlayName, this.fileConfig);
            const theBlurGaston = Math.ceil(findValue(context.data.blurRange.lower, context.data.blurRange.upper, context.data.featherTimes, context.numberOfFrames, context.currentFrame))
            await underlayLayer.blur(theBlurGaston);
            await underlayLayer.adjustLayerOpacity(context.data.underLayerOpacity);

            //layer
            /*
            const overlay = await Canvas2dFactory.getNewCanvas(context.data.width, context.data.height);
            await overlay.drawPath2d(this.#subsetPath(, findValue(0, context.data.pathsArray[i].pathLength, context.data.numberOfLoops, context.numberOfFrames, context.currentFrame), context.data.pathsArray[i].lineLength), context.data.thickness, context.data.innerColor, context.data.thickness, context.data.innerColor);
            await overlay.toFile(context.overlayName);
            const overlayLayer = await LayerFactory.getLayerFromFile(context.overlayName, this.fileConfig);
            await overlayLayer.adjustLayerOpacity(context.data.layerOpacity);
*/
            if (!context.data.invertLayers) {
                await context.layer.compositeLayerOver(underlayLayer);
                //await context.layer.compositeLayerOver(overlayLayer);
            } else {
                // await context.layer.compositeLayerOver(overlayLayer);
                await context.layer.compositeLayerOver(underlayLayer);
            }


            fs.unlinkSync(context.underlayName);
            /*  fs.unlinkSync(context.overlayName);*/
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

            const pixelConstant = (data.outerRadius - data.innerRadius) / data.numberOfSegments;

            const pathArray = [];
            let totalJumpCount = 0;

            let angle = endAngle;

            for (let i = 0; i < data.numberOfSegments; i++) {


                const linePoint1 = {
                    point: findPointByAngleAndCircle(data.center, angle, data.innerRadius + (pixelConstant * totalJumpCount)),
                    angle: angle,
                    radius: data.innerRadius + (pixelConstant * totalJumpCount)
                }

                totalJumpCount += getRandomIntInclusive(this.config.possibleJumpRange.lower, this.config.possibleJumpRange.upper);

                const linePoint2 = {
                    point: findPointByAngleAndCircle(data.center, angle, data.innerRadius + (pixelConstant * totalJumpCount)),
                    angle: angle,
                    radius: data.innerRadius + (pixelConstant * totalJumpCount)
                }

               const buffer = i % 2 === 0
                    ? -1 * getRandomIntInclusive(this.config.possibleSideBuffer.lower, this.config.possibleSideBuffer.upper)
                    : getRandomIntInclusive(this.config.possibleSideBuffer.lower, this.config.possibleSideBuffer.upper);

                angle = i % 2 === 0 ? startAngle : endAngle;

                angle = angle + buffer;

                const arcPoint = {
                    point: findPointByAngleAndCircle(data.center, angle, data.innerRadius + (pixelConstant * totalJumpCount)),
                    angle: angle,
                    radius: data.innerRadius + (pixelConstant * totalJumpCount)
                }

                const node = {
                    linePoint1: linePoint1,
                    linePoint2: linePoint2,
                    arcPoint: arcPoint,
                    midPoint:findPointByAngleAndCircle(data.center, midPoint , data.innerRadius + (pixelConstant * totalJumpCount + (pixelConstant/24))),
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
                    totalPathLength += distanceBetweenTwoPoints(path[i], path[i + 1])
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
        return `${this.name}: ${this.data.sparsityFactor} rays`
    }


}




