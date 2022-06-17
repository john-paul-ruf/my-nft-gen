import {getRandomInt} from "../logic/random.js";

const config = {
    times:  {lower: 1, upper: 3},
}

const generate = () => {
    return {
        times: getRandomInt(config.times.lower, config.times.upper)
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

