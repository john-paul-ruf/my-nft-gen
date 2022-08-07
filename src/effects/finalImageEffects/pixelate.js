import {findValue} from "../../logic/math/findValue.js";
import {getRandomIntInclusive, randomId} from "../../logic/math/random.js";
import Jimp from "jimp";
import fs from "fs";
import {WORKINGDIRETORY} from "../../logic/core/gobals.js";

const config = {
    lowerRange: {lower: 1, upper: 5},
    upperRange: {lower: 5, upper: 10},
    times: {lower: 1, upper: 4},
}

const generate = () => {

    const data =
        {
            lower: getRandomIntInclusive(config.lowerRange.lower, config.lowerRange.upper),
            upper: getRandomIntInclusive(config.upperRange.lower, config.upperRange.upper),
            times: getRandomIntInclusive(config.times.lower, config.times.upper),
            getInfo: () => {
                return `${pixelateEffect.name}: ${data.times} times, ${data.lower} to ${data.upper}`
            }
        }
    return data;
}

const pixelate = async (data, layer, currentFrame, totalFrames) => {
    const filename = WORKINGDIRETORY + 'pixelate' + randomId() + '.png';

    await layer.toFile(filename);

    const jimpImage = await Jimp.read(filename);

    const pixelateGaston = Math.floor(findValue(data.lower, data.upper, data.times, totalFrames, currentFrame));
    await jimpImage.pixelate(pixelateGaston);

    await jimpImage.writeAsync(filename);

    await layer.fromFile(filename);

    fs.unlinkSync(filename);
}

export const effect = {
    invoke: (data, layer, currentFrame, totalFrames) => pixelate(data, layer, currentFrame, totalFrames)
}

export const pixelateEffect = {
    name: 'pixelate',
    generateData: generate,
    effect: effect,
    effectChance: 5,
    requiresLayer: false,
}


