import {findValue} from "../../logic/findValue.js";
import Jimp from "jimp";
import {getImagePaths} from "../../logic/getImagePaths.js";
import {getRandomIntInclusive} from "../../logic/random.js";

/**
 *
 * This effect is junk.  Costly, adds little to the final piece.
 *
 * @type {{times: {lower: number, upper: number}}}
 */
const config = {
    times: {lower: 1, upper: 3},
}

const generate = () => {
    const data = {
        times: getRandomIntInclusive(config.times.lower, config.times.upper),
        getInfo: () => {
            return `${radiateEffect.name}: ${data.times} times`
        }
    }

    return data;
}

const radiate = async (data, img, currentFrame, totalFrames) => {

    const alpha = Math.ceil(findValue(128, 255, data.times, totalFrames, currentFrame));
    let overlay = new Jimp(img.bitmap.width, img.bitmap.height);

    let hex = '#00FF00';
    const theRadiateGaston = Math.ceil(findValue(8, 16, data.times, totalFrames, currentFrame));
    hex = hex + alpha.toString(theRadiateGaston);
    let color = Jimp.cssColorToHex(hex)

    const paths = await getImagePaths(img);

    paths.forEach(path => {
        path.forEach(pos => {
            overlay.setPixelColor(color, pos.x, pos.y)
        })
    })

    overlay.blur(1);

    await img.composite(overlay, 0, 0, {
        mode: Jimp.BLEND_SOURCE_OVER,
    })
}

export const effect = {
    invoke: (data, img, currentFrame, totalFrames) => radiate(data, img, currentFrame, totalFrames)
}

export const radiateEffect = {
    name: 'radiate',
    generateData: generate,
    effect: effect,
    effectChance: 0, //check top level comments
    requiresLayer: false,
    rotatesImg: false,
    allowsRotation: false,
    rotationTotalAngle: 0,
}



