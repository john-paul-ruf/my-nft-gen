import {findValue} from "../logic/findValue.js";
import Jimp from "jimp";
import {getImagePaths} from "../logic/getImagePaths.js";
import {getRandomInt} from "../logic/random.js";


const config = {
    times:  {lower: 2, upper: 5},
}

const generate = () => {
    return {
        times: getRandomInt(config.lower, config.upper)
    }
}

const radiate = async (img, currentFrame, totalFrames) => {

    const data = generate();

    const alpha = Math.ceil(findValue(2, 15, data.times, totalFrames, currentFrame));
    let overlay = new Jimp(img.bitmap.width,img.bitmap.height);

    let hex = '#00FF00';
    hex = hex + alpha.toString(16) + alpha.toString(16);

    const paths = await getImagePaths(img);

    paths.forEach(path => {
        path.forEach(pos => {
            let color = Jimp.cssColorToHex(hex)
            overlay.setPixelColor(color, pos.x, pos.y)
        })
    })

    overlay.blur(2);

    await img.composite(overlay, 0, 0, {
        mode: Jimp.BLEND_SOURCE_OVER,
    })
}

export const radiateStrategy = {
    invoke: (img, currentFrame, totalFrames) => radiate(img, currentFrame, totalFrames)
}

export const radiateEffect = {
    name: 'radiate',
    effect: radiateStrategy,
    effectChance: 50,
    requiresLayer: false,
}



