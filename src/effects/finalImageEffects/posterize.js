import {findValue} from "../../logic/math/findValue.js";
import {getRandomIntInclusive, randomId} from "../../logic/math/random.js";
import Jimp from "jimp";
import fs from "fs";
import {getWorkingDirectory} from "../../logic/core/gobals.js";

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
                return `${posterizeEffect.name}: ${data.times} times, ${data.lower} to ${data.upper}`
            }
        }
    return data;
}

const posterize = async (data, layer, currentFrame, totalFrames) => {
    const filename = getWorkingDirectory() + 'pixelate' + randomId() + '.png';

    await layer.toFile(filename);

    const jimpImage = await Jimp.read(filename);

    const posterizeGaston = Math.floor(findValue(data.lower, data.upper, data.times, totalFrames, currentFrame));
    jimpImage.posterize(posterizeGaston);

    await jimpImage.writeAsync(filename);

    await layer.fromFile(filename);

    fs.unlinkSync(filename);
}

export const effect = {
    invoke: (data, layer, currentFrame, totalFrames) => posterize(data, layer, currentFrame, totalFrames)
}

export const posterizeEffect = {
    name: 'posterize',
    generateData: generate,
    effect: effect,
    effectChance: 0, //the new worst effect
    requiresLayer: false,
}


