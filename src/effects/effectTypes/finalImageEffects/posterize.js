import {findValue} from "../../../core/math/findValue.js";
import {getRandomIntInclusive, randomId} from "../../../core/math/random.js";
import Jimp from "jimp";
import fs from "fs";
import {getWorkingDirectory} from "../../../core/GlobalSettings.js";

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

const posterize = async (layer, data, currentFrame, totalFrames) => {
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
    invoke: (layer, data, currentFrame, totalFrames) => posterize(layer, data, currentFrame, totalFrames)
}

export const posterizeEffect = {
    name: 'posterize',
    generateData: generate,
    effect: effect,
    effectChance: 0, //the new worst effect
    requiresLayer: false,
}


