import {randomNumber} from "../logic/random.js";
import {verticalScanLinesEffect} from "./verticalScanLines.js";

const config = {
    times:  {lower: 0.5, upper: 0.5},
}

const generate = () => {

    const data = {
        times: randomNumber(config.times.lower, config.times.upper),
        getInfo: () => {
            return `${rotateEffect.name}: ${data.times.toFixed(3)} times`
        }
    }

    return data;
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
    rotatesImg:true,
    allowsRotation: false,
}

