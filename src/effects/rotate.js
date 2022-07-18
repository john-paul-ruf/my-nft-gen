import {getRandomInt, randomNumber} from "../logic/random.js";

const config = {
    counterClockwise: {lower: 0, upper: 2}
}

const generate = () => {

    const data = {
        counterClockwise: getRandomInt(config.counterClockwise.lower, config.counterClockwise.upper),
        getInfo: () => {
            return `${rotateEffect.name}: direction: ${data.counterClockwise > 0 ? 'clockwise' : 'counter'}`
        }
    }

    return data;
}

const rotate = async (data, img, currentFrame, totalFrame, card) => {
    const direction = data.counterClockwise > 0 ? -1 : 1;
    await img.rotate(((card.rotationTotalAngle/ totalFrame) * currentFrame * direction), false);
}

export const effect = {
    invoke: (data, img, currentFrame, totalFrames, card) => rotate(data, img, currentFrame, totalFrames, card)
}

export const rotateEffect = {
    name: 'rotate',
    generateData: generate,
    effect: effect,
    effectChance: 0,
    requiresLayer: false,
    rotatesImg: true,
    allowsRotation: false,
    rotationTotalAngle: 0,
}

