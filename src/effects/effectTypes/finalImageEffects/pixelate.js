import {findValue} from "../../../core/math/findValue.js";
import {getRandomIntInclusive, randomId} from "../../../core/math/random.js";
import Jimp from "jimp";
import fs from "fs";
import {getWorkingDirectory} from "../../../core/GlobalSettings.js";

const config = {
    lowerRange: {lower: 0, upper: 0},
    upperRange: {lower: 1, upper: 2},
    times: {lower: 5, upper: 10},
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

const pixelate = async (layer, data, currentFrame, totalFrames) => {
    const filename = getWorkingDirectory() + 'pixelate' + randomId() + '.png';

    await layer.toFile(filename);

    const jimpImage = await Jimp.read(filename);

    const pixelateGaston = Math.floor(findValue(data.lower, data.upper, data.times, totalFrames, currentFrame));
    await jimpImage.pixelate(pixelateGaston);

    await jimpImage.writeAsync(filename);

    await layer.fromFile(filename);

    fs.unlinkSync(filename);
}

export const effect = {
    invoke: (layer, data, currentFrame, totalFrames) => pixelate(layer, data, currentFrame, totalFrames)
}

export const pixelateEffect = {
    name: 'pixelate',
    generateData: generate,
    effect: effect,
    effectChance: 50,
    requiresLayer: false,
}


