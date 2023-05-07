import {fileURLToPath} from "url";
import path from "path";
import {blinkOnEffect} from "./effect.js";
import {getFinalImageSize} from "../../../../core/GlobalSettings.js";
import {getRandomIntInclusive} from "../../../../core/math/random.js";

const finalImageSize = getFinalImageSize();

const config = {
    layerOpacity: 0.5,
    numberOfBlinks: {lower: 3, upper: 10},
    rotationSpeedRange: {lower: 1, upper: 1},
    counterClockwise: {lower: 0, upper: 1},
    diameterRange: {lower: finalImageSize.longestSide * 0.1, upper: finalImageSize.longestSide * 0.9},
    glowLowerRange: {lower: -128, upper: -64},
    glowUpperRange: {lower: 64, upper: 128},
    glowTimes: {lower: 3, upper: 6},
    randomizeSpin: {lower: -128, upper: 128},
    randomizeRed: {lower: -128, upper: 128},
    randomizeBlue: {lower: -128, upper: 128},
    randomizeGreen: {lower: -128, upper: 128}
}

const computeInitialInfo = (num) => {
    const info = [];
    for (let i = 0; i <= num; i++) {
        const props = {
            hue: getRandomIntInclusive(config.randomizeSpin.lower, config.randomizeSpin.upper),
            red: getRandomIntInclusive(config.randomizeRed.lower, config.randomizeRed.upper),
            green: getRandomIntInclusive(config.randomizeGreen.lower, config.randomizeGreen.upper),
            blue: getRandomIntInclusive(config.randomizeBlue.lower, config.randomizeBlue.upper),
        }

        info.push({
            rotationSpeedRange: getRandomIntInclusive(config.rotationSpeedRange.lower, config.rotationSpeedRange.upper),
            counterClockwise: getRandomIntInclusive(config.counterClockwise.lower, config.counterClockwise.upper),
            diameter: getRandomIntInclusive(config.diameterRange.lower, config.diameterRange.upper),
            glowLowerRange: getRandomIntInclusive(config.glowLowerRange.lower, config.glowLowerRange.upper),
            glowUpperRange: getRandomIntInclusive(config.glowUpperRange.lower, config.glowUpperRange.upper),
            glowTimes: getRandomIntInclusive(config.glowTimes.lower, config.glowTimes.upper),
            randomize: [
                {
                    apply: 'hue',
                    params: [props.hue]
                },
                {
                    apply: 'red',
                    params: [props.red]
                },
                {
                    apply: 'green',
                    params: [props.green]
                },
                {
                    apply: 'blue',
                    params: [props.blue]
                }
            ]
        });
    }
    return info;
}

export const generate = () => {
    const data = {
        blinkFile: path.join(fileURLToPath(import.meta.url).replace('generate.js', '') + 'blink.png'),
        layerOpacity: config.layerOpacity,
        numberOfBlinks: getRandomIntInclusive(config.numberOfBlinks.lower, config.numberOfBlinks.upper),
        getInfo: () => {
            return `${blinkOnEffect.name}: ${data.numberOfBlinks} blinks`
        }
    }

    data.blinkArray = computeInitialInfo(data.numberOfBlinks);

    return data;
}
