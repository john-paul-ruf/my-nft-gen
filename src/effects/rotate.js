import {getRandomInt} from "../logic/random.js";

const config = {
    times:  {lower: 2, upper: 5},
}

const generate = () => {
    return {
        times: getRandomInt(config.lower, config.upper)
    }
}

const rotate = async (data, img, currentFrame, totalFrame) => {
    await img.rotate((((360 * data.times)/totalFrame)*currentFrame), false);
}

export const effect = {
    invoke: (data, img, currentFrame, totalFrames) => rotate(data, img, currentFrame, totalFrames)
}

export const rotateEffect = {
    name: 'rotate',
    generateData: generate,
    effect: effect,
    effectChance: 90,
    requiresLayer: false,
    baseLayer:false,
}

