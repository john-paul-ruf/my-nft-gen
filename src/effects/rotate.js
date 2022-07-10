import {getRandomInt, randomNumber} from "../logic/random.js";

const config = {
    times: {lower: 0.5, upper: 0.5},
    counterClockwise: {lower: 0, upper: 2}
}

const generate = () => {

    const data = {
        times: randomNumber(config.times.lower, config.times.upper),
        counterClockwise: getRandomInt(config.counterClockwise.lower, config.counterClockwise.upper),
        getInfo: () => {
            return `${rotateEffect.name}: ${data.times.toFixed(3)} times, direction: ${data.counterClockwise > 0 ? 'counter' : 'clockwise'}`
        }
    }

    return data;
}

const rotate = async (data, img, currentFrame, totalFrame) => {
    const direction = data.counterClockwise > 0 ? -1 : 1;
    await img.rotate((((360 * data.times) / totalFrame) * currentFrame * direction), false);
}

export const effect = {
    invoke: (data, img, currentFrame, totalFrames) => rotate(data, img, currentFrame, totalFrames)
}

export const rotateEffect = {
    name: 'rotate',
    generateData: generate,
    effect: effect,
    effectChance: 50,
    requiresLayer: false,
    rotatesImg: true,
    allowsRotation: false,
}

