import Jimp from "jimp";
import {getRandomIntInclusive} from "../logic/random.js";

const config = {
    width: 3000,
    height: 3000,
    color1:'#06040A',
    color2:'#1f1f1f',
    color3: '#016236'
}

const generate = () => {
    return config;
}

const animateBackground = async (data, img, currentFrame, totalFrames, card) => {
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
    invoke: (data, img, currentFrame, totalFrames, card) => animateBackground(data, img, currentFrame, totalFrames, card)
}

export const animateBackgroundEffect = {
    name: 'static',
    generateData: generate,
    effect: effect,
    effectChance: 0,
    requiresLayer: true,
    rotatesImg:false,
    allowsRotation: false,
    rotationTotalAngle: 0,
}

