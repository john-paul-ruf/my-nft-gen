import {LayerEffect} from "../../../core/layer/LayerEffect.js";
import {LayerFactory} from "../../../core/factory/layer/LayerFactory.js";
import {Canvas2dFactory} from "../../../core/factory/canvas/Canvas2dFactory.js";
import {findValue} from "../../../core/math/findValue.js";
import fs from "fs";
import {getRandomIntInclusive, randomId, randomNumber} from "../../../core/math/random.js";
import {Settings} from "../../../core/Settings.js";
import {FuzzyBandConfig} from "./FuzzyBandConfig.js";

export class FuzzyBandEffect extends LayerEffect {

    static _name_ = 'fuzz-bands-mark-two';

    constructor({
                    name = FuzzyBandEffect._name_,
                    requiresLayer = true,
                    config = new FuzzyBandConfig({}),
                    additionalEffects = [],
                    ignoreAdditionalEffects = false,
                    settings = new Settings({})
                }
    ) {
        super({
            name: name,
            requiresLayer: requiresLayer,
            config: config,
            additionalEffects: additionalEffects,
            ignoreAdditionalEffects: ignoreAdditionalEffects,
            settings: settings
        });
        this.#generate(settings);
    }


    async #top(context, i) {
        return new Promise(async (resolve) => {
            let canvas = await Canvas2dFactory.getNewCanvas(context.data.width, context.data.height);

            //draw
            await canvas.drawRing2d(context.data.center, context.data.circles[i].radius, context.data.thickness, context.data.circles[i].innerColor, context.data.stroke, context.data.circles[i].color)
            await canvas.toFile(context.names.layerNames[i]);

            //opacity
            let tempLayer = await LayerFactory.getLayerFromFile(context.names.layerNames[i], this.fileConfig);
            await tempLayer.adjustLayerOpacity(context.data.layerOpacity);

            await tempLayer.toFile(context.names.layerNames[i]);

            resolve();
        });
    }

    async #bottom(context, i) {
        return new Promise(async (resolve) => {
            let canvas = await Canvas2dFactory.getNewCanvas(context.data.width, context.data.height);

            //draw underlay
            const theAccentGaston = findValue(context.data.circles[i].accentRange.lower, context.data.circles[i].accentRange.upper, context.data.circles[i].featherTimes, context.numberOfFrames, context.currentFrame);
            await canvas.drawRing2d(context.data.center, context.data.circles[i].radius, context.data.thickness, context.data.circles[i].innerColor, (context.data.stroke + theAccentGaston), context.data.circles[i].color)
            await canvas.toFile(context.names.underlayNames[i]);

            let underlayLayer = await LayerFactory.getLayerFromFile(context.names.underlayNames[i], this.fileConfig);

            //blur
            const theBlurGaston = Math.ceil(findValue(context.data.circles[i].blurRange.lower, context.data.circles[i].blurRange.upper, context.data.circles[i].featherTimes, context.numberOfFrames, context.currentFrame));
            await underlayLayer.blur(theBlurGaston);

            //opacity
            const theUnderLayerOpacityGaston = findValue(context.data.circles[i].underLayerOpacityRange.lower, context.data.circles[i].underLayerOpacityRange.upper, context.data.circles[i].underLayerOpacityTimes, context.numberOfFrames, context.currentFrame);
            await underlayLayer.adjustLayerOpacity(theUnderLayerOpacityGaston);

            await underlayLayer.toFile(context.names.underlayNames[i], this.fileConfig);

            resolve();
        });
    }

    #buildLayers(context) {
        return new Promise(async (resolve) => {
            const promiseArray = [];

            //draw with top, opacity
            for (let i = 0; i < context.data.numberOfCircles; i++) {
                promiseArray.push(this.#top(context, i));
            }

            //draw underlay, blur, and opacity
            for (let i = 0; i < context.data.numberOfCircles; i++) {
                promiseArray.push(this.#bottom(context, i));
            }

            Promise.all(promiseArray).then(() => {
                resolve();
            });
        });
    }

    async #createThoseFuzzyBands(context) {
        await this.#buildLayers(context);
        //Combine top and bottom layers
        if (!context.data.invertLayers) {
            for (let i = 0; i < context.data.numberOfCircles; i++) {
                let tempUnderlay = await LayerFactory.getLayerFromFile(context.names.underlayNames[i], this.fileConfig);
                await context.layer.compositeLayerOver(tempUnderlay);
                fs.unlinkSync(context.names.underlayNames[i]);
            }

            for (let i = 0; i < context.data.numberOfCircles; i++) {
                let tempLayer = await LayerFactory.getLayerFromFile(context.names.layerNames[i], this.fileConfig);
                await context.layer.compositeLayerOver(tempLayer);
                fs.unlinkSync(context.names.layerNames[i]);
            }

        } else {
            for (let i = 0; i < context.data.numberOfCircles; i++) {
                let tempLayer = await LayerFactory.getLayerFromFile(context.names.layerNames[i], this.fileConfig);
                await context.layer.compositeLayerOver(tempLayer);
                fs.unlinkSync(context.names.layerNames[i]);
            }

            for (let i = 0; i < context.data.numberOfCircles; i++) {
                let tempUnderlay = await LayerFactory.getLayerFromFile(context.names.underlayNames[i], this.fileConfig);
                await context.layer.compositeLayerOver(tempUnderlay);
                fs.unlinkSync(context.names.underlayNames[i]);
            }
        }

    }

    async #fuzzBands(layer, currentFrame, numberOfFrames) {
        const generateNames = (data) => {

            const layerNames = [];
            const underlayNames = [];
            const compositeNames = [];


            for (let index = 0; index < data.numberOfCircles; index++) {
                layerNames.push(this.workingDirectory + 'fuzz' + randomId() + '-layer-' + index.toString() + '.png')
                underlayNames.push(this.workingDirectory + 'fuzz' + randomId() + '-layer-underlay-' + index.toString() + '.png')
                compositeNames.push(this.workingDirectory + 'fuzz' + randomId() + '-layer-comp-' + index.toString() + '.png')
            }

            return {
                layerNames: layerNames,
                underlayNames: underlayNames,
                compositeNames: compositeNames,
            }
        }
        const context = {
            currentFrame: currentFrame,
            numberOfFrames: numberOfFrames,
            names: (generateNames(this.data)),
            data: this.data,
            layer: layer,
        }

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
            center: {x: this.finalSize.width / 2, y: this.finalSize.height / 2},
        }

        const computeInitialInfo = (num) => {
            const info = [];
            for (let i = 0; i <= num; i++) {
                info.push({
                    radius: getRandomIntInclusive(this.config.radius.lower(this.finalSize), this.config.radius.upper(this.finalSize)),
                    color: settings.getColorFromBucket(),
                    innerColor: settings.getNeutralFromBucket(),
                    accentRange: {
                        lower: getRandomIntInclusive(this.config.accentRange.bottom.lower, this.config.accentRange.bottom.upper),
                        upper: getRandomIntInclusive(this.config.accentRange.top.lower, this.config.accentRange.top.upper)
                    },
                    blurRange: {
                        lower: getRandomIntInclusive(this.config.blurRange.bottom.lower, this.config.blurRange.bottom.upper),
                        upper: getRandomIntInclusive(this.config.blurRange.top.lower, this.config.blurRange.top.upper)
                    },
                    featherTimes: getRandomIntInclusive(this.config.featherTimes.lower, this.config.featherTimes.upper),
                    underLayerOpacityRange: {
                        lower: randomNumber(this.config.underLayerOpacityRange.bottom.lower, this.config.underLayerOpacityRange.bottom.upper),
                        upper: randomNumber(this.config.underLayerOpacityRange.top.lower, this.config.underLayerOpacityRange.top.upper)
                    },
                    underLayerOpacityTimes: getRandomIntInclusive(this.config.underLayerOpacityTimes.lower, this.config.underLayerOpacityTimes.upper),
                });
            }
            return info;
        }

        data.circles = computeInitialInfo(data.numberOfCircles);

        this.data = data;
    }

    async invoke(layer, currentFrame, numberOfFrames) {
        await this.#fuzzBands(layer, currentFrame, numberOfFrames);
        await super.invoke(layer, currentFrame, numberOfFrames);
    }

    getInfo() {
        return `${this.name}: ${this.data.numberOfCircles} fuzzy bands`
    }
}




