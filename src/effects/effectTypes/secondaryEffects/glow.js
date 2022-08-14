import {findValue} from "../../../core/math/findValue.js";
import {getRandomIntInclusive, randomId} from "../../../core/math/random.js";
import Jimp from "jimp";
import fs from "fs";
import {getWorkingDirectory} from "../../../core/GlobalSettings.js";

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

const glowAnimated = async (layer, data, currentFrame, totalFrames) => {
    const filename = getWorkingDirectory() + 'glow' + randomId() + '.png';

    await layer.toFile(filename);

    const jimpImage = await Jimp.read(filename);

    const hue = findValue(data.lower, data.upper, data.times, totalFrames, currentFrame)
    await jimpImage.color([{apply: 'hue', params: [hue]}]);

    await jimpImage.writeAsync(filename);

    await layer.fromFile(filename);

    fs.unlinkSync(filename)
}

export const effect = {
    invoke: (layer, data, currentFrame, totalFrames) => glowAnimated(layer, data, currentFrame, totalFrames)
}

export const glowEffect = {
    name: 'glow',
    generateData: generate,
    effect: effect,
    effectChance: 50,
    requiresLayer: false,
}

