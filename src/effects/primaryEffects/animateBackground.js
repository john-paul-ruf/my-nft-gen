import Jimp from "jimp";
import {getRandomIntInclusive} from "../../logic/random.js";
import {getColorFromBucket, getNeutralFromBucket, IMAGESIZE} from "../../logic/gobals.js";

const config = {
    width: IMAGESIZE,
    height: IMAGESIZE,
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

const animateBackground = async (data, img) => {
    for (let x = 0; x < 3000; x++) {
        for (let y = 0; y < 3000; y++) {
            const rando = getRandomIntInclusive(0, 20)
            if (rando < 15) {
                await img.setPixelColor(Jimp.cssColorToHex(data.color1), x, y)
            } else if (rando < 18) {
                await img.setPixelColor(Jimp.cssColorToHex(data.color2), x, y)
            } else {
                await img.setPixelColor(Jimp.cssColorToHex(data.color3), x, y)
            }
        }
    }
    await img.blur(1)
}

export const effect = {
    invoke: (data, img) => animateBackground(data, img)
}

export const animateBackgroundEffect = {
    name: 'static background',
    generateData: generate,
    effect: effect,
    effectChance: 50,
    requiresLayer: true,
    rotatesImg: false,
    allowsRotation: false,
    rotationTotalAngle: 0,
}

