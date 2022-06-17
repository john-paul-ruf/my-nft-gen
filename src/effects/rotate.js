import {getRandomInt} from "../logic/random.js";

const config = {
    times:  {lower: 2, upper: 5},
}

const generate = () => {
    return {
        times: getRandomInt(config.lower, config.upper)
    }
}

const rotate = async (img, currentFrame, totalFrame) => {
    const data = generate();
    return await img.rotate((((360 * data.times)/totalFrame)*currentFrame), false);
}

export const rotateStrategy = {
    invoke: (img, currentFrame, totalFrames) => rotate(img, currentFrame, totalFrames)
}

export const rotateEffect = {
    name: 'rotate',
    effect: rotateStrategy,
    effectChance: 90,
    requiresLayer: false,
}

