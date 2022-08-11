import {findValue} from "../../logic/math/findValue.js";
import {getRandomIntInclusive, randomId} from "../../logic/math/random.js";
import Jimp from "jimp";
import fs from "fs";
import {WORKINGDIRETORY} from "../../logic/core/gobals.js";

const config = {
    lowerRange: {lower: -22, upper: 0},
    upperRange: {lower: 0, upper: 22},
    times: {lower: 3, upper: 6},
}

const generate = () => {
    const data = {
        lower: getRandomIntInclusive(config.lowerRange.lower, config.lowerRange.upper),
        upper: getRandomIntInclusive(config.upperRange.lower, config.upperRange.upper),
        times: getRandomIntInclusive(config.times.lower, config.times.upper),
        getInfo: () => {
            return `${glowEffect.name}: ${data.times} times, ${data.lower} to ${data.upper}`
        }
    }

    return data;
}

const glowAnimated = async (data, layer, currentFrame, totalFrames) => {
    const filename = WORKINGDIRETORY + 'glow' + randomId() + '.png';

    await layer.toFile(filename);

    const jimpImage = await Jimp.read(filename);

    const hue = findValue(data.lower, data.upper, data.times, totalFrames, currentFrame)
    await jimpImage.color([{apply: 'hue', params: [hue]}]);

    await jimpImage.writeAsync(filename);

    await layer.fromFile(filename);

    fs.unlinkSync(filename)
}

export const effect = {
    invoke: (data, layer, currentFrame, totalFrames) => glowAnimated(data, layer, currentFrame, totalFrames)
}

export const glowEffect = {
    name: 'glow',
    generateData: generate,
    effect: effect,
    effectChance: 20,
    requiresLayer: false,
}

