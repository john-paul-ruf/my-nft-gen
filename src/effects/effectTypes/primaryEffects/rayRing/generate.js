import {getColorFromBucket, getFinalImageSize, getNeutralFromBucket} from "../../../../core/GlobalSettings.js";
import {getRandomFromArray, getRandomIntInclusive} from "../../../../core/math/random.js";
import {rayRingEffect} from "./effect.js";

const finalImageSize = getFinalImageSize();

const config = {
    layerOpacity: 1,
    underLayerOpacity: 0.8,
    circles: {lower: 4, upper: 8},
    radiusGap: 75,
    stroke: 1,
    thickness: 1,
    rayStroke: 1,
    rayThickness: 1,
    scaleFactor: 1.25,
    densityFactor: 1.75,
    accentRange: {bottom: {lower: 0, upper: 0}, top: {lower: 3, upper: 6}},
    blurRange: {bottom: {lower: 0, upper: 0}, top: {lower: 1, upper: 3}},
    featherTimes: {lower: 2, upper: 4},
    lengthRange: {bottom: {lower: 5, upper: 15}, top: {lower: 20, upper: 50}}, //when spin, length must be at 0 or glitches the loop
    lengthTimes: {lower: 2, upper: 6},
    sparsityFactor: [1, 2, 3, 4, 5,],
    speed: {lower: 0, upper: 0},
}

const getRays = (sparsityFactor) => {
    const rays = [];

    for (let i = 0; i < 360; i = i + sparsityFactor) {
        rays.push({
            length: {
                lower: getRandomIntInclusive(config.lengthRange.bottom.lower, config.lengthRange.bottom.upper),
                upper: getRandomIntInclusive(config.lengthRange.top.lower, config.lengthRange.top.upper)
            }, lengthTimes: getRandomIntInclusive(config.lengthTimes.lower, config.lengthTimes.upper)
        });
    }

    return rays;
}

const computeInitialInfo = (num) => {
    const info = [];
    for (let i = 0; i <= num; i++) {
        info.push({
            radius: config.radiusGap * (i + 1),
            color: getNeutralFromBucket(),
            outerColor: getColorFromBucket(),
            featherTimes: getRandomIntInclusive(config.featherTimes.lower, config.featherTimes.upper),
            accentRange: {
                lower: getRandomIntInclusive(config.accentRange.bottom.lower, config.accentRange.bottom.upper),
                upper: getRandomIntInclusive(config.accentRange.top.lower, config.accentRange.top.upper)
            },
            sparsityFactor: getRandomFromArray(config.sparsityFactor) * (config.densityFactor / (i + 1)),
            speed: getRandomIntInclusive(config.speed.lower, config.speed.upper),
        });
    }

    for (let c = 0; c < info.length; c++) {
        info[c].rays = getRays(info[c].sparsityFactor);
    }

    return info;
}

export const generate = () => {
    const data = {
        layerOpacity: config.layerOpacity,
        underLayerOpacity: config.underLayerOpacity,
        numberOfCircles: getRandomIntInclusive(config.circles.lower, config.circles.upper),
        height: finalImageSize.height,
        width: finalImageSize.width,
        stroke: config.stroke,
        thickness: config.thickness,
        rayStroke: config.rayStroke,
        rayThickness: config.rayThickness,
        innerColor: getColorFromBucket(),
        scaleFactor: config.scaleFactor,
        center: {x: finalImageSize.width / 2, y: finalImageSize.height / 2},
        blurRange: {
            lower: getRandomIntInclusive(config.blurRange.bottom.lower, config.blurRange.bottom.upper),
            upper: getRandomIntInclusive(config.blurRange.top.lower, config.blurRange.top.upper)
        },
        getInfo: () => {
            return `${rayRingEffect.name}: ${data.numberOfCircles} ray rings`
        }
    }

    data.circles = computeInitialInfo(data.numberOfCircles);

    return data;
}