//worst effect ever
import {findValue} from "../../logic/findValue.js";
import Jimp from "jimp";
import {getImagePaths} from "../../logic/getImagePaths.js";
import {getRandomIntInclusive} from "../../logic/random.js";

const config = {
    times: {lower: 2, upper: 5},
}

const generate = () => {
    return {
        times: getRandomIntInclusive(config.times.lower, config.times.upper)
    }
}

const trace = async (data, img, currentFrame, totalFrames, card) => {

    let overlay = new Jimp(img.bitmap.width, img.bitmap.height);

    let hex = '#00FF00';
    let color = Jimp.cssColorToHex(hex)

    const paths = await getImagePaths(img);

    paths.forEach(path => {
        const point = Math.floor(findValue(0, path.length - 1, data.times, totalFrames, currentFrame));
        overlay.setPixelColor(color, path[point].x, path[point].y + 1)
        overlay.setPixelColor(color, path[point].x + 1, path[point].y + 1)
        overlay.setPixelColor(color, path[point].x - 1, path[point].y)
        overlay.setPixelColor(color, path[point].x - 1, path[point].y - 1)
        overlay.setPixelColor(color, path[point].x, path[point].y)
    })

    await img.composite(overlay, 0, 0, {
        mode: Jimp.BLEND_SOURCE_OVER,
    })
}

export const effect = {
    invoke: (data, img, currentFrame, totalFrames, card) => trace(data, img, currentFrame, totalFrames, card)
}

export const traceEffect = {
    name: 'trace',
    generateData: generate,
    effect: effect,
    effectChance: 0,
    requiresLayer: false,
    rotatesImg: false,
    allowsRotation: false,
    rotationTotalAngle: 0,
}



