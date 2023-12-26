import {getRandomIntExclusive, getRandomIntInclusive} from "../../../core/math/random.js";
import {gatesEffect} from "./effect.js";

export const generate = async (settings) => {

    const finalImageSize = await GlobalSettings.getFinalImageSize();

    const config = {
        layerOpacity: 1,
        underLayerOpacity: 0.5,
        gates: {lower: 1, upper: 3},
        numberOfSides: {lower: 4, upper: 4},
        thickness: 24,
        stroke: 0,
        accentRange: {bottom: {lower: 2, upper: 5}, top: {lower: 10, upper: 15}},
        blurRange: {bottom: {lower: 1, upper: 2}, top: {lower: 3, upper: 4}},
        featherTimes: {lower: 2, upper: 4},
    }

    const data = {
        layerOpacity: config.layerOpacity,
        underLayerOpacity: config.underLayerOpacity,
        numberOfGates: getRandomIntInclusive(config.gates.lower, config.gates.upper),
        numberOfSides: getRandomIntInclusive(config.numberOfSides.lower, config.numberOfSides.upper),
        height: finalImageSize.height,
        width: finalImageSize.width,
        thickness: config.thickness,
        stroke: config.stroke,
        center: {x: finalImageSize.width / 2, y: finalImageSize.height / 2},
        blurRange: {
            lower: getRandomIntInclusive(config.blurRange.bottom.lower, config.blurRange.bottom.upper),
            upper: getRandomIntInclusive(config.blurRange.top.lower, config.blurRange.top.upper)
        },
        getInfo: () => {
            return `${gatesEffect.name}: ${data.numberOfGates} gates`
        }
    }

    const computeInitialInfo = async (num) => {
        const info = [];
        for (let i = 0; i <= num; i++) {
            info.push({
                radius: getRandomIntExclusive(finalImageSize.shortestSide * 0.05, finalImageSize.shortestSide * 0.48),
                color: await settings.getColorFromBucket(),
                innerColor: await settings.getNeutralFromBucket(),
                accentRange: {
                    lower: getRandomIntInclusive(config.accentRange.bottom.lower, config.accentRange.bottom.upper),
                    upper: getRandomIntInclusive(config.accentRange.top.lower, config.accentRange.top.upper)
                },
                featherTimes: getRandomIntInclusive(config.featherTimes.lower, config.featherTimes.upper),
                startingAngle: 45,
            });
        }
        return info;
    }

    data.gates = await computeInitialInfo(data.numberOfGates);

    return data;
}