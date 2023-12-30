import {LayerEffect} from "../../LayerEffect.js";
import {getRandomFromArray, getRandomIntInclusive, randomId} from "../../../core/math/random.js";
import {LayerFactory} from "../../../core/factory/layer/LayerFactory.js";
import {Canvas2dFactory} from "../../../core/factory/canvas/Canvas2dFactory.js";
import {findValue} from "../../../core/math/findValue.js";
import fs from "fs";
import {findOneWayValue} from "../../../core/math/findOneWayValue.js";
import {Settings} from "../../../core/Settings.js";

export class RayRingEffect extends LayerEffect {

    static _name_ = 'ray-rings';

    static _config_  = {
        layerOpacity: 1,
        underLayerOpacity: 0.8,
        circles: {lower: 4, upper: 8},
        radiusInitial: 300,
        radiusGap: 60,
        stroke: 1,
        thickness: 1,
        rayStroke: 1,
        rayThickness: 1,
        scaleFactor: 1.25,
        densityFactor: 1.75,
        accentRange: {bottom: {lower: 0, upper: 0}, top: {lower: 3, upper: 6}},
        blurRange: {bottom: {lower: 0, upper: 0}, top: {lower: 1, upper: 3}},
        featherTimes: {lower: 2, upper: 4},
        lengthRange: {bottom: {lower: 5, upper: 15}, top: {lower: 20, upper: 50}}, //when spin enabled, length must be at 0 or glitches the loop
        lengthTimes: {lower: 2, upper: 6},
        sparsityFactor: [1, 2, 3,],
        speed: {lower: 0, upper: 0},
    }

    constructor({
                    name = RayRingEffect._name_,
                    requiresLayer = true,
                    config = RayRingEffect._config_,
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


    async #drawRayRingInstance(withAccentGaston, i, context) {
        const theAccentGaston = withAccentGaston ? findValue(context.data.circles[i].accentRange.lower, context.data.circles[i].accentRange.upper, context.data.circles[i].featherTimes, context.numberOfFrames, context.currentFrame) : 0;
        const invertTheRayGaston = (i + 1) % 2;
        const theRayGaston = findOneWayValue(0, context.data.circles[i].sparsityFactor * context.data.circles[i].speed, context.numberOfFrames, context.currentFrame);

        await context.canvas.drawRing2d(
            context.data.center,
            context.data.circles[i].radius,
            context.data.thickness,
            context.data.circles[i].color,
            (context.data.stroke + theAccentGaston),
            context.data.circles[i].outerColor
        )

        let rayIndex = 0;
        for (let a = 0; a < 360; a = a + context.data.circles[i].sparsityFactor) {
            const theLengthGaston = findValue(context.data.circles[i].rays[rayIndex].length.lower, context.data.circles[i].rays[rayIndex].length.upper, context.data.circles[i].rays[rayIndex].lengthTimes, context.numberOfFrames, context.currentFrame);
            const theFinalAngle = invertTheRayGaston === 0 ? (a + theRayGaston) % 360 : (a - theRayGaston) % 360;

            await context.canvas.drawRay2d(
                context.data.center,
                theFinalAngle,
                context.data.circles[i].radius + ((context.data.thickness + context.data.stroke) / 2),
                theLengthGaston,
                context.data.rayThickness,
                context.data.circles[i].color,
                (context.data.rayStroke + theAccentGaston),
                context.data.circles[i].outerColor
            );

            rayIndex++;
        }
    }

    async #draw(context, filename) {
        for (let i = 0; i < context.data.numberOfCircles; i++) {
            await this.#drawRayRingInstance(context.useAccentGaston, i, context);
        }
        await context.canvas.toFile(filename);
    }

    async #compositeImage(context, layer) {
        let tempLayer = await LayerFactory.getLayerFromFile(context.drawing, this.fileConfig);
        let underlayLayer = await LayerFactory.getLayerFromFile(context.underlayName, this.fileConfig);

        await underlayLayer.blur(context.theBlurGaston);

        await underlayLayer.adjustLayerOpacity(context.data.underLayerOpacity);
        await tempLayer.adjustLayerOpacity(context.data.layerOpacity);

        await layer.compositeLayerOver(underlayLayer);
        await layer.compositeLayerOver(tempLayer);

    }

    async #processDrawFunction(context) {

        await this.#draw(context, context.underlayName);

        context.useAccentGaston = false;
        context.canvas = await Canvas2dFactory.getNewCanvas(context.data.width, context.data.height);

        await this.#draw(context, context.drawing);
    }

    async #rayRing(layer, currentFrame, numberOfFrames) {

        const context = {
            currentFrame: currentFrame,
            numberOfFrames: numberOfFrames,
            useAccentGaston: true,
            theBlurGaston: Math.ceil(findValue(this.data.blurRange.lower, this.data.blurRange.upper, this.data.featherTimes, numberOfFrames, currentFrame)),
            drawing: this.workingDirectory + 'ray-ring' + randomId() + '.png',
            underlayName: this.workingDirectory + 'ray-ring-underlay' + randomId() + '.png',
            canvas: await Canvas2dFactory.getNewCanvas(this.data.width, this.data.height),
            data: this.data
        }

        await this.#processDrawFunction(context);
        await this.#compositeImage(context, layer);

        fs.unlinkSync(context.drawing);
        fs.unlinkSync(context.underlayName);

    }

    #generate(settings) {
        const data = {
            layerOpacity: this.config.layerOpacity,
            underLayerOpacity: this.config.underLayerOpacity,
            numberOfCircles: getRandomIntInclusive(this.config.circles.lower, this.config.circles.upper),
            height: this.finalSize.height,
            width: this.finalSize.width,
            stroke: this.config.stroke,
            thickness: this.config.thickness,
            rayStroke: this.config.rayStroke,
            rayThickness: this.config.rayThickness,
            innerColor: settings.getColorFromBucket(),
            scaleFactor: this.config.scaleFactor,
            center: {x: this.finalSize.width / 2, y: this.finalSize.height / 2},
            blurRange: {
                lower: getRandomIntInclusive(this.config.blurRange.bottom.lower, this.config.blurRange.bottom.upper),
                upper: getRandomIntInclusive(this.config.blurRange.top.lower, this.config.blurRange.top.upper)
            },
            getInfo: () => {
            }
        }

        const getRays = (sparsityFactor) => {
            const rays = [];

            for (let i = 0; i < 360; i = i + sparsityFactor) {
                rays.push({
                    length: {
                        lower: getRandomIntInclusive(this.config.lengthRange.bottom.lower, this.config.lengthRange.bottom.upper),
                        upper: getRandomIntInclusive(this.config.lengthRange.top.lower, this.config.lengthRange.top.upper)
                    }, lengthTimes: getRandomIntInclusive(this.config.lengthTimes.lower, this.config.lengthTimes.upper)
                });
            }

            return rays;
        }

        const computeInitialInfo = (num) => {
            const info = [];
            for (let i = 0; i <= num; i++) {
                info.push({
                    radius: this.config.radiusInitial + (this.config.radiusGap * (i + 1)),
                    color: settings.getNeutralFromBucket(),
                    outerColor: settings.getColorFromBucket(),
                    featherTimes: getRandomIntInclusive(this.config.featherTimes.lower, this.config.featherTimes.upper),
                    accentRange: {
                        lower: getRandomIntInclusive(this.config.accentRange.bottom.lower, this.config.accentRange.bottom.upper),
                        upper: getRandomIntInclusive(this.config.accentRange.top.lower, this.config.accentRange.top.upper)
                    },
                    sparsityFactor: getRandomFromArray(this.config.sparsityFactor) * (this.config.densityFactor / (i + 1)),
                    speed: getRandomIntInclusive(this.config.speed.lower, this.config.speed.upper),
                });
            }

            for (let c = 0; c < info.length; c++) {
                info[c].rays = getRays(info[c].sparsityFactor);
            }

            return info;
        }

        data.circles = computeInitialInfo(data.numberOfCircles);

        this.data = data;
    }

    async invoke(layer, currentFrame, numberOfFrames) {
        await this.#rayRing(layer, currentFrame, numberOfFrames);
        await super.invoke(layer, currentFrame, numberOfFrames);
    }

    getInfo() {
        return `${this.name}: ${this.data.numberOfCircles} ray rings`
    }
}




