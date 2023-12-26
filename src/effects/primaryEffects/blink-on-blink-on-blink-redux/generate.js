import {fileURLToPath} from "url";
import path from "path";
import {blinkOnEffect} from "./effect.js";
import {getRandomIntInclusive} from "../../../core/math/random.js";

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
            initialRotation: getRandomIntInclusive(config.initialRotation.lower, config.initialRotation.upper),
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

export const generate = async (settings) => {
    const finalImageSize = await GlobalSettings.getFinalImageSize();

    const config = {
        layerOpacity: 0.75,
        numberOfBlinks: {lower: 1, upper: 2},
        initialRotation: {lower: 0, upper: 360},
        rotationSpeedRange: {lower: 1, upper: 2},
        counterClockwise: {lower: 0, upper: 1},
        diameterRange: {lower: finalImageSize.shortestSide * 0.25, upper: finalImageSize.longestSide * 0.8},
        glowLowerRange: {lower: -128, upper: -64},
        glowUpperRange: {lower: 64, upper: 128},
        glowTimes: {lower: 2, upper: 4},
        randomizeSpin: {lower: -64, upper: 64},
        randomizeRed: {lower: -64, upper: 64},
        randomizeBlue: {lower: -64, upper: 64},
        randomizeGreen: {lower: -64, upper: 64}
    }

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