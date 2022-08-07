import Jimp from "jimp";
import {getRandomIntInclusive, randomId} from "../../logic/math/random.js";
import {
    getColorFromBucket,
    getNeutralFromBucket,
    IMAGEHEIGHT,
    IMAGEWIDTH,
    WORKINGDIRETORY
} from "../../logic/core/gobals.js";
import fs from "fs";

const config = {
    width: IMAGEWIDTH,
    height: IMAGEHEIGHT,
    color1: getNeutralFromBucket(),
    color2: getNeutralFromBucket(),
    color3: getColorFromBucket(),
    getInfo: () => {
        return `${animateBackgroundEffect.name}`
    }
}

const generate = () => {
    return config;
}

const animateBackground = async (data, layer) => {
    const filename = WORKINGDIRETORY + 'static' + randomId() + '.png';

    const jimpImage = new Jimp(data.width, data.height);

    for (let x = 0; x < data.width; x++) {
        for (let y = 0; y < data.height; y++) {
            const rando = getRandomIntInclusive(0, 20)
            if (rando < 15) {
                await jimpImage.setPixelColor(Jimp.cssColorToHex(data.color1), x, y)
            } else if (rando < 18) {
                await jimpImage.setPixelColor(Jimp.cssColorToHex(data.color2), x, y)
            } else {
                await jimpImage.setPixelColor(Jimp.cssColorToHex(data.color3), x, y)
            }
        }
    }

    await jimpImage.writeAsync(filename)

    await layer.fromFile(filename);

    await layer.blur(1)

    fs.unlinkSync(filename);
}

export const effect = {
    invoke: (data, layer) => animateBackground(data, layer)
}

export const animateBackgroundEffect = {
    name: 'static background',
    generateData: generate,
    effect: effect,
    effectChance: 50,
    requiresLayer: true,
}

